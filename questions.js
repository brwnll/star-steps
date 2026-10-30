// Question generators for Star Steps, grades 1-3.
// Every question is built from code or a small word list, so the answer is computed, never typed by hand.
// Shape: { key, subject, grade, level, type, visual, text, say, choices: [...], answer, n?, hearChoices?, choiceClass? }
//   n: the numbers the question was built from, so test-questions.js can re-check the answer independently.
// Run `node test-questions.js` to check thousands of generated questions.
(function (root) {
  const Lessons = typeof require !== 'undefined' ? require('./lessons.js') : root.Lessons;
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const pickN = (arr, n) => shuffle(arr).slice(0, n);
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Choice helpers ----------
  // Three wrong numbers near the right one (never negative, never above `max`), all different.
  function numberChoices(answer, max, deltas = [-3, -2, -1, 1, 2, 3]) {
    const set = new Set([answer]);
    for (const d of shuffle(deltas)) {
      if (set.size >= 4) break;
      const v = answer + d;
      if (v >= 0 && v <= max) set.add(v);
    }
    for (let n = 0; set.size < 4; n++) set.add(n);
    return shuffle([...set]);
  }
  // Three wrong answers from `wrong`, topped up from `more` when there aren't enough.
  const threeWrong = (answer, wrong, more = []) => {
    const out = [...new Set([...wrong].filter(v => v !== answer))];
    for (const v of more) { if (out.length >= 3) break; if (v !== answer && !out.includes(v)) out.push(v); }
    return pickN(out.slice(0, Math.max(3, out.length)), 3);
  };
  const BIG_DELTAS = [-10, -1, 1, 10, -2, 2, -11, 11, 9, -9];
  // The answer plus three wrong strings taken from `pool`.
  const wordChoices = (answer, pool) => shuffle([answer, ...pickN(pool.filter(w => w !== answer), 3)]);

  // ---------- Visual helpers ----------
  const eq = s => `<div class="eq">${s}</div>`;
  const big = s => `<div class="bigword">${esc(s)}</div>`;
  const sentence = s => `<div class="sentence">${esc(s).replace('___', '<span class="blank">___</span>')}</div>`;

  function clockSvg(h, m) {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const a = i * 6 * Math.PI / 180, long = i % 5 === 0;
      ticks.push(`<line x1="${100 + Math.sin(a) * (long ? 82 : 88)}" y1="${100 - Math.cos(a) * (long ? 82 : 88)}" x2="${100 + Math.sin(a) * 94}" y2="${100 - Math.cos(a) * 94}" stroke="#2b2250" stroke-width="${long ? 4 : 2}"/>`);
    }
    const nums = [];
    for (let i = 1; i <= 12; i++) {
      const a = i * 30 * Math.PI / 180;
      nums.push(`<text x="${100 + Math.sin(a) * 68}" y="${100 - Math.cos(a) * 68 + 8}" text-anchor="middle" font-size="22" font-weight="700" fill="#2b2250">${i}</text>`);
    }
    const ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
    return `<svg viewBox="0 0 200 200" class="clock" aria-hidden="true">
      <circle cx="100" cy="100" r="97" fill="#fff" stroke="#7c5cff" stroke-width="6"/>${ticks.join('')}${nums.join('')}
      <line x1="100" y1="100" x2="${100 + Math.sin(ha) * 45}" y2="${100 - Math.cos(ha) * 45}" stroke="#2b2250" stroke-width="9" stroke-linecap="round"/>
      <line x1="100" y1="100" x2="${100 + Math.sin(ma) * 70}" y2="${100 - Math.cos(ma) * 70}" stroke="#ff5c9a" stroke-width="6" stroke-linecap="round"/>
      <circle cx="100" cy="100" r="7" fill="#2b2250"/></svg>`;
  }
  const COINS = { quarter: 25, dime: 10, nickel: 5, penny: 1 };
  const COIN_STYLE = { quarter: [44, '#c9c9d4', '25¢'], dime: [32, '#d6d6e0', '10¢'], nickel: [38, '#c4c4cf', '5¢'], penny: [34, '#d59a6a', '1¢'] };
  function coinsSvg(list) {
    const w = 110;
    return `<svg viewBox="0 0 ${list.length * w} 110" class="coins" style="width:${Math.min(100, list.length * 18)}%" aria-hidden="true">${list.map((c, i) => {
      const [r, fill, label] = COIN_STYLE[c];
      return `<circle cx="${i * w + 55}" cy="55" r="${r}" fill="${fill}" stroke="#555" stroke-width="3"/><text x="${i * w + 55}" y="63" text-anchor="middle" font-size="24" font-weight="700" fill="#2b2250">${label}</text>`;
    }).join('')}</svg>`;
  }
  function fractionSvg(k, n) {
    const parts = [];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const x0 = 100 + Math.cos(a0) * 90, y0 = 100 + Math.sin(a0) * 90, x1 = 100 + Math.cos(a1) * 90, y1 = 100 + Math.sin(a1) * 90;
      parts.push(`<path d="M100 100 L${x0} ${y0} A90 90 0 ${n === 1 ? 1 : 0} 1 ${x1} ${y1} Z" fill="${i < k ? '#ff9f1c' : '#fff'}" stroke="#2b2250" stroke-width="4"/>`);
    }
    return `<svg viewBox="0 0 200 200" class="fraction" aria-hidden="true">${parts.join('')}</svg>`;
  }

  function tenFrameSvg(k) {
    const cells = [];
    for (let i = 0; i < 10; i++) {
      const x = (i % 5) * 60 + 5, y = Math.floor(i / 5) * 60 + 5;
      cells.push(`<rect x="${x}" y="${y}" width="60" height="60" fill="#fff" stroke="#2b2250" stroke-width="4"/>`);
      if (i < k) cells.push(`<circle cx="${x + 30}" cy="${y + 30}" r="20" fill="#ff5c9a"/>`);
    }
    return `<svg viewBox="0 0 310 130" class="tenframe" aria-hidden="true">${cells.join('')}</svg>`;
  }
  function gridSvg(w, h) {
    const cells = [];
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) cells.push(`<rect x="${c * 40 + 4}" y="${r * 40 + 4}" width="40" height="40" fill="#ffd23f" stroke="#2b2250" stroke-width="3"/>`);
    return `<svg viewBox="0 0 ${w * 40 + 8} ${h * 40 + 8}" class="area" style="height:${Math.min(220, h * 40 + 20)}px" aria-hidden="true">${cells.join('')}</svg>`;
  }
  const arrayHtml = (emoji, r, c) => `<div class="count" style="grid-template-columns:repeat(${c}, 1fr);max-width:${c * 70}px;margin:auto">${`<span>${emoji}</span>`.repeat(r * c)}</div>`;

  // ---------- Grade 1 math ----------
  const COUNT_ITEMS = [
    ['🍎', 'apples'], ['⭐', 'stars'], ['🐞', 'ladybugs'], ['🎈', 'balloons'], ['🐟', 'fish'],
    ['🍓', 'strawberries'], ['🚗', 'cars'], ['🌸', 'flowers'], ['🦆', 'ducks'], ['🍪', 'cookies'],
    ['🐸', 'frogs'], ['🧁', 'cupcakes'], ['🦋', 'butterflies'], ['🍌', 'bananas'],
  ];
  const math1 = {
    add(max) {
      const a = rand(0, max - 1), b = rand(1, max - a), ans = a + b;
      return { key: `add${a}+${b}`, n: [a, b], visual: eq(`${a} + ${b} = <span class="q">?</span>`), text: 'Add them up!',
        say: `What is ${a} plus ${b}?`, choices: numberChoices(ans, max + 2), answer: ans };
    },
    sub(max) {
      const a = rand(2, max), b = rand(1, a), ans = a - b;
      return { key: `sub${a}-${b}`, n: [a, b], visual: eq(`${a} − ${b} = <span class="q">?</span>`), text: 'Take away!',
        say: `What is ${a} minus ${b}?`, choices: numberChoices(ans, max + 2), answer: ans };
    },
    count(max) {
      const n = rand(1, max === 10 ? 10 : 15), [emoji, name] = pick(COUNT_ITEMS);
      return { key: `count${n}${emoji}`, n: [n], visual: `<div class="count">${`<span>${emoji}</span>`.repeat(n)}</div>`,
        text: `How many ${name}?`, say: `How many ${name}? Count them!`, choices: numberChoices(n, max + 2), answer: n };
    },
    missing(max) {
      const total = rand(2, max), a = rand(0, total - 1), ans = total - a;
      return { key: `miss${a}_${total}`, n: [a, total], visual: eq(`${a} + <span class="q">?</span> = ${total}`), text: 'What number is missing?',
        say: `${a} plus what makes ${total}?`, choices: numberChoices(ans, max + 2), answer: ans };
    },
    compare(max) {
      const a = rand(0, max);
      let b; do { b = rand(0, max); } while (b === a);
      const bigger = Math.random() < 0.5, ans = bigger ? Math.max(a, b) : Math.min(a, b);
      return { key: `cmp${a}_${b}_${bigger}`, n: [a, b], bigger, visual: `<div class="pic">${bigger ? '🐘' : '🐭'}</div>`,
        text: `Which number is ${bigger ? 'BIGGER' : 'SMALLER'}?`, say: `Which number is ${bigger ? 'bigger' : 'smaller'}?`,
        choices: shuffle([a, b]), answer: ans };
    },
    tenframe() {
      const k = rand(1, 9), ans = 10 - k;
      return { key: `tf${k}`, n: [k], visual: tenFrameSvg(k), text: 'How many more to make 10?',
        say: `There are ${k} dots. How many more dots make 10?`, choices: numberChoices(ans, 10), answer: ans };
    },
    doubles(max) {
      const a = rand(1, max === 10 ? 5 : 10), ans = a + a;
      return { key: `dbl${a}`, n: [a], visual: eq(`${a} + ${a} = <span class="q">?</span>`), text: 'Doubles!',
        say: `What is ${a} plus ${a}? Double it!`, choices: numberChoices(ans, 22, [-2, 2, -1, 1, -4, 4, a]), answer: ans };
    },
    // Hour and half hour.
    clock() {
      const h = rand(1, 12), m = pick([0, 30]), ans = `${h}:${m === 0 ? '00' : '30'}`;
      const pool = [];
      for (let hh = 1; hh <= 12; hh++) for (const mm of ['00', '30']) pool.push(`${hh}:${mm}`);
      const near = pool.filter(t => t !== ans && (t.startsWith(`${h}:`) || t.startsWith(`${h % 12 + 1}:`) || t.startsWith(`${(h + 10) % 12 + 1}:`)));
      return { key: `clock${ans}`, n: [h, m], visual: clockSvg(h, m), text: 'What time is it?', say: 'What time does the clock show?',
        choices: shuffle([ans, ...pickN(near, 3)]), answer: ans, choiceClass: 'word' };
    },
  };

  // ---------- Grade 2 math ----------
  // Word problems. {a} and {b} are filled in; `op` says how the answer is made.
  const STORIES = [
    { op: 'add', e: '🍪', s: '{name} had {a} cookies. Mom baked {b} more. How many cookies now?' },
    { op: 'add', e: '🐟', s: '{name} saw {a} fish. Then {b} more swam by. How many fish in all?' },
    { op: 'add', e: '🚗', s: 'There were {a} cars in the lot. {b} more parked. How many cars now?' },
    { op: 'add', e: '📚', s: '{name} read {a} pages, then {b} more. How many pages in all?' },
    { op: 'sub', e: '🎈', s: '{name} had {a} balloons. {b} flew away. How many are left?' },
    { op: 'sub', e: '🍎', s: 'There were {a} apples. {name} ate {b}. How many are left?' },
    { op: 'sub', e: '🐦', s: '{a} birds sat on a wire. {b} flew off. How many stayed?' },
    { op: 'sub', e: '🧁', s: '{name} baked {a} cupcakes and gave away {b}. How many are left?' },
    { op: 'diff', e: '⭐', s: '{name} has {a} stickers. Jo has {b}. How many more does {name} have?' },
    { op: 'diff', e: '🐚', s: '{name} found {a} shells. Max found {b}. How many more did {name} find?' },
  ];
  const NAMES = ['Sam', 'Mia', 'Leo', 'Ava', 'Ben', 'Zoe', 'Eli', 'Nia', 'Kai', 'Ruby'];
  const math2 = {
    story(level) {
      const st = pick(STORIES), name = pick(NAMES), max = level === 1 ? 20 : 100;
      let a, b;
      if (st.op === 'add') { a = rand(2, max - 2); b = rand(1, max - a); }
      else { a = rand(3, max); b = rand(1, a - 1); }
      const ans = st.op === 'add' ? a + b : a - b;
      const text = st.s.replace(/{name}/g, name).replace('{a}', a).replace('{b}', b);
      return { key: `story${st.e}${a}_${b}`, n: [a, b], op: st.op, visual: `<div class="story"><span class="em">${st.e}</span>${esc(text)}</div>`,
        text: 'Read the story!', say: text, choices: numberChoices(ans, max + 5, level === 1 ? undefined : BIG_DELTAS), answer: ans };
    },
    array() {
      const r = rand(2, 5), c = rand(2, 5), ans = r * c, [emoji] = pick(COUNT_ITEMS);
      const wrong = new Set([r + c, ans + r, ans - r, ans + c, ans - c, ans + 1, ans - 1].filter(v => v > 0 && v !== ans));
      return { key: `arr${r}x${c}${emoji}`, n: [r, c], visual: arrayHtml(emoji, r, c), text: `${r} rows of ${c}. How many in all?`,
        say: `There are ${r} rows with ${c} in each row. How many in all?`, choices: shuffle([ans, ...threeWrong(ans, wrong, [ans + 2, ans + 3])]), answer: ans };
    },
    // level 1: no carrying; level 2: sums to 100 with carrying.
    add(level) {
      let a, b;
      if (level === 1) { do { a = rand(10, 49); b = rand(10, 49); } while (a % 10 + b % 10 >= 10); }
      else { do { a = rand(10, 89); b = rand(10, 89); } while (a + b > 100); }
      const ans = a + b;
      return { key: `add2_${a}+${b}`, n: [a, b], visual: eq(`${a} + ${b} = <span class="q">?</span>`), text: 'Add them up!',
        say: `What is ${a} plus ${b}?`, choices: numberChoices(ans, 110, BIG_DELTAS), answer: ans };
    },
    sub(level) {
      let a, b;
      if (level === 1) { do { a = rand(20, 99); b = rand(10, a - 1); } while (a % 10 < b % 10); }
      else { a = rand(20, 99); b = rand(10, a - 1); }
      const ans = a - b;
      return { key: `sub2_${a}-${b}`, n: [a, b], visual: eq(`${a} − ${b} = <span class="q">?</span>`), text: 'Take away!',
        say: `What is ${a} minus ${b}?`, choices: numberChoices(ans, 110, BIG_DELTAS), answer: ans };
    },
    skip(level) {
      const step = pick(level === 1 ? [2, 5, 10] : [2, 3, 5, 10]), start = step * rand(1, 6);
      const seq = [start, start + step, start + 2 * step], ans = start + 3 * step;
      return { key: `skip${step}_${start}`, n: [step, start], visual: eq(`${seq.join(', ')}, <span class="q">?</span>`),
        text: 'What number comes next?', say: `${seq.join(', ')}. What comes next?`,
        choices: numberChoices(ans, 200, [-step, step, -1, 1, -2, 2, step * 2]), answer: ans };
    },
    place() {
      const tens = rand(1, 9), ones = rand(0, 9), num = tens * 10 + ones;
      if (Math.random() < 0.5) {
        const words = `${tens} ${tens === 1 ? 'ten' : 'tens'} and ${ones} ${ones === 1 ? 'one' : 'ones'}`;
        return { key: `place${num}`, n: [tens, ones], placeType: 'build', visual: big(words),
          text: 'What number is this?', say: `${words}. What number is that?`,
          choices: shuffle([num, ...[...new Set([ones * 10 + tens, tens + ones, num + 10, num + 1, num - 1].filter(v => v !== num))].slice(0, 3)]),
          answer: num };
      }
      return { key: `tens${num}`, n: [tens, ones], placeType: 'tens', visual: big(String(num)), text: `How many TENS are in ${num}?`,
        say: `How many tens are in ${num}?`, choices: numberChoices(tens, 9, [-2, -1, 1, 2, ones - tens, 3]), answer: tens };
    },
    evenodd() {
      const n = rand(1, 50), ans = n % 2 === 0 ? 'even' : 'odd';
      return { key: `eo${n}`, n: [n], visual: big(String(n)), text: `Is ${n} even or odd?`, say: `Is ${n} even or odd?`,
        choices: shuffle(['even', 'odd']), answer: ans, choiceClass: 'word' };
    },
    compare() { const q = math1.compare(100); q.key = 'c100' + q.key; return q; },
    // Quarter hours at level 1, five minutes at level 2.
    clock(level) {
      const h = rand(1, 12), m = level === 1 ? pick([0, 15, 30, 45]) : rand(0, 11) * 5;
      const t = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`, ans = t(h, m);
      const wrong = new Set();
      const add = (hh, mm) => { hh = (hh + 11) % 12 + 1; mm = (mm + 60) % 60; const s = t(hh, mm); if (s !== ans) wrong.add(s); };
      if (level === 2) add(m / 5, (h % 12) * 5); // hands swapped
      add(h + 1, m); add(h + 2, m); add(h + 3, m); add(h - 1, m); add(h, m + (level === 1 ? 15 : 5)); add(h, m - (level === 1 ? 15 : 5)); add(h, (m + 30) % 60);
      return { key: `clock2_${ans}`, n: [h, m], visual: clockSvg(h, m), text: 'What time is it?', say: 'What time does the clock show?',
        choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans, choiceClass: 'word' };
    },
    money() {
      const names = Object.keys(COINS), list = [];
      const count = rand(2, 5);
      for (let i = 0; i < count; i++) list.push(pick(names));
      list.sort((a, b) => COINS[b] - COINS[a]);
      const ans = list.reduce((s, c) => s + COINS[c], 0);
      const cents = v => `${v}¢`;
      return { key: `money${list.join('')}`, n: list.map(c => COINS[c]), visual: coinsSvg(list), text: 'How much money?',
        say: 'How much money is this? Add up the coins.',
        choices: numberChoices(ans, 130, [-5, 5, -10, 10, -1, 1, -25, 25]).map(cents), answer: cents(ans), choiceClass: 'word' };
    },
  };

  const math3 = {
    mult(level) {
      const a = pick(level === 1 ? [2, 5, 10, 1, 0, 3] : [2, 3, 4, 5, 6, 7, 8, 9, 10]), b = rand(0, 10), ans = a * b;
      const wrong = new Set([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, a + b, ans + 1, ans - 1].filter(v => v >= 0 && v !== ans));
      return { key: `mul${a}x${b}`, n: [a, b], visual: eq(`${a} × ${b} = <span class="q">?</span>`), text: 'Multiply!',
        say: `What is ${a} times ${b}?`, choices: shuffle([ans, ...threeWrong(ans, wrong, [ans + 2, ans + 3, ans + 4, ans + 5])]), answer: ans };
    },
    div(level) {
      const b = pick(level === 1 ? [2, 5, 10, 3] : [2, 3, 4, 5, 6, 7, 8, 9]), ans = rand(1, 10), a = b * ans;
      const wrong = new Set([ans + 1, ans - 1, ans + 2, a - b, b, ans * 2].filter(v => v > 0 && v !== ans));
      return { key: `div${a}/${b}`, n: [a, b], visual: eq(`${a} ÷ ${b} = <span class="q">?</span>`), text: 'Divide!',
        say: `What is ${a} divided by ${b}?`, choices: shuffle([ans, ...threeWrong(ans, wrong, [ans + 3, ans + 4, ans + 5])]), answer: ans };
    },
    factor() {
      const a = rand(2, 9), ans = rand(2, 9), total = a * ans;
      const wrong = new Set([ans + 1, ans - 1, total - a, a, ans + 2].filter(v => v > 0 && v !== ans));
      return { key: `fac${a}_${total}`, n: [a, total], visual: eq(`${a} × <span class="q">?</span> = ${total}`), text: 'What number is missing?',
        say: `${a} times what makes ${total}?`, choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans };
    },
    add(level) {
      let a, b;
      if (level === 1) { do { a = rand(100, 499); b = rand(100, 499); } while (a % 10 + b % 10 >= 10 || Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 >= 10); }
      else { do { a = rand(100, 899); b = rand(100, 899); } while (a + b > 999); }
      const ans = a + b;
      return { key: `add3_${a}+${b}`, n: [a, b], visual: eq(`${a} + ${b} = <span class="q">?</span>`), text: 'Add them up!',
        say: `What is ${a} plus ${b}?`, choices: numberChoices(ans, 1100, [-100, 100, -10, 10, -1, 1, -110, 110]), answer: ans };
    },
    sub(level) {
      let a, b;
      if (level === 1) { do { a = rand(200, 999); b = rand(100, a - 1); } while (a % 10 < b % 10 || Math.floor(a / 10) % 10 < Math.floor(b / 10) % 10); }
      else { a = rand(200, 999); b = rand(100, a - 1); }
      const ans = a - b;
      return { key: `sub3_${a}-${b}`, n: [a, b], visual: eq(`${a} − ${b} = <span class="q">?</span>`), text: 'Take away!',
        say: `What is ${a} minus ${b}?`, choices: numberChoices(ans, 1100, [-100, 100, -10, 10, -1, 1, -110, 110]), answer: ans };
    },
    round(level) {
      const to = level === 1 ? 10 : 100, n = level === 1 ? rand(11, 99) : rand(101, 999);
      if (n % to === 0) return math3.round(level); // already round; try again
      const ans = Math.round(n / to) * to;
      const wrong = new Set([ans - to, ans + to, Math.floor(n / to) * to, Math.ceil(n / to) * to, n, ans + 2 * to].filter(v => v >= 0 && v !== ans));
      return { key: `round${to}_${n}`, n: [n, to], visual: big(String(n)), text: `Round ${n} to the nearest ${to}.`,
        say: `Round ${n} to the nearest ${to === 10 ? 'ten' : 'hundred'}.`, choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans };
    },
    fraction(level) {
      const n = pick(level === 1 ? [2, 3, 4] : [2, 3, 4, 5, 6, 8]), k = rand(1, n - 1), ans = `${k}/${n}`;
      // Wrong fractions: same circle with a different count, or the same count of a different circle; none equal in value.
      const wrong = new Set();
      for (let kk = 1; kk < n; kk++) if (kk !== k) wrong.add(`${kk}/${n}`);
      wrong.add(`${n - k}/${n}`); wrong.add(`${k}/${n + 1}`); wrong.add(`${k}/${n + 2}`); wrong.add(`${k + 1}/${n + 2}`);
      const ok = [...wrong].filter(f => { const [a, b] = f.split('/').map(Number); return a > 0 && b > a && a / b !== k / n; });
      return { key: `frac${k}/${n}`, n: [k, n], visual: fractionSvg(k, n), text: 'What fraction is orange?',
        say: `What fraction of the circle is orange?`, choices: shuffle([ans, ...threeWrong(ans, ok, [`${k}/${n + 3}`, `${k + 1}/${n + 3}`, `${k}/${n + 4}`])]), answer: ans, choiceClass: 'word' };
    },
    area(level) {
      const w = rand(2, 6), h = rand(2, 5), perimeter = level === 2 && Math.random() < 0.5;
      const ans = perimeter ? 2 * (w + h) : w * h;
      const wrong = new Set([w * h, 2 * (w + h), w + h, ans + 1, ans - 1, ans + 2, ans + w].filter(v => v > 0 && v !== ans));
      return { key: `area${w}x${h}${perimeter ? 'p' : 'a'}`, n: [w, h], perimeter, visual: gridSvg(w, h),
        text: perimeter ? 'How many units around the outside?' : 'How many squares inside?',
        say: perimeter ? `The rectangle is ${w} wide and ${h} tall. What is the distance around the outside?` : `How many squares are inside the rectangle?`,
        choices: shuffle([ans, ...threeWrong(ans, wrong, [ans + 3, ans + 4])]), answer: ans };
    },
    cmpfrac(level) {
      let k1, n1, k2, n2;
      do {
        if (level === 1 && Math.random() < 0.5) { n1 = n2 = pick([2, 3, 4, 5, 6, 8]); k1 = rand(1, n1 - 1); k2 = rand(1, n1 - 1); }
        else if (level === 1) { k1 = k2 = rand(1, 2); n1 = pick([2, 3, 4, 6, 8]); n2 = pick([2, 3, 4, 6, 8]); }
        else { n1 = pick([2, 3, 4, 5, 6, 8]); n2 = pick([2, 3, 4, 5, 6, 8]); k1 = rand(1, n1 - 1); k2 = rand(1, n2 - 1); }
      } while (k1 / n1 === k2 / n2 || k1 >= n1 || k2 >= n2);
      const bigger = Math.random() < 0.5, f1 = `${k1}/${n1}`, f2 = `${k2}/${n2}`;
      const ans = (k1 / n1 > k2 / n2) === bigger ? f1 : f2;
      return { key: `cf${f1}v${f2}${bigger}`, n: [k1, n1, k2, n2], bigger,
        visual: `<div class="pair"><div>${fractionSvg(k1, n1)}<b>${f1}</b></div><div>${fractionSvg(k2, n2)}<b>${f2}</b></div></div>`,
        text: `Which fraction is ${bigger ? 'BIGGER' : 'SMALLER'}?`, say: `Which fraction is ${bigger ? 'bigger' : 'smaller'}?`,
        choices: [f1, f2], answer: ans, choiceClass: 'word' };
    },
    clock() {
      const h = rand(1, 12), m = rand(0, 59), t = (hh, mm) => `${(hh + 11) % 12 + 1}:${String((mm + 60) % 60).padStart(2, '0')}`, ans = t(h, m);
      const wrong = new Set([t(h + 1, m), t(h - 1, m), t(h, m + 5), t(h, m - 5), t(h, m + 10), t(h, m - 10), t(h, m + 30)].filter(s => s !== ans));
      return { key: `clock3_${ans}`, n: [h, m], visual: clockSvg(h, m), text: 'What time is it?', say: 'What time does the clock show?',
        choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans, choiceClass: 'word' };
    },
  };

  // ---------- Grade 1 phonics ----------
  // Picture words: each emoji must clearly show that one word.
  const PICS = {
    ant: '🐜', apple: '🍎', ball: '⚽', bat: '🦇', bed: '🛏️', bee: '🐝', box: '📦', bug: '🪲', bus: '🚌',
    car: '🚗', cat: '🐱', cow: '🐮', cup: '☕', dog: '🐶', duck: '🦆', egg: '🥚', fish: '🐟', fox: '🦊',
    frog: '🐸', goat: '🐐', hand: '✋', hat: '🎩', key: '🔑', kite: '🪁', leaf: '🍃', lion: '🦁', map: '🗺️',
    moon: '🌙', mouse: '🐭', nose: '👃', owl: '🦉', pen: '🖊️', pig: '🐷', rabbit: '🐰',
    ring: '💍', snake: '🐍', sun: '☀️', ten: '🔟', tree: '🌳', turtle: '🐢', umbrella: '☂️', van: '🚐',
    web: '🕸️', yarn: '🧶', zebra: '🦓',
  };
  const PIC_WORDS = Object.keys(PICS);
  const LETTERS = 'abcdefghijklmnoprstuvwyz'.split('');
  // Letters that make the same starting sound, so they're never both offered.
  const SAME_SOUND = { c: ['k'], k: ['c'] };
  const isCVC = w => /^[^aeiou][aeiou][^aeiou]$/.test(w);
  const CVC = PIC_WORDS.filter(isCVC);
  const SHORT_VOWEL = CVC.filter(w => !['car', 'cow', 'key'].includes(w)); // CVC-shaped words whose vowel really is short

  // Words in a family all rhyme with each other and with nothing in other families.
  const RHYMES = [
    ['cat', 'hat', 'bat', 'mat', 'rat', 'sat'], ['dog', 'log', 'frog', 'hog', 'jog'], ['sun', 'fun', 'run', 'bun'],
    ['pig', 'big', 'dig', 'wig'], ['hen', 'ten', 'pen', 'men'], ['top', 'hop', 'mop', 'pop'],
    ['bug', 'hug', 'rug', 'mug'], ['cake', 'lake', 'make', 'bake'], ['king', 'ring', 'sing', 'wing'],
    ['bed', 'red', 'fed', 'sled'], ['star', 'car', 'jar', 'far'], ['bee', 'tree', 'see', 'three'],
    ['fox', 'box', 'socks'], ['goat', 'boat', 'coat'], ['nest', 'best', 'rest', 'test'],
  ];

  // Dolch sight words by grade.
  const SIGHT = {
    1: ['the', 'and', 'said', 'was', 'you', 'they', 'have', 'come', 'what', 'where', 'here', 'there',
      'like', 'look', 'play', 'see', 'go', 'can', 'we', 'my', 'of', 'to', 'is', 'are', 'from', 'with', 'will',
      'this', 'that', 'went', 'want', 'she', 'he', 'her', 'his', 'put', 'one', 'two', 'do', 'down', 'little',
      'jump', 'help', 'make', 'who', 'some', 'could', 'when', 'them', 'then', 'after', 'again', 'every', 'many'],
    2: ['always', 'around', 'because', 'been', 'before', 'best', 'both', 'buy', 'call', 'cold', 'does', "don't",
      'fast', 'first', 'five', 'found', 'gave', 'goes', 'green', 'its', 'made', 'many', 'off', 'pull', 'read',
      'right', 'sing', 'sit', 'sleep', 'tell', 'their', 'these', 'those', 'upon', 'use', 'very', 'wash',
      'which', 'why', 'wish', 'work', 'would', 'write', 'your'],
    3: ['about', 'better', 'bring', 'carry', 'clean', 'done', 'draw', 'drink', 'eight', 'fall', 'far', 'full',
      'grow', 'hold', 'hurt', 'keep', 'kind', 'laugh', 'light', 'long', 'much', 'myself', 'never', 'only',
      'own', 'pick', 'seven', 'shall', 'show', 'six', 'small', 'start', 'today', 'together', 'try', 'warm'],
  };

  // Sight words that sound the same; a question never offers two of them.
  const SOUND_ALIKE = [['to', 'two', 'too'], ['right', 'write'], ['their', 'there'], ['here', 'hear'], ['one', 'won'], ['by', 'buy'],
    ['for', 'four'], ['no', 'know'], ['read', 'red'], ['eight', 'ate'], ['see', 'sea'], ['would', 'wood'], ['which', 'witch']];
  const soundsLike = (a, b) => a !== b && SOUND_ALIKE.some(g => g.includes(a) && g.includes(b));

  const pic = w => `<div class="pic">${PICS[w]}</div>`;

  const phonics1 = {
    begin() {
      const word = pick(PIC_WORDS), ans = word[0];
      const banned = new Set([ans, ...(SAME_SOUND[ans] || [])]);
      const wrong = pickN(LETTERS.filter(l => !banned.has(l)), 3);
      return { key: `begin${word}`, visual: pic(word), text: 'What letter does it start with?',
        say: `${word}. What letter does ${word} start with?`, choices: shuffle([ans, ...wrong]), answer: ans,
        choiceClass: 'letter', hint: word };
    },
    cvc() {
      const word = pick(CVC);
      // Prefer look-alike words (same letters in the same spots) so kids really read.
      const score = w => [...w].filter((ch, i) => ch === word[i]).length;
      const others = shuffle(CVC.filter(w => w !== word)).sort((x, y) => score(y) - score(x));
      const wrong = pickN(others.slice(0, 6), 3);
      return { key: `cvc${word}`, visual: pic(word), text: 'Which word is this?',
        say: 'Which word matches the picture?', choices: shuffle([word, ...wrong]), answer: word, choiceClass: 'word' };
    },
    rhyme() {
      const fam = pick(RHYMES), [target, ans] = shuffle(fam);
      const wrong = pickN(RHYMES.filter(f => f !== fam), 3).map(pick);
      return { key: `rhyme${target}`, visual: big(target), text: `What rhymes with “${target}”?`,
        say: `Which word rhymes with ${target}?`, choices: shuffle([ans, ...wrong]), answer: ans,
        choiceClass: 'word', hearChoices: true, family: fam };
    },
    sight() { return sightFor(1); },
  };
  function sightFor(grade) {
      const list = SIGHT[grade], word = pick(list);
      return { key: `sight${grade}${word}`, visual: '<div class="pic ear">👂</div>', text: 'Tap the word you hear!',
        say: `Find the word: ${word}.`, choices: wordChoices(word, list.filter(w => !soundsLike(word, w))), answer: word, choiceClass: 'word', hint: word };
  }

  // ---------- Grade 2 phonics ----------
  // Starting sounds: digraphs and blends, each with pictures.
  const BLENDS = {
    sh: { ship: '🚢', shoe: '👟', sheep: '🐑', shark: '🦈' }, ch: { chair: '🪑', cheese: '🧀', chick: '🐤', cherry: '🍒' },
    th: { thumb: '👍', thread: '🧵' }, wh: { whale: '🐳', wheel: '🛞' },
    tr: { tree: '🌳', truck: '🚚', train: '🚂' }, st: { star: '⭐', stop: '🛑' }, sn: { snake: '🐍', snowman: '⛄' },
    fl: { flower: '🌸', flag: '🏁' }, dr: { drum: '🥁', dragon: '🐉' }, cr: { crab: '🦀', crown: '👑' },
    pl: { plane: '✈️', plant: '🪴' }, gl: { glove: '🧤', globe: '🌍' }, br: { broom: '🧹', bread: '🍞' },
    cl: { clock: '🕐', cloud: '☁️' }, sp: { spider: '🕷️', spoon: '🥄' }, fr: { frog: '🐸', fries: '🍟' },
  };
  const BLEND_KEYS = Object.keys(BLENDS);
  // Long-vowel (silent e) words by vowel; short-vowel CVC words are the wrong choices.
  const LONG = { a: ['cake', 'lake', 'name', 'game', 'gate', 'tape'], i: ['bike', 'kite', 'time', 'five', 'ride', 'nine'],
    o: ['bone', 'rope', 'nose', 'hope', 'note', 'home'], u: ['cube', 'tune', 'mule', 'cute'] };
  const PLURALS = { cat: 'cats', dog: 'dogs', box: 'boxes', bus: 'buses', fox: 'foxes', dish: 'dishes', wish: 'wishes',
    baby: 'babies', puppy: 'puppies', city: 'cities', bench: 'benches', glass: 'glasses', toy: 'toys', key: 'keys',
    book: 'books', brush: 'brushes', peach: 'peaches', bunny: 'bunnies', hat: 'hats', watch: 'watches' };
  const COMPOUNDS = [['sun', 'flower'], ['rain', 'bow'], ['cup', 'cake'], ['foot', 'ball'], ['butter', 'fly'], ['star', 'fish'],
    ['snow', 'man'], ['pan', 'cake'], ['tooth', 'brush'], ['bed', 'room'], ['play', 'ground'], ['back', 'pack'], ['pop', 'corn'],
    ['sea', 'shell'], ['bird', 'house'], ['fire', 'fly'], ['rain', 'coat'], ['base', 'ball'], ['sand', 'box'], ['mail', 'box']];
  const CONTRACTIONS = { 'do not': "don't", 'cannot': "can't", 'is not': "isn't", 'I am': "I'm", 'it is': "it's", 'we are': "we're",
    'they are': "they're", 'you are': "you're", 'he is': "he's", 'did not': "didn't", 'will not': "won't", 'was not': "wasn't",
    'I will': "I'll", 'she will': "she'll", 'let us': "let's", 'I have': "I've", 'could not': "couldn't", 'are not': "aren't" };
  const SYLLABLES = { cat: 1, dog: 1, sun: 1, tree: 1, fish: 1, ball: 1, cake: 1, frog: 1,
    apple: 2, happy: 2, rabbit: 2, water: 2, pencil: 2, tiger: 2, monkey: 2, yellow: 2, window: 2, cookie: 2,
    banana: 3, elephant: 3, butterfly: 3, computer: 3, umbrella: 3, tomato: 3, hamburger: 3, dinosaur: 3, family: 3,
    watermelon: 4, alligator: 4, caterpillar: 4, helicopter: 4, television: 4 };

  const phonics2 = {
    blend() {
      const b = pick(BLEND_KEYS), word = pick(Object.keys(BLENDS[b]));
      return { key: `blend${word}`, visual: `<div class="pic">${BLENDS[b][word]}</div>`, text: 'What sound does it start with?',
        say: `${word}. What sound does ${word} start with?`, choices: wordChoices(b, BLEND_KEYS), answer: b, choiceClass: 'letter', hint: word };
    },
    longvowel() {
      const v = pick(Object.keys(LONG)), ans = pick(LONG[v]);
      const wrong = pickN(SHORT_VOWEL, 3);
      return { key: `long${ans}`, visual: `<div class="pic">${v.toUpperCase()}</div>`, text: `Which word has a LONG ${v.toUpperCase()} sound?`,
        say: `Which word has the same vowel sound as ${ans === LONG[v][0] ? LONG[v][1] : LONG[v][0]}?`, choices: shuffle([ans, ...wrong]), answer: ans,
        choiceClass: 'word', hearChoices: true, vowel: v };
    },
    plural() {
      const word = pick(Object.keys(PLURALS)), ans = PLURALS[word];
      const wrong = new Set([word + 's', word + 'es', word + 'ies', word.replace(/y$/, 'ys'), word + 'z'].filter(w => w !== ans));
      return { key: `plural${word}`, visual: sentence(`one ${word}, two ___`), text: 'Which word fits?',
        say: `One ${word}, two what?`, choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans, choiceClass: 'word', base: word };
    },
    compound() {
      const [a, b] = pick(COMPOUNDS), ans = a + b;
      return { key: `comp${ans}`, visual: big(`${a} + ${b}`), text: 'Put the words together!', say: `${a} plus ${b} makes what word?`,
        choices: wordChoices(ans, COMPOUNDS.map(p => p.join(''))), answer: ans, choiceClass: 'word' };
    },
    contraction() {
      const long = pick(Object.keys(CONTRACTIONS)), ans = CONTRACTIONS[long];
      return { key: `contr${ans}`, visual: big(long), text: 'Which is the short way to say it?', say: `${long}. What is the short way to say ${long}?`,
        choices: wordChoices(ans, Object.values(CONTRACTIONS)), answer: ans, choiceClass: 'word', long };
    },
    syllable() {
      const word = pick(Object.keys(SYLLABLES)), ans = SYLLABLES[word];
      return { key: `syl${word}`, visual: big(word), text: 'How many syllables?', say: `${word}. How many syllables are in ${word}? Clap it out!`,
        choices: shuffle([1, 2, 3, 4]), answer: ans, hearChoices: false, word };
    },
    sight() { return sightFor(2); },
  };

  // ---------- Grade 3 phonics / word study ----------
  // Each word appears in one pair only, so a wrong choice from another pair is never also right.
  // Third item is the idea the pair belongs to; wrong answers never come from the same idea.
  const ANTONYMS = [['hot', 'cold', 'temp'], ['big', 'small', 'size'], ['up', 'down', 'place'], ['fast', 'slow', 'speed'], ['happy', 'sad', 'mood'],
    ['wet', 'dry', 'wet'], ['open', 'closed', 'open'], ['day', 'night', 'time'], ['in', 'out', 'place'], ['push', 'pull', 'move'],
    ['loud', 'quiet', 'sound'], ['full', 'empty', 'full'], ['old', 'new', 'age'], ['hard', 'soft', 'feel'], ['tall', 'short', 'size'],
    ['light', 'dark', 'light'], ['first', 'last', 'order'], ['over', 'under', 'place'], ['top', 'bottom', 'place'],
    ['early', 'late', 'time'], ['clean', 'dirty', 'clean'], ['near', 'far', 'place'], ['thick', 'thin', 'size'], ['start', 'stop', 'move']];
  const SYNONYMS = [['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['sad', 'unhappy'], ['fast', 'quick'], ['begin', 'start'],
    ['shut', 'close'], ['look', 'see'], ['speak', 'talk'], ['smart', 'clever'], ['funny', 'silly'], ['cold', 'chilly'],
    ['pretty', 'beautiful'], ['mad', 'angry'], ['scared', 'afraid'], ['tired', 'sleepy'], ['easy', 'simple'], ['hard', 'difficult']];
  const SPELLING = { friend: ['frend', 'freind', 'frien'], because: ['becuase', 'becase', 'becouse'], people: ['peple', 'poeple', 'peopel'],
    school: ['scool', 'shcool', 'skool'], little: ['litle', 'littel', 'lital'], water: ['watter', 'woter', 'wather'],
    house: ['hous', 'howse', 'huose'], again: ['agen', 'agian', 'agane'], every: ['evry', 'evrey', 'eviry'],
    always: ['allways', 'alwais', 'alway'], animal: ['aminal', 'animel', 'anamal'], beautiful: ['beutiful', 'butiful', 'beautifull'],
    favorite: ['favrite', 'favoret', 'favorit'], does: ['dus', 'duz', 'doez'], said: ['sed', 'sayed', 'saed'],
    where: ['wher', 'whare', 'whair'], which: ['wich', 'whitch', 'whach'], before: ['befor', 'beefore', 'befour'],
    thought: ['thot', 'thougt', 'thaught'], enough: ['enuf', 'enogh', 'enouf'], around: ['arownd', 'arond', 'aruond'],
    really: ['realy', 'relly', 'rilly'], different: ['diffrent', 'diferent', 'differant'] };
  const PREFIXES = { un: 'not', re: 'again', pre: 'before' };
  const PREFIX_WORDS = { un: ['happy', 'kind', 'fair', 'safe', 'able', 'lucky', 'tidy', 'well'], re: ['do', 'play', 'write', 'tell', 'build', 'read', 'fill', 'paint'],
    pre: ['heat', 'test', 'view', 'school', 'pay', 'order'] };
  const meaning = (p, base) => p === 'un' ? `not ${base}` : p === 're' ? `${base} again` : `before ${base}`;
  const PAST = { go: 'went', run: 'ran', eat: 'ate', see: 'saw', sing: 'sang', swim: 'swam', give: 'gave', take: 'took', come: 'came',
    write: 'wrote', ride: 'rode', fly: 'flew', drink: 'drank', sit: 'sat', make: 'made', bring: 'brought', think: 'thought',
    catch: 'caught', buy: 'bought', say: 'said', sleep: 'slept', feel: 'felt', find: 'found', tell: 'told', draw: 'drew' };
  const IRREGULAR = { child: 'children', mouse: 'mice', foot: 'feet', tooth: 'teeth', man: 'men', woman: 'women', goose: 'geese',
    leaf: 'leaves', wolf: 'wolves', knife: 'knives', sheep: 'sheep', deer: 'deer', ox: 'oxen' };
  // Sentences where only the right homophone fits.
  const HOMOPHONES = [
    ['I can ___ the birds singing.', 'hear', 'here'], ['Please come over ___.', 'here', 'hear'],
    ['The ___ is wet and salty.', 'sea', 'see'], ['I can ___ a rainbow!', 'see', 'sea'],
    ['Please ___ your name on the line.', 'write', 'right'], ['Turn ___ at the corner.', 'right', 'write'],
    ['Our team ___ the game!', 'won', 'one'], ['I have ___ brother.', 'one', 'won'],
    ['We ___ pizza for dinner.', 'ate', 'eight'], ['A spider has ___ legs.', 'eight', 'ate'],
    ['The sky is ___.', 'blue', 'blew'], ['The wind ___ my hat away.', 'blew', 'blue'],
    ['The bee landed on a ___.', 'flower', 'flour'], ['Mix the ___ and eggs for the cake.', 'flour', 'flower'],
    ['The ___ rode a horse.', 'knight', 'night'], ['The stars come out at ___.', 'night', 'knight'],
    ['They put ___ toys away.', 'their', 'there'], ['The dog is over ___.', 'there', 'their'],
    ['The sun shone all ___ long.', 'week', 'weak'], ['I felt ___ after being sick.', 'weak', 'week'],
    ['I ___ a hat and gloves.', 'wore', 'war'], ['We ___ a sandcastle on the beach.', 'made', 'maid'],
    ['The ___ lives in a cave.', 'bear', 'bare'], ['The deer ___ down the hill.', 'ran', 'rain'],
  ];

  const phonics3 = {
    antonym() {
      const pair = pick(ANTONYMS), [w, ans] = shuffle(pair.slice(0, 2));
      const wrong = pickN(ANTONYMS.filter(p => p[2] !== pair[2]), 3).map(p => pick(p.slice(0, 2)));
      return { key: `ant${w}`, visual: big(w), text: `Which word is the OPPOSITE of “${w}”?`, say: `Which word means the opposite of ${w}?`,
        choices: shuffle([ans, ...wrong]), answer: ans, choiceClass: 'word', word: w };
    },
    synonym() {
      const pair = pick(SYNONYMS), [w, ans] = shuffle(pair);
      const wrong = pickN(SYNONYMS.filter(p => p !== pair), 3).map(pick);
      return { key: `syn${w}`, visual: big(w), text: `Which word means the SAME as “${w}”?`, say: `Which word means the same as ${w}?`,
        choices: shuffle([ans, ...wrong]), answer: ans, choiceClass: 'word', word: w };
    },
    spelling() {
      const ans = pick(Object.keys(SPELLING));
      return { key: `spell${ans}`, visual: '<div class="pic ear">👂</div>', text: 'Which one spells the word you hear?', say: `Which one spells the word: ${ans}?`,
        choices: shuffle([ans, ...SPELLING[ans]]), answer: ans, choiceClass: 'word', hint: ans };
    },
    prefix() {
      const p = pick(Object.keys(PREFIXES)), base = pick(PREFIX_WORDS[p]), word = p + base, ans = meaning(p, base);
      const wrong = Object.keys(PREFIXES).filter(x => x !== p).map(x => meaning(x, base)).concat([`${base} a lot`]);
      return { key: `pre${word}`, visual: big(word), text: `What does “${word}” mean?`, say: `What does ${word} mean?`,
        choices: shuffle([ans, ...wrong]), answer: ans, choiceClass: 'word', word, base, p };
    },
    past() {
      const base = pick(Object.keys(PAST)), ans = PAST[base];
      const others = Object.values(PAST).filter(w => w !== ans);
      const wrong = new Set([...(['sing', 'see'].includes(base) ? [] : [base + 'ed']), ...pickN(others, 4)]);
      return { key: `past${base}`, visual: sentence(`Today I ${base}. Yesterday I ___.`), text: 'Which word fits?',
        say: `Today I ${base}. Yesterday I what?`, choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans, choiceClass: 'word', base };
    },
    irregular() {
      const base = pick(Object.keys(IRREGULAR)), ans = IRREGULAR[base];
      const wrong = new Set([base + 's', base + 'es', base + 'ies', ...pickN(Object.values(IRREGULAR).filter(w => w !== ans), 2)].filter(w => w !== ans));
      return { key: `irr${base}`, visual: sentence(`one ${base}, two ___`), text: 'Which word fits?', say: `One ${base}, two what?`,
        choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans, choiceClass: 'word', base };
    },
    homophone() {
      const [s, ans, partner] = pick(HOMOPHONES);
      return { key: `homo${ans}`, visual: sentence(s), text: 'Which word fits the sentence?', say: s.replace('___', 'blank'),
        choices: shuffle([ans, partner]), answer: ans, choiceClass: 'word', s, partner };
    },
    sight() { return sightFor(3); },
    syllable: () => phonics2.syllable(),
  };

  // ---------- Reading ----------
  const passageHtml = t => `<div class="passage">${esc(t)}</div>`;
  const reading = {
    passage(grade, level) {
      const item = pick(Lessons.PASSAGES.filter(x => x.g === grade && x.l === level));
      return { key: `pass${item.text.slice(0, 20)}`, visual: passageHtml(item.text), text: item.q, say: `${item.text} ${item.q}`,
        choices: shuffle([item.a, ...item.wrong]), answer: item.a, choiceClass: 'word', item };
    },
    order(grade, level) {
      const item = pick(Lessons.SEQUENCES.filter(x => x.g === grade)), steps = item.steps;
      let ask, ans, idx;
      if (level === 1 || steps.length === 3 && Math.random() < 0.4) {
        const first = Math.random() < 0.5; ask = `What happens ${first ? 'FIRST' : 'LAST'}?`; idx = first ? 0 : steps.length - 1; ans = steps[idx];
      } else {
        idx = rand(1, steps.length - 1); ans = steps[idx]; ask = `What happens right after “${steps[idx - 1]}”?`;
      }
      const shown = shuffle(steps);
      return { key: `order${steps[0]}${idx}`, visual: `<div class="passage"><b>Put these in order:</b><br>${shown.map(esc).join('<br>')}</div>`,
        text: ask, say: `Here are some things that happen: ${shown.join('. ')}. ${ask.replace(/[“”]/g, '')}`,
        choices: shuffle(steps), answer: ans, choiceClass: 'word', item, idx };
    },
  };

  // ---------- Science ----------
  // 'a' or 'an'; names in lessons.js that already start with a word like 'the' or 'milk' are marked uncountable there.
  const art = n => Lessons.NO_ARTICLE.includes(n) ? n : (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n;
  const picHtml = (emoji, label) => `<div class="pic">${emoji}</div><div class="caption">${esc(label)}</div>`;
  const science = {
    group(grade) {
      const groups = Lessons.GROUPS[grade];
      const names = Object.keys(Lessons.ANIMALS).filter(a => Lessons.ANIMALS[a][2] <= grade && groups.includes(Lessons.ANIMALS[a][1]));
      const name = pick(names), [emoji, ans] = Lessons.ANIMALS[name];
      return { key: `group${name}`, visual: picHtml(emoji, name), text: `What kind of animal is ${art(name)}?`, say: `What kind of animal is ${art(name)}?`,
        choices: wordChoices(ans, groups), answer: ans, choiceClass: 'word', name };
    },
    living() {
      const ans = pick(['living', 'non-living']), [name, emoji] = pick(Lessons.LIVING[ans]);
      return { key: `living${name}`, visual: picHtml(emoji, name), text: `Is ${art(name)} living or non-living?`, say: `Is ${art(name)} living or non-living?`,
        choices: shuffle(['living', 'non-living']), answer: ans, choiceClass: 'word', name };
    },
    matter(grade) {
      const states = grade === 1 ? ['solid', 'liquid'] : ['solid', 'liquid', 'gas'];
      const ans = pick(states), [name, emoji] = pick(Lessons.MATTER[ans]);
      const ask = `Is ${art(name)} a ${states.join(', a ').replace(/, a (\w+)$/, ' or a $1')}?`;
      return { key: `matter${name}`, visual: picHtml(emoji, name), text: ask, say: ask,
        choices: shuffle(states), answer: ans, choiceClass: 'word', name };
    },
    sense() {
      const ans = pick(Object.keys(Lessons.SENSES)), [emoji, acts] = Lessons.SENSES[ans], act = pick(acts);
      return { key: `sense${act}`, visual: `<div class="pic">🤔</div>`, text: `Which sense do you use to ${act}?`, say: `Which sense do you use to ${act}?`,
        choices: wordChoices(ans, Object.keys(Lessons.SENSES)), answer: ans, choiceClass: 'word', act };
    },
    habitat() {
      const ans = pick(Object.keys(Lessons.HABITATS)), [, animals] = Lessons.HABITATS[ans], [name, emoji] = pick(animals);
      return { key: `hab${name}`, visual: picHtml(emoji, name), text: `Where does ${art(name)} live?`, say: `Where does ${art(name)} live?`,
        choices: wordChoices(ans, Object.keys(Lessons.HABITATS)), answer: ans, choiceClass: 'word', name };
    },
    lifecycle(grade, level) {
      const name = pick(Object.keys(Lessons.LIFECYCLES)), [emoji, stages] = Lessons.LIFECYCLES[name];
      let idx, ask;
      if (level === 1 && Math.random() < 0.5) { idx = 0; ask = `What comes FIRST in the life of a ${name}?`; }
      else { idx = rand(1, stages.length - 1); ask = `What comes right after the ${stages[idx - 1]}?`; }
      const ans = stages[idx];
      return { key: `life${name}${idx}`, visual: picHtml(emoji, `life of a ${name}`), text: ask, say: ask,
        choices: shuffle(stages), answer: ans, choiceClass: 'word', name, idx };
    },
    plantpart() {
      const ans = pick(Object.keys(Lessons.PLANT_PARTS)), job = pick(Lessons.PLANT_PARTS[ans]);
      return { key: `plant${job}`, visual: picHtml('🌻', 'plant'), text: `Which part of a plant ${job}?`, say: `Which part of a plant ${job}?`, choices: wordChoices(ans, Object.keys(Lessons.PLANT_PARTS)), answer: ans, choiceClass: 'word', job };
    },
    fact(grade, level) {
      const item = pick(Lessons.FACTS.filter(x => x.g === grade && x.l === level));
      return { key: `fact${item.q.slice(0, 24)}`, visual: `<div class="pic">🔬</div>`, text: item.q, say: item.q,
        choices: shuffle([item.a, ...item.wrong]), answer: item.a, choiceClass: 'word', item };
    },
  };

  // Which question types each grade and level serves. Level 2 adds the harder ones.
  const MIX = {
    math: {
      1: { 1: ['add', 'add', 'sub', 'count', 'compare', 'clock', 'tenframe', 'doubles'], 2: ['add', 'sub', 'sub', 'count', 'missing', 'compare', 'clock', 'tenframe', 'doubles'] },
      2: { 1: ['add', 'sub', 'skip', 'place', 'evenodd', 'compare', 'clock', 'story', 'story', 'array'], 2: ['add', 'sub', 'skip', 'place', 'clock', 'money', 'evenodd', 'story', 'story', 'array'] },
      3: { 1: ['mult', 'mult', 'div', 'add', 'round', 'fraction', 'clock', 'area', 'cmpfrac'], 2: ['mult', 'div', 'factor', 'add', 'sub', 'round', 'fraction', 'clock', 'area', 'cmpfrac'] },
    },
    reading: {
      1: { 1: ['passage', 'passage', 'passage', 'order'], 2: ['passage', 'passage', 'passage', 'order'] },
      2: { 1: ['passage', 'passage', 'passage', 'order'], 2: ['passage', 'passage', 'passage', 'order'] },
      3: { 1: ['passage', 'passage', 'passage', 'order'], 2: ['passage', 'passage', 'passage', 'order'] },
    },
    science: {
      1: { 1: ['living', 'living', 'group', 'sense', 'matter', 'fact', 'fact'], 2: ['living', 'group', 'sense', 'matter', 'habitat', 'lifecycle', 'plantpart', 'fact', 'fact'] },
      2: { 1: ['group', 'habitat', 'lifecycle', 'matter', 'plantpart', 'sense', 'fact', 'fact'], 2: ['group', 'habitat', 'lifecycle', 'matter', 'plantpart', 'fact', 'fact', 'fact'] },
      3: { 1: ['fact', 'fact', 'fact', 'group', 'habitat', 'lifecycle', 'plantpart'], 2: ['fact', 'fact', 'fact', 'group', 'habitat', 'lifecycle', 'matter'] },
    },
    phonics: {
      1: { 1: ['begin', 'begin', 'begin', 'sight', 'sight', 'cvc'], 2: ['begin', 'begin', 'cvc', 'cvc', 'rhyme', 'sight', 'sight'] },
      2: { 1: ['blend', 'blend', 'longvowel', 'sight', 'syllable', 'compound'], 2: ['blend', 'longvowel', 'plural', 'plural', 'compound', 'contraction', 'sight', 'syllable'] },
      3: { 1: ['antonym', 'synonym', 'spelling', 'spelling', 'sight', 'syllable', 'past'], 2: ['antonym', 'synonym', 'spelling', 'prefix', 'past', 'irregular', 'homophone', 'homophone'] },
    },
  };
  const GENERATORS = { math: { 1: math1, 2: math2, 3: math3 }, phonics: { 1: phonics1, 2: phonics2, 3: phonics3 },
    reading: { 1: reading, 2: reading, 3: reading }, science: { 1: science, 2: science, 3: science } };
  const LEVEL_NAMES = {
    math: { 1: ['Numbers up to 10', 'Numbers up to 20'], 2: ['Adding without carrying & skip counting', 'Carrying, time & money'], 3: ['Easy times tables & fractions', 'All times tables & dividing'] },
    phonics: { 1: ['Letters & sounds', 'Words & rhymes'], 2: ['Blends & long vowels', 'Plurals & compound words'], 3: ['Opposites & spelling', 'Prefixes & past tense'] },
    reading: { 1: ['Short stories', 'Longer stories & why'], 2: ['Stories & facts', 'Reading between the lines'], 3: ['Longer passages', 'Main ideas & word meanings'] },
    science: { 1: ['Living things & senses', 'Habitats & life cycles'], 2: ['Animals, matter & plants', 'Earth, space & weather'], 3: ['Forces, energy & living things', 'Earth, space & changes'] },
  };
  const SUBJECTS = ['math', 'phonics', 'reading', 'science'];

  // subject: one of SUBJECTS, or 'mix' (a random one of opts.subjects, default all).
  // opts.grade: 1-3.  opts.mathLevel / phonicsLevel / readingLevel / scienceLevel: 1 or 2.
  function generate(subject, opts = {}) {
    const grade = [1, 2, 3].includes(opts.grade) ? opts.grade : 1;
    const pool = (opts.subjects || SUBJECTS).filter(x => SUBJECTS.includes(x));
    const s = subject === 'mix' ? pick(pool.length ? pool : SUBJECTS) : subject;
    const level = opts[`${s}Level`] === 2 ? 2 : 1;
    const type = pick(MIX[s][grade][level]);
    const q = s === 'reading' || s === 'science' ? GENERATORS[s][grade][type](grade, level)
      : GENERATORS[s][grade][type](s === 'math' && grade === 1 ? (level === 2 ? 20 : 10) : level);
    return Object.assign(q, { subject: s, grade, level, type, key: `g${grade}${q.key}` });
  }

  const api = { generate, LEVEL_NAMES, MIX, SUBJECTS, data: { PICS, CVC, RHYMES, SIGHT, LETTERS, SAME_SOUND, COINS, STORIES, BLENDS, LONG, PLURALS, COMPOUNDS,
    CONTRACTIONS, SYLLABLES, ANTONYMS, SYNONYMS, SPELLING, PREFIXES, PREFIX_WORDS, PAST, IRREGULAR, HOMOPHONES, SOUND_ALIKE } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Questions = api;
})(this);
