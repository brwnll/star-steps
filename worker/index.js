// Star Steps search server (Cloudflare Worker).
// Holds the one YouTube API key so parents never need their own.
// The key lives in the secret YT_KEY; allowed sites are in ALLOWED_ORIGINS (wrangler.toml).
//
// GET /search?q=dinosaurs&type=video|channel  -> { items: [...] }   (costs 101 quota units)
// GET /channel?id=UC...  or  ?handle=@name    -> { id, title, thumb, videos: [...] }   (3 units)
// GET /videos?ids=abc,def                     -> { items: [...] }   (1 unit)

const API = 'https://www.googleapis.com/youtube/v3/';
const HOUR = 3600 * 1000;

// Best-effort cache inside this Worker instance, so repeat lookups don't spend quota.
const memo = new Map();
async function cached(key, ttl, fn) {
  const hit = memo.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await fn();
  if (memo.size > 500) memo.delete(memo.keys().next().value);
  memo.set(key, { value, expires: Date.now() + ttl });
  return value;
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function yt(env, path, params) {
  const url = new URL(API + path);
  for (const [k, v] of Object.entries({ ...params, key: env.YT_KEY })) url.searchParams.set(k, v);
  const r = await fetch(url);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const reason = j.error?.errors?.[0]?.reason;
    if (reason === 'quotaExceeded') throw new HttpError(429, "Today's YouTube search limit is used up. Try again tomorrow.");
    throw new HttpError(502, 'YouTube error: ' + (j.error?.message || r.status));
  }
  return j;
}

function isoSecs(d) {
  const m = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '') || [];
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
}

// Full details for up to 50 videos; drops ones that can't play inside the game.
async function videoDetails(env, ids) {
  if (!ids.length) return [];
  const j = await yt(env, 'videos', { part: 'snippet,contentDetails,status', id: ids.join(',') });
  return j.items
    .filter(x => x.status.embeddable && x.status.privacyStatus === 'public')
    .map(x => ({
      id: x.id, title: x.snippet.title, channel: x.snippet.channelTitle,
      secs: isoSecs(x.contentDetails.duration), kids: !!x.status.madeForKids,
    }));
}

async function search(env, q, type) {
  if (!q || q.length > 100) throw new HttpError(400, 'Search must be 1–100 characters.');
  if (type !== 'video' && type !== 'channel') throw new HttpError(400, 'type must be video or channel');
  const params = { part: 'snippet', q, type, maxResults: 24, safeSearch: 'strict' };
  if (type === 'video') params.videoEmbeddable = 'true';
  const j = await yt(env, 'search', params);
  if (type === 'channel') {
    return j.items.map(x => ({
      id: x.id.channelId, title: x.snippet.channelTitle || x.snippet.title,
      thumb: x.snippet.thumbnails?.default?.url || '', description: x.snippet.description,
    }));
  }
  return videoDetails(env, j.items.map(x => x.id.videoId).filter(Boolean));
}

async function channel(env, query) {
  const c = await yt(env, 'channels', { part: 'snippet,contentDetails', ...query });
  const ch = c.items?.[0];
  if (!ch) throw new HttpError(404, 'Channel not found');
  const pl = await yt(env, 'playlistItems', { part: 'contentDetails', maxResults: 50, playlistId: ch.contentDetails.relatedPlaylists.uploads });
  const videos = (await videoDetails(env, pl.items.map(i => i.contentDetails.videoId)))
    .filter(v => v.secs >= 60); // skip Shorts
  return { id: ch.id, title: ch.snippet.title, thumb: ch.snippet.thumbnails?.default?.url || '', videos };
}

async function route(url, env) {
  const p = url.searchParams;
  switch (url.pathname) {
    case '/search': {
      const q = (p.get('q') || '').trim(), type = p.get('type') || 'video';
      return { items: await cached(`s:${type}:${q.toLowerCase()}`, 6 * HOUR, () => search(env, q, type)) };
    }
    case '/channel': {
      const id = p.get('id'), handle = p.get('handle');
      let query;
      if (id && /^UC[\w-]{22}$/.test(id)) query = { id };
      else if (handle && /^@?[\w.\-]{1,100}$/.test(handle)) query = { forHandle: handle.startsWith('@') ? handle : '@' + handle };
      else throw new HttpError(400, 'Need a channel id or @handle');
      return cached(`c:${JSON.stringify(query)}`, 6 * HOUR, () => channel(env, query));
    }
    case '/videos': {
      const ids = (p.get('ids') || '').split(',').filter(s => /^[\w-]{11}$/.test(s)).slice(0, 50);
      if (!ids.length) throw new HttpError(400, 'Need video ids');
      return { items: await cached(`v:${ids.join(',')}`, 24 * HOUR, () => videoDetails(env, ids)) };
    }
    default:
      throw new HttpError(404, 'Not found');
  }
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const cors = { 'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || '', Vary: 'Origin' };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Max-Age': '86400' } });
    }
    // Only the game's own site may use the key.
    if (!allowed.includes(origin)) return json({ error: 'Not allowed' }, 403);
    if (request.method !== 'GET') return json({ error: 'GET only' }, 405);
    if (!env.YT_KEY) return json({ error: 'Server has no YouTube key yet (YT_KEY secret).' }, 500);

    try {
      return json(await route(new URL(request.url), env));
    } catch (e) {
      return json({ error: e.message }, e.status || 500);
    }
  },
};
