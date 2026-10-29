// Tests the Worker with fake YouTube responses (no key or network needed).
// Usage: node worker/test-worker.mjs
import worker from './index.js';
import assert from 'node:assert/strict';

const env = { YT_KEY: 'test-key', ALLOWED_ORIGINS: 'https://brwnll.github.io,http://localhost:8765' };
const calls = [];
const vid = (id, secs, opts = {}) => ({
  id, snippet: { title: 'Video ' + id, channelTitle: 'Kids Ch' },
  contentDetails: { duration: `PT${Math.floor(secs / 60)}M${secs % 60}S` },
  status: { embeddable: opts.embeddable ?? true, privacyStatus: opts.privacy ?? 'public', madeForKids: opts.kids ?? true },
});
const FAKE = {
  search: p => p.get('type') === 'channel'
    ? { items: [{ id: { channelId: 'UC' + 'a'.repeat(22) }, snippet: { title: 'Numberblocks', channelTitle: 'Numberblocks', description: 'Counting', thumbnails: { default: { url: 'https://x/t.jpg' } } } }] }
    : { items: [{ id: { videoId: 'aaaaaaaaaaa' } }, { id: { videoId: 'bbbbbbbbbbb' } }] },
  videos: p => ({ items: p.get('id').split(',').map((id, i) => vid(id, 30 + i * 200, { embeddable: id !== 'bbbbbbbbbbb' })) }),
  channels: () => ({ items: [{ id: 'UC' + 'a'.repeat(22), snippet: { title: 'Numberblocks', thumbnails: {} }, contentDetails: { relatedPlaylists: { uploads: 'UUx' } } }] }),
  playlistItems: () => ({ items: ['ccccccccccc', 'ddddddddddd'].map(videoId => ({ contentDetails: { videoId } })) }),
};
globalThis.fetch = async url => {
  const u = new URL(url); calls.push(u);
  const name = u.pathname.split('/').pop();
  if (u.searchParams.get('q') === 'boom') return new Response(JSON.stringify({ error: { errors: [{ reason: 'quotaExceeded' }] } }), { status: 403 });
  return new Response(JSON.stringify(FAKE[name](u.searchParams)), { status: 200 });
};

const get = async (path, origin = 'https://brwnll.github.io', e = env) => {
  const r = await worker.fetch(new Request('https://w.dev' + path, { headers: origin ? { Origin: origin } : {} }), e);
  return { status: r.status, cors: r.headers.get('Access-Control-Allow-Origin'), body: await r.json() };
};

// Video search: strict safe search, unembeddable video removed, key sent to YouTube only.
let r = await get('/search?q=counting&type=video');
assert.equal(r.status, 200);
assert.equal(r.cors, 'https://brwnll.github.io');
assert.deepEqual(r.body.items.map(v => v.id), ['aaaaaaaaaaa']);
assert.equal(calls[0].searchParams.get('safeSearch'), 'strict');
assert.equal(calls[0].searchParams.get('key'), 'test-key');
assert.ok(!JSON.stringify(r.body).includes('test-key'), 'key must never reach the browser');

// Same search again comes from cache.
const before = calls.length;
await get('/search?q=Counting&type=video');
assert.equal(calls.length, before, 'repeat search should be cached');

// Channel search and channel videos (Shorts under 60s dropped).
r = await get('/search?q=numberblocks&type=channel');
assert.equal(r.body.items[0].title, 'Numberblocks');
r = await get('/channel?handle=@numberblocks');
assert.equal(r.status, 200);
assert.deepEqual(r.body.videos.map(v => v.id), ['ddddddddddd']);
assert.equal(calls.find(c => c.pathname.endsWith('channels')).searchParams.get('forHandle'), '@numberblocks');

// Videos by id
r = await get('/videos?ids=eeeeeeeeeee,bad!');
assert.deepEqual(r.body.items.map(v => v.id), ['eeeeeeeeeee']);

// Locked to the game's own site
assert.equal((await get('/search?q=x', 'https://evil.example')).status, 403);
assert.equal((await get('/search?q=x', null)).status, 403);
assert.equal((await get('/search?q=x', 'http://localhost:8765')).cors, 'http://localhost:8765');

// Bad input and errors
assert.equal((await get('/search?q=&type=video')).status, 400);
assert.equal((await get('/search?q=x&type=playlist')).status, 400);
assert.equal((await get('/channel?id=nope')).status, 400);
assert.equal((await get('/nothing')).status, 404);
r = await get('/search?q=boom&type=video');
assert.equal(r.status, 429);
assert.match(r.body.error, /limit/);
assert.equal((await get('/search?q=x', 'https://brwnll.github.io', { ...env, YT_KEY: '' })).status, 500);

console.log('✅ Worker tests passed');
