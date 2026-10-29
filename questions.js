// Question generators for Star Steps.
// Every question is built from code, so the answer is computed, never typed by hand.
// Shape: { key, subject, type, visual, text, say, choices: [...], answer, hearChoices?, choiceClass? }
// Run `node test-questions.js` to check thousands of generated questions.
(function (root) {
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- Math ----------
  const COUNT_ITEMS = [
    ['🍎', 'apples'], ['⭐', 'stars'], ['🐞', 'ladybugs'], ['🎈', 'balloons'], ['🐟', 'fish'],
    ['🍓', 'strawberries'], ['🚗', 'cars'], ['🌸', 'flowers'], ['🦆', 'ducks'], ['🍪', 'cookies'],
    ['🐸', 'frogs'], ['🧁', 'cupcakes'], ['🦋', 'butterflies'], ['🍌', 'bananas'],
  ];

  // Three wrong answers close to the right one, never negative, all different.
  function numberChoices(answer, max) {
    const set = new Set([answer]);
    let tries = 0;
    while (set.size < 4 && tries++ < 100) {
      const d = answer + rand(-3, 3);
      if (d >= 0 && d <= max + 2) set.add(d);
    }
    for (let n = 0; set.size < 4; n++) set.add(n);
    return shuffle([...set]);
  }

  const eq = s => `<div class="eq">${s}</div>`;

  const math = {
    add(max) {
      const a = rand(0, max - 1), b = rand(1, max - a), ans = a + b;
      return { key: `add${a}+${b}`, visual: eq(`${a} + ${b} = <span class="q">?</span>`), text: 'Add them up!',
        say: `What is ${a} plus ${b}?`, choices: numberChoices(ans, max), answer: ans };
    },
    sub(max) {
      const a = rand(2, max), b = rand(1, a), ans = a - b;
      return { key: `sub${a}-${b}`, visual: eq(`${a} − ${b} = <span class="q">?</span>`), text: 'Take away!',
        say: `What is ${a} minus ${b}?`, choices: numberChoices(ans, max), answer: ans };
    },
    count(max) {
      const n = rand(1, max === 10 ? 10 : 15), [emoji, name] = pick(COUNT_ITEMS);
      return { key: `count${n}${emoji}`, visual: `<div class="count">${`<span>${emoji}</span>`.repeat(n)}</div>`,
        text: `How many ${name}?`, say: `How many ${name}? Count them!`, choices: numberChoices(n, max), answer: n };
    },
    missing(max) {
      const total = rand(2, max), a = rand(0, total - 1), ans = total - a;
      return { key: `miss${a}_${total}`, visual: eq(`${a} + <span class="q">?</span> = ${total}`), text: 'What number is missing?',
        say: `${a} plus what makes ${total}?`, choices: numberChoices(ans, max), answer: ans };
    },
    compare(max) {
      const a = rand(0, max);
      let b; do { b = rand(0, max); } while (b === a);
      const bigger = Math.random() < 0.5, ans = bigger ? Math.max(a, b) : Math.min(a, b);
      return { key: `cmp${a}_${b}_${bigger}`, visual: `<div class="pic">${bigger ? '🐘' : '🐭'}</div>`,
        text: `Which number is ${bigger ? 'BIGGER' : 'SMALLER'}?`, say: `Which number is ${bigger ? 'bigger' : 'smaller'}?`,
        choices: shuffle([a, b]), answer: ans };
    },
  };

  // ---------- Phonics ----------
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

  // First grade sight words (Dolch pre-primer to first grade).
  const SIGHT = ['the', 'and', 'said', 'was', 'you', 'they', 'have', 'come', 'what', 'where', 'here', 'there',
    'like', 'look', 'play', 'see', 'go', 'can', 'we', 'my', 'of', 'to', 'is', 'are', 'from', 'with', 'will',
    'this', 'that', 'went', 'want', 'she', 'he', 'her', 'his', 'put', 'one', 'two', 'do', 'down', 'little',
    'jump', 'help', 'make', 'who', 'some', 'could', 'when', 'them', 'then', 'after', 'again', 'every', 'many'];

  const pic = w => `<div class="pic">${PICS[w]}</div>`;

  const phonics = {
    begin() {
      const word = pick(PIC_WORDS), ans = word[0];
      const banned = new Set([ans, ...(SAME_SOUND[ans] || [])]);
      const wrong = shuffle(LETTERS.filter(l => !banned.has(l))).slice(0, 3);
      return { key: `begin${word}`, visual: pic(word), text: 'What letter does it start with?',
        say: `${word}. What letter does ${word} start with?`, choices: shuffle([ans, ...wrong]), answer: ans,
        choiceClass: 'letter', hint: word };
    },
    cvc() {
      const word = pick(CVC);
      // Prefer look-alike words (same letters in the same spots) so kids really read.
      const score = w => [...w].filter((ch, i) => ch === word[i]).length;
      const others = shuffle(CVC.filter(w => w !== word)).sort((x, y) => score(y) - score(x));
      const wrong = shuffle(others.slice(0, 6)).slice(0, 3);
      return { key: `cvc${word}`, visual: pic(word), text: 'Which word is this?',
        say: 'Which word matches the picture?', choices: shuffle([word, ...wrong]), answer: word, choiceClass: 'word' };
    },
    rhyme() {
      const fam = pick(RHYMES), [target, ans] = shuffle(fam);
      const wrong = shuffle(RHYMES.filter(f => f !== fam)).slice(0, 3).map(pick);
      return { key: `rhyme${target}`, visual: `<div class="bigword">${target}</div>`, text: `What rhymes with “${target}”?`,
        say: `Which word rhymes with ${target}?`, choices: shuffle([ans, ...wrong]), answer: ans,
        choiceClass: 'word', hearChoices: true, family: fam };
    },
    sight() {
      const word = pick(SIGHT);
      const wrong = shuffle(SIGHT.filter(w => w !== word)).slice(0, 3);
      return { key: `sight${word}`, visual: '<div class="pic ear">👂</div>', text: 'Tap the word you hear!',
        say: `Find the word: ${word}.`, choices: shuffle([word, ...wrong]), answer: word, choiceClass: 'word', hint: word };
    },
  };

  const MATH_MIX = ['add', 'add', 'sub', 'sub', 'count', 'missing', 'compare'];
  const PHONICS_MIX = ['begin', 'begin', 'cvc', 'cvc', 'rhyme', 'sight', 'sight'];

  // subject: 'math' | 'phonics' | 'mix'.  opts.mathLevel: 10 or 20.
  function generate(subject, opts = {}) {
    const max = opts.mathLevel === 20 ? 20 : 10;
    const s = subject === 'mix' ? (Math.random() < 0.5 ? 'math' : 'phonics') : subject;
    const type = pick(s === 'math' ? MATH_MIX : PHONICS_MIX);
    const q = s === 'math' ? math[type](max) : phonics[type]();
    return Object.assign(q, { subject: s, type, max });
  }

  const api = { generate, data: { PICS, CVC, RHYMES, SIGHT, LETTERS, SAME_SOUND } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Questions = api;
})(this);
