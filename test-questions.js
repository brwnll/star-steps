// Generates lots of questions for every grade and level and checks each one is correct and fair.
// Usage: node test-questions.js [count]
const { generate, data, MIX } = require('./questions.js');
const N = Number(process.argv[2]) || 100000;

const errors = [];
const keys = new Set(), typesSeen = new Set();
const fail = (q, msg) => errors.length < 30 && errors.push(`${msg}\n   ${JSON.stringify(q).slice(0, 300)}`);
const strip = s => String(s).replace(/<[^>]+>/g, '');

// ---- Word-list sanity: no word may be a right answer in two places of the same list ----
const rhymeFamily = new Map();
for (const fam of data.RHYMES) for (const w of fam) {
  if (rhymeFamily.has(w)) errors.push(`"${w}" is in two rhyme families`);
  rhymeFamily.set(w, fam);
}
for (const g of [1, 2, 3]) if (new Set(data.SIGHT[g]).size !== data.SIGHT[g].length) errors.push(`Duplicate grade ${g} sight words`);
const emojis = Object.values(data.PICS);
if (new Set(emojis).size !== emojis.length) errors.push('Two picture words share an emoji');
const blendWords = Object.values(data.BLENDS).flatMap(Object.keys);
if (new Set(blendWords).size !== blendWords.length) errors.push('A blend word is listed under two sounds');
for (const [b, words] of Object.entries(data.BLENDS)) for (const w of Object.keys(words)) if (!w.startsWith(b)) errors.push(`"${w}" does not start with ${b}`);
const longWords = Object.entries(data.LONG).flatMap(([v, ws]) => ws.map(w => [v, w]));
for (const [v, w] of longWords) if (!(w.endsWith('e') && w[w.length - 3] === v)) errors.push(`"${w}" is not a silent-e long ${v} word`);
const pairWords = pairs => pairs.flat();
for (const [name, pairs] of [['ANTONYMS', data.ANTONYMS], ['SYNONYMS', data.SYNONYMS]]) {
  const all = pairWords(pairs);
  if (new Set(all).size !== all.length) errors.push(`A word appears in two ${name} pairs`);
}
for (const [a, b] of data.COMPOUNDS) if (!a || !b) errors.push('Bad compound');
for (const [right, wrongs] of Object.entries(data.SPELLING)) if (wrongs.includes(right)) errors.push(`Misspelling list for ${right} includes the right spelling`);

