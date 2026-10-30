// Question generators for Star Steps, grades 1-3.
// Every question is built from code or a small word list, so the answer is computed, never typed by hand.
// Shape: { key, subject, grade, level, type, visual, text, say, choices: [...], answer, n?, hearChoices?, choiceClass? }
//   n: the numbers the question was built from, so test-questions.js can re-check the answer independently.
// Run `node test-questions.js` to check thousands of generated questions.
(function (root) {
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
  const math2 = {
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
        return { key: `place${num}`, n: [tens, ones], placeType: 'build', visual: big(`${tens} tens and ${ones} ones`),
          text: 'What number is this?', say: `${tens} tens and ${ones} ones. What number is that?`,
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
      add(m / 5, (h % 12) * 5); // hands swapped
      add(h + 1, m); add(h - 1, m); add(h, m + (level === 1 ? 15 : 5)); add(h, m - (level === 1 ? 15 : 5)); add(h, (m + 30) % 60);
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
        say: `How much money is this? ${list.join(', ')}.`,
        choices: numberChoices(ans, 130, [-5, 5, -10, 10, -1, 1, -25, 25]).map(cents), answer: cents(ans), choiceClass: 'word' };
    },
  };

  // ---------- Grade 3 math ----------
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
      if (n % to === to / 2 && Math.random() < 0.5) return math3.round(level); // halves are rare but fine: round half up
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
    clock() {
      const h = rand(1, 12), m = rand(0, 59), t = (hh, mm) => `${(hh + 11) % 12 + 1}:${String((mm + 60) % 60).padStart(2, '0')}`, ans = t(h, m);
      const wrong = new Set([t(h + 1, m), t(h - 1, m), t(h, m + 1), t(h, m - 1), t(h, m + 5), t(h, m + 30), t(h, m - 10)].filter(s => s !== ans));
      return { key: `clock3_${ans}`, n: [h, m], visual: clockSvg(h, m), text: 'What time is it?', say: 'What time does the clock show?',
        choices: shuffle([ans, ...pickN([...wrong], 3)]), answer: ans, choiceClass: 'word' };
    },
  };

  // ---------- Grade 1 phonics ----------
  // Picture words: each emoji must clearly show that one word.
  const PICS = {
    ant: '🐜', apple: '🍎', ball: '⚽', bat: '🦇', bed: '🛏️', bee: '🐝', box: '📦', bug: '🐛', bus: '🚌',
    car: '🚗', cat: '🐱', cow: '🐮', cup: '🥤', dog: '🐶', duck: '🦆', egg: '🥚', fish: '🐟', fox: '🦊',
    frog: '🐸', goat: '🐐', hand: '✋', hat: '🎩', key: '🔑', kite: '🪁', leaf: '🍃', lion: '🦁', map: '🗺️',
    moon: '🌙', mouse: '🐭', net: '🥅', nose: '👃', owl: '🦉', pen: '🖊️', pig: '🐷', rabbit: '🐰', rat: '🐀',
    ring: '💍', snake: '🐍', sun: '☀️', ten: '🔟', tree: '🌳', turtle: '🐢', umbrella: '☂️', van: '🚐',
    web: '🕸️', yarn: '🧶', zebra: '🦓',
  };
  const PIC_WORDS = Object.keys(PICS);
  const LETTERS = 'abcdefghijklmnoprstuvwyz'.split('');
  // Letters that make the same starting sound, so they're never both offered.
  const SAME_SOUND = { c: ['k'], k: ['c'] };
  const isCVC = w => /^[^aeiou][aeiou][^aeiou]$/.test(w);
  const CVC = PIC_WORDS.filter(isCVC);

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
        say: `Find the word: ${word}.`, choices: wordChoices(word, list), answer: word, choiceClass: 'word', hint: word };
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
    ['sea', 'shell'], ['bird', 'house'], ['fire', 'fly'], ['hot', 'dog'], ['base', 'ball'], ['sand', 'box'], ['mail', 'box']];
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
      const wrong = pickN(CVC, 3); // short-vowel words never have a long sound
      return { key: `long${ans}`, visual: `<div class="pic">${v.toUpperCase()}</div>`, text: `Which word has a LONG ${v.toUpperCase()} sound?`,
        say: `Which word has a long ${v} sound, like in ${ans === LONG[v][0] ? LONG[v][1] : LONG[v][0]}?`, choices: shuffle([ans, ...wrong]), answer: ans,
        choiceClass: 'word', hearChoices: true, vowel: v };
    },
    plural() {
      const word = pick(Object.keys(PLURALS)), ans = PLURALS[word];
      const wrong = new Set([word + 's', word + 'es', word + 'ies', word.replace(/y$/, 'ys'), word + "'s"].filter(w => w !== ans));
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
  const ANTONYMS = [['hot', 'cold'], ['big', 'small'], ['up', 'down'], ['fast', 'slow'], ['happy', 'sad'], ['wet', 'dry'],
    ['open', 'closed'], ['day', 'night'], ['in', 'out'], ['push', 'pull'], ['loud', 'quiet'], ['full', 'empty'], ['old', 'new'],
    ['hard', 'soft'], ['tall', 'short'], ['light', 'dark'], ['first', 'last'], ['over', 'under'], ['top', 'bottom'],
    ['early', 'late'], ['clean', 'dirty'], ['near', 'far'], ['thick', 'thin'], ['start', 'stop']];
  const SYNONYMS = [['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['sad', 'unhappy'], ['fast', 'quick'], ['begin', 'start'],
    ['shut', 'close'], ['look', 'see'], ['speak', 'talk'], ['smart', 'clever'], ['funny', 'silly'], ['cold', 'chilly'],
    ['pretty', 'beautiful'], ['mad', 'angry'], ['scared', 'afraid'], ['tired', 'sleepy'], ['easy', 'simple'], ['hard', 'difficult']];
  const SPELLING = { friend: ['frend', 'freind', 'frien'], because: ['becuase', 'becase', 'becouse'], people: ['peple', 'poeple', 'peopel'],
    school: ['scool', 'shcool', 'skool'], little: ['litle', 'littel', 'lital'], water: ['watter', 'woter', 'wather'],
    house: ['hous', 'howse', 'huose'], again: ['agen', 'agian', 'agane'], every: ['evry', 'evrey', 'eviry'],
    always: ['allways', 'alwais', 'alway'], animal: ['aminal', 'animel', 'anamal'], beautiful: ['beutiful', 'butiful', 'beautifull'],
    favorite: ['favrite', 'favoret', 'favorit'], does: ['dose', 'duz', 'doez'], said: ['sed', 'sayed', 'saed'],
    where: ['wher', 'whare', 'whair'], which: ['wich', 'whitch', 'whach'], before: ['befor', 'beefore', 'befour'],
    thought: ['thot', 'thougt', 'thaught'], enough: ['enuf', 'enogh', 'enouf'], around: ['arownd', 'arond', 'aruond'],
    really: ['realy', 'relly', 'rilly'], different: ['diffrent', 'diferent', 'differant'] };
  const PREFIXES = { un: 'not', re: 'again', pre: 'before' };
  const PREFIX_WORDS = { un: ['happy', 'kind', 'fair', 'safe', 'able', 'lucky', 'tidy', 'well'], re: ['do', 'play', 'write', 'tell', 'build', 'read', 'fill', 'paint'],
    pre: ['heat', 'test', 'view', 'school', 'pay', 'order'] };
  const meaning = (p, base) => p === 'un' ? `not ${base}` : p === 're' ? `${base} again` : `${base} before`;
  const PAST = { go: 'went', run: 'ran', eat: 'ate', see: 'saw', sing: 'sang', swim: 'swam', give: 'gave', take: 'took', come: 'came',
    write: 'wrote', ride: 'rode', fly: 'flew', drink: 'drank', sit: 'sat', make: 'made', bring: 'brought', think: 'thought',
    catch: 'caught', buy: 'bought', say: 'said', sleep: 'slept', feel: 'felt', find: 'found', tell: 'told', draw: 'drew' };
  const IRREGULAR = { child: 'children', mouse: 'mice', foot: 'feet', tooth: 'teeth', man: 'men', woman: 'women', goose: 'geese',
    person: 'people', leaf: 'leaves', wolf: 'wolves', knife: 'knives', sheep: 'sheep', fish: 'fish', deer: 'deer', ox: 'oxen' };
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
      const pair = pick(ANTONYMS), [w, ans] = shuffle(pair);
      const wrong = pickN(ANTONYMS.filter(p => p !== pair), 3).map(pick);
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
      return { key: `spell${ans}`, visual: '<div class="pic ear">👂</div>', text: 'Which one is spelled right?', say: `Which word is spelled correctly? ${ans}.`,
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
      const wrong = new Set([base + 'ed', ...pickN(others, 3)]);
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
      const others = HOMOPHONES.flatMap(h => [h[1], h[2]]).filter(w => w !== ans && w !== partner);
      return { key: `homo${ans}`, visual: sentence(s), text: 'Which word fits the sentence?', say: s.replace('___', 'blank'),
        choices: shuffle([ans, partner, ...pickN([...new Set(others)], 2)]), answer: ans, choiceClass: 'word', s, partner };
    },
    sight() { return sightFor(3); },
    syllable: () => phonics2.syllable(),
  };

  // Which question types each grade and level serves. Level 2 adds the harder ones.
  const MIX = {
    math: {
      1: { 1: ['add', 'add', 'sub', 'count', 'count', 'compare', 'clock'], 2: ['add', 'add', 'sub', 'sub', 'count', 'missing', 'compare', 'clock'] },
      2: { 1: ['add', 'add', 'sub', 'skip', 'place', 'evenodd', 'compare', 'clock'], 2: ['add', 'sub', 'sub', 'skip', 'place', 'clock', 'money', 'money', 'evenodd'] },
      3: { 1: ['mult', 'mult', 'div', 'add', 'round', 'fraction', 'clock'], 2: ['mult', 'div', 'factor', 'add', 'sub', 'round', 'fraction', 'clock'] },
    },
    phonics: {
      1: { 1: ['begin', 'begin', 'begin', 'sight', 'sight', 'cvc'], 2: ['begin', 'begin', 'cvc', 'cvc', 'rhyme', 'sight', 'sight'] },
      2: { 1: ['blend', 'blend', 'longvowel', 'sight', 'syllable', 'compound'], 2: ['blend', 'longvowel', 'plural', 'plural', 'compound', 'contraction', 'sight', 'syllable'] },
      3: { 1: ['antonym', 'synonym', 'spelling', 'spelling', 'sight', 'syllable', 'past'], 2: ['antonym', 'synonym', 'spelling', 'prefix', 'past', 'irregular', 'homophone', 'homophone'] },
    },
  };
  const GENERATORS = { math: { 1: math1, 2: math2, 3: math3 }, phonics: { 1: phonics1, 2: phonics2, 3: phonics3 } };
  const LEVEL_NAMES = {
    math: { 1: ['Numbers up to 10', 'Numbers up to 20'], 2: ['Adding to 50 & skip counting', 'Adding to 100, time & money'], 3: ['Times tables 2, 5, 10', 'All times tables & fractions'] },
    phonics: { 1: ['Letters & sounds', 'Words & rhymes'], 2: ['Blends & long vowels', 'Plurals & compound words'], 3: ['Opposites & spelling', 'Prefixes & past tense'] },
  };

  // subject: 'math' | 'phonics' | 'mix'.  opts.grade: 1-3.  opts.mathLevel / opts.phonicsLevel: 1 or 2.
  function generate(subject, opts = {}) {
    const grade = [1, 2, 3].includes(opts.grade) ? opts.grade : 1;
    const s = subject === 'mix' ? (Math.random() < 0.5 ? 'math' : 'phonics') : subject;
    const level = (s === 'math' ? opts.mathLevel : opts.phonicsLevel) === 2 ? 2 : 1;
    const type = pick(MIX[s][grade][level]);
    const arg = s === 'math' && grade === 1 ? (level === 2 ? 20 : 10) : level;
    const q = GENERATORS[s][grade][type](arg);
    return Object.assign(q, { subject: s, grade, level, type, key: `g${grade}${q.key}` });
  }

  const api = { generate, LEVEL_NAMES, MIX, data: { PICS, CVC, RHYMES, SIGHT, LETTERS, SAME_SOUND, COINS, BLENDS, LONG, PLURALS, COMPOUNDS,
    CONTRACTIONS, SYLLABLES, ANTONYMS, SYNONYMS, SPELLING, PREFIXES, PREFIX_WORDS, PAST, IRREGULAR, HOMOPHONES } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Questions = api;
})(this);