// ---- Generate and check ----
for (let i = 0; i < N; i++) {
  const subject = ['math', 'phonics', 'mix'][i % 3];
  const grade = 1 + (Math.floor(i / 3) % 3);
  const level = Math.floor(i / 9) % 2 + 1;
  const q = generate(subject, { grade, mathLevel: level, phonicsLevel: level });
  keys.add(q.key); typesSeen.add(`${q.subject}${q.grade}.${q.type}`);
  const { choices, answer, n } = q;

  // Shared rules
  if (new Set(choices.map(String)).size !== choices.length) fail(q, 'Duplicate choices');
  if (choices.filter(c => c === answer).length !== 1) fail(q, 'Answer not in choices exactly once');
  const want = ['compare', 'evenodd'].includes(q.type) ? 2 : 4;
  if (choices.length !== want) fail(q, `Expected ${want} choices`);
  if (!q.say || !q.text || !q.visual) fail(q, 'Missing text');
  if (q.grade !== grade || q.level !== level) fail(q, 'Wrong grade/level tag');
  if (!MIX[q.subject][grade][level].includes(q.type)) fail(q, 'Type not allowed at this grade/level');

  if (q.subject === 'math') {
    const nums = s => (String(s).match(/\d+/g) || []).map(Number);
    switch (q.type) {
      case 'add': if (n[0] + n[1] !== answer) fail(q, 'Addition wrong');
        if (grade === 1 && answer > (level === 2 ? 20 : 10)) fail(q, 'Grade 1 sum too big');
        if (grade === 2 && answer > 100) fail(q, 'Grade 2 sum too big');
        if (grade === 2 && level === 1 && n[0] % 10 + n[1] % 10 >= 10) fail(q, 'Level 1 should not carry');
        if (grade === 3 && answer > 999) fail(q, 'Grade 3 sum too big');
        break;
      case 'sub': if (n[0] - n[1] !== answer || answer < 0) fail(q, 'Subtraction wrong');
        if (grade === 2 && level === 1 && n[0] % 10 < n[1] % 10) fail(q, 'Level 1 should not borrow');
        break;
      case 'missing': if (n[0] + answer !== n[1]) fail(q, 'Missing number wrong'); break;
      case 'count': if ((q.visual.match(/<span>/g) || []).length !== answer) fail(q, 'Count does not match pictures'); break;
      case 'compare': if ((q.bigger ? Math.max(...choices) : Math.min(...choices)) !== answer) fail(q, 'Compare wrong');
        if (grade === 1 && Math.max(...choices) > (level === 2 ? 20 : 10)) fail(q, 'Compare number too big'); break;
      case 'clock': { const [h, m] = n; if (answer !== `${h}:${String(m).padStart(2, '0')}`) fail(q, 'Clock answer wrong');
        if (grade === 1 && ![0, 30].includes(m)) fail(q, 'Grade 1 clock not on the half hour');
        if (grade === 2 && m % 5) fail(q, 'Grade 2 clock not on 5 minutes');
        if (grade === 2 && level === 1 && m % 15) fail(q, 'Level 1 clock not on quarter hour');
        if (!q.visual.includes('<svg')) fail(q, 'No clock drawn'); break; }
      case 'skip': if (n[1] + 3 * n[0] !== answer) fail(q, 'Skip counting wrong');
        if (level === 1 && n[0] === 3) fail(q, 'Counting by 3 is level 2'); break;
      case 'place': if (q.placeType === 'build' ? n[0] * 10 + n[1] !== answer : n[0] !== answer) fail(q, 'Place value wrong'); break;
      case 'evenodd': if ((n[0] % 2 ? 'odd' : 'even') !== answer) fail(q, 'Even/odd wrong'); break;
      case 'money': if (`${n.reduce((a, b) => a + b, 0)}¢` !== answer) fail(q, 'Money total wrong');
        if (n.some(v => !Object.values(data.COINS).includes(v))) fail(q, 'Unknown coin'); break;
      case 'mult': if (n[0] * n[1] !== answer) fail(q, 'Multiplication wrong');
        if (level === 1 && ![0, 1, 2, 3, 5, 10].includes(n[0])) fail(q, 'Level 1 times table too hard'); break;
      case 'div': if (n[0] / n[1] !== answer || !Number.isInteger(answer)) fail(q, 'Division wrong'); break;
      case 'factor': if (n[0] * answer !== n[1]) fail(q, 'Missing factor wrong'); break;
      case 'round': if (Math.round(n[0] / n[1]) * n[1] !== answer) fail(q, 'Rounding wrong');
        if (n[1] !== (level === 1 ? 10 : 100)) fail(q, 'Rounding to the wrong place for this level'); break;
      case 'fraction': { const [k, d] = n; if (answer !== `${k}/${d}`) fail(q, 'Fraction wrong');
        if ((q.visual.match(/#ff9f1c/g) || []).length !== k || (q.visual.match(/<path/g) || []).length !== d) fail(q, 'Drawn fraction differs');
        for (const c of choices) { const [a, b] = c.split('/').map(Number); if (c !== answer && a / b === k / d) fail(q, 'A wrong choice equals the answer'); }
        break; }
      default: fail(q, 'Unknown math type');
    }
    if (choices.some(c => typeof c === 'number' && (c < 0 || !Number.isInteger(c)))) fail(q, 'Bad number choice');
  } else {
    switch (q.type) {
      case 'begin': {
        if (!data.PICS[q.hint] || q.hint[0] !== answer) fail(q, 'Starting letter wrong');
        const same = [answer, ...(data.SAME_SOUND[answer] || [])];
        if (choices.filter(c => same.includes(c)).length !== 1) fail(q, 'Two choices make the starting sound');
        break;
      }
      case 'cvc': if (!q.visual.includes(data.PICS[answer]) || choices.some(c => !data.CVC.includes(c))) fail(q, 'CVC question wrong'); break;
      case 'rhyme': {
        const target = strip(q.visual), fam = rhymeFamily.get(target);
        const rhyming = choices.filter(c => fam && fam.includes(c) && c !== target);
        if (rhyming.length !== 1 || rhyming[0] !== answer || choices.includes(target)) fail(q, 'Rhyme choices wrong');
        break;
      }
      case 'sight': if (answer !== q.hint || !q.say.includes(answer) || !data.SIGHT[grade].includes(answer)) fail(q, 'Sight word wrong'); break;
      case 'blend': if (!data.BLENDS[answer] || !data.BLENDS[answer][q.hint] || !q.visual.includes(data.BLENDS[answer][q.hint])) fail(q, 'Blend wrong');
        if (choices.filter(c => q.hint.startsWith(c)).length !== 1) fail(q, 'Two blends fit the word'); break;
      case 'longvowel': if (!data.LONG[q.vowel].includes(answer)) fail(q, 'Long vowel answer wrong');
        if (choices.some(c => c !== answer && !data.CVC.includes(c))) fail(q, 'Wrong choice is not a short-vowel word'); break;
      case 'plural': if (data.PLURALS[q.base] !== answer) fail(q, 'Plural wrong'); break;
      case 'compound': if (!data.COMPOUNDS.some(([a, b]) => a + b === answer && q.say.startsWith(`${a} plus ${b}`))) fail(q, 'Compound wrong'); break;
      case 'contraction': if (data.CONTRACTIONS[q.long] !== answer) fail(q, 'Contraction wrong'); break;
      case 'syllable': if (data.SYLLABLES[q.word] !== answer) fail(q, 'Syllable count wrong'); break;
      case 'antonym': case 'synonym': {
        const pairs = q.type === 'antonym' ? data.ANTONYMS : data.SYNONYMS;
        const pair = pairs.find(p => p.includes(q.word));
        if (!pair || !pair.includes(answer) || answer === q.word) fail(q, `${q.type} answer wrong`);
        if (choices.filter(c => pair.includes(c)).length !== 1) fail(q, `Two ${q.type} choices fit`);
        break;
      }
      case 'spelling': if (!data.SPELLING[answer] || choices.some(c => c !== answer && !data.SPELLING[answer].includes(c))) fail(q, 'Spelling wrong'); break;
      case 'prefix': {
        const expect = { un: `not ${q.base}`, re: `${q.base} again`, pre: `${q.base} before` }[q.p];
        if (q.word !== q.p + q.base || answer !== expect || !data.PREFIX_WORDS[q.p].includes(q.base)) fail(q, 'Prefix meaning wrong');
        break;
      }
      case 'past': if (data.PAST[q.base] !== answer || choices.some(c => c !== answer && Object.keys(data.PAST).includes(c))) fail(q, 'Past tense wrong'); break;
      case 'irregular': if (data.IRREGULAR[q.base] !== answer) fail(q, 'Irregular plural wrong'); break;
      case 'homophone': {
        const row = data.HOMOPHONES.find(h => h[0] === q.s);
        if (!row || row[1] !== answer || !choices.includes(row[2])) fail(q, 'Homophone wrong');
        break;
      }
      default: fail(q, 'Unknown phonics type');
    }
  }
}

// Every type in every grade/level mix must have come up.
for (const sub of ['math', 'phonics']) for (const g of [1, 2, 3]) for (const l of [1, 2])
  for (const t of new Set(MIX[sub][g][l])) if (!typesSeen.has(`${sub}${g}.${t}`)) errors.push(`Never generated ${sub} grade ${g} ${t}`);

console.log(`Checked ${N.toLocaleString()} questions across 3 grades: ${keys.size.toLocaleString()} different ones, ${typesSeen.size} question types.`);
if (errors.length) {
  console.log(`\n❌ ${errors.length} problem(s):\n` + errors.join('\n'));
  process.exit(1);
}
console.log('✅ All questions correct.');
