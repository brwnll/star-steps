// Generates lots of questions for every grade and level and checks each one is correct and fair.
// Usage: node test-questions.js [count]
const { generate, data, MIX, SUBJECTS } = require('./questions.js');
const Lessons = require('./lessons.js');
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
const pairWords = pairs => pairs.map(p => p.slice(0, 2)).flat();
for (const [name, pairs] of [['ANTONYMS', data.ANTONYMS], ['SYNONYMS', data.SYNONYMS]]) {
  const all = pairWords(pairs);
  if (new Set(all).size !== all.length) errors.push(`A word appears in two ${name} pairs`);
}
for (const [a, b] of data.COMPOUNDS) if (!a || !b) errors.push('Bad compound');
for (const [right, wrongs] of Object.entries(data.SPELLING)) if (wrongs.includes(right)) errors.push(`Misspelling list for ${right} includes the right spelling`);

// ---- Generate and check ----
// Hand-written lessons: every item has one answer plus three different wrong ones, and covers every grade/level.
for (const [name, list] of [['PASSAGES', Lessons.PASSAGES], ['FACTS', Lessons.FACTS]]) {
  for (const it of list) {
    const all = [it.a, ...it.wrong];
    if (it.wrong.length !== 3 || new Set(all.map(x => x.toLowerCase())).size !== 4) errors.push(`${name}: bad choices for "${it.q}"`);
    if (![1, 2, 3].includes(it.g) || ![1, 2].includes(it.l)) errors.push(`${name}: bad grade/level for "${it.q}"`);
  }
  for (const g of [1, 2, 3]) for (const l of [1, 2]) if (list.filter(x => x.g === g && x.l === l).length < 8) errors.push(`${name}: fewer than 8 items for grade ${g} level ${l}`);
}
for (const [name, [emoji, group, minGrade]] of Object.entries(Lessons.ANIMALS)) if (!emoji || !Lessons.GROUPS[3].includes(group) || ![1, 2, 3].includes(minGrade)) errors.push(`ANIMALS: bad entry ${name}`);
for (const seq of Lessons.SEQUENCES) if (new Set(seq.steps).size !== seq.steps.length || seq.steps.length < 3) errors.push(`SEQUENCES: bad steps ${seq.steps}`);
const habitatAnimals = Object.values(Lessons.HABITATS).flatMap(h => h[1].map(a => a[0]));
if (new Set(habitatAnimals).size !== habitatAnimals.length) errors.push('HABITATS: an animal is listed in two habitats');
const matterItems = Object.values(Lessons.MATTER).flat().map(x => x[0]);
if (new Set(matterItems).size !== matterItems.length) errors.push('MATTER: an item is listed in two states');

for (let i = 0; i < N; i++) {
  const subject = ['math', 'phonics', 'reading', 'science', 'mix'][i % 5];
  const grade = 1 + (Math.floor(i / 5) % 3);
  const level = Math.floor(i / 15) % 2 + 1;
  const q = generate(subject, { grade, mathLevel: level, phonicsLevel: level, readingLevel: level, scienceLevel: level });
  if (subject !== 'mix' && q.subject !== subject) fail(q, 'Wrong subject');
  keys.add(q.key); typesSeen.add(`${q.subject}${q.grade}.${q.type}`);
  const { choices, answer, n } = q;

  // Shared rules
  if (new Set(choices.map(String)).size !== choices.length) fail(q, 'Duplicate choices');
  if (choices.filter(c => c === answer).length !== 1) fail(q, 'Answer not in choices exactly once');
  const want = ['compare', 'evenodd', 'homophone', 'cmpfrac', 'living'].includes(q.type) ? 2
    : q.type === 'matter' ? (grade === 1 ? 2 : 3) : ['order', 'lifecycle'].includes(q.type) ? q.choices.length : 4;
  if (choices.length !== want || (['order', 'lifecycle'].includes(q.type) && (choices.length < 3 || choices.length > 4))) fail(q, `Expected ${want} choices`);
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
        if (grade === 2 && level === 1 && choices.some(c => +c.split(':')[1] % 15)) fail(q, 'Level 1 clock choice not on quarter hour');
        if (grade === 3 && choices.some(c => c !== answer && Math.abs(+c.split(':')[1] - m) === 1)) fail(q, 'Clock choices one minute apart');
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
      case 'round': if (Math.round(n[0] / n[1]) * n[1] !== answer || n[0] % n[1] === 0) fail(q, 'Rounding wrong or trivial');
        if (n[1] !== (level === 1 ? 10 : 100)) fail(q, 'Rounding to the wrong place for this level'); break;
      case 'fraction': { const [k, d] = n; if (answer !== `${k}/${d}`) fail(q, 'Fraction wrong');
        if ((q.visual.match(/#ff9f1c/g) || []).length !== k || (q.visual.match(/<path/g) || []).length !== d) fail(q, 'Drawn fraction differs');
        for (const c of choices) { const [a, b] = c.split('/').map(Number); if (c !== answer && a / b === k / d) fail(q, 'A wrong choice equals the answer'); }
        break; }
      case 'tenframe': if (10 - n[0] !== answer || (q.visual.match(/<circle/g) || []).length !== n[0]) fail(q, 'Ten frame wrong'); break;
      case 'doubles': if (n[0] + n[0] !== answer || (level === 1 && n[0] > 5)) fail(q, 'Doubles wrong'); break;
      case 'story': {
        const expect = q.op === 'add' ? n[0] + n[1] : n[0] - n[1];
        if (expect !== answer || answer < 0) fail(q, 'Story answer wrong');
        if (level === 1 && Math.max(n[0], n[1], answer) > 20) fail(q, 'Level 1 story numbers too big');
        const story = data.STORIES.find(st => q.visual.includes(st.e));
        if (!story || story.op !== q.op) fail(q, 'Story op mismatch');
        if (!q.say.includes(String(n[0])) || !q.say.includes(String(n[1]))) fail(q, 'Story numbers not in text');
        break;
      }
      case 'array': if (n[0] * n[1] !== answer || (q.visual.match(/<span>/g) || []).length !== answer) fail(q, 'Array count wrong'); break;
      case 'area': { const [w, h] = n; if ((q.perimeter ? 2 * (w + h) : w * h) !== answer) fail(q, 'Area/perimeter wrong');
        if ((q.visual.match(/<rect/g) || []).length !== w * h) fail(q, 'Drawn grid differs');
        if (q.perimeter && level === 1) fail(q, 'Perimeter is level 2'); break; }
      case 'cmpfrac': { const [k1, n1, k2, n2] = n, v1 = k1 / n1, v2 = k2 / n2;
        if (v1 === v2) fail(q, 'Fractions are equal');
        const want = (q.bigger ? Math.max(v1, v2) : Math.min(v1, v2)) === v1 ? `${k1}/${n1}` : `${k2}/${n2}`;
        if (want !== answer) fail(q, 'Compare fractions wrong');
        if (level === 1 && !(n1 === n2 || k1 === k2)) fail(q, 'Level 1 fractions should share a top or bottom'); break; }
      default: fail(q, 'Unknown math type');
    }
    if (choices.some(c => typeof c === 'number' && (c < 0 || !Number.isInteger(c)))) fail(q, 'Bad number choice');
  } else if (q.subject === 'reading') {
    switch (q.type) {
      case 'passage': { const it = q.item;
        if (!Lessons.PASSAGES.includes(it) || it.g !== grade || it.l !== level || answer !== it.a || !q.say.startsWith(it.text)) fail(q, 'Passage wrong');
        if (choices.some(c => c !== answer && !it.wrong.includes(c))) fail(q, 'Passage distractor not from item'); break; }
      case 'order': { const st = q.item.steps;
        if (q.item.g !== grade || st[q.idx] !== answer) fail(q, 'Order answer wrong');
        if (q.text.includes('FIRST') && q.idx !== 0) fail(q, 'FIRST is not the first step');
        if (q.text.includes('LAST') && q.idx !== st.length - 1) fail(q, 'LAST is not the last step');
        const m = q.text.match(/after “(.+)”/); if (m && st[q.idx - 1] !== m[1]) fail(q, 'After-step mismatch');
        if (level === 1 && m) fail(q, 'Level 1 should only ask first/last'); break; }
      default: fail(q, 'Unknown reading type');
    }
  } else if (q.subject === 'science') {
    switch (q.type) {
      case 'fact': { const it = q.item;
        if (!Lessons.FACTS.includes(it) || it.g !== grade || it.l !== level || answer !== it.a || q.text !== it.q) fail(q, 'Fact wrong'); break; }
      case 'group': { const a = Lessons.ANIMALS[q.name];
        if (!a || a[1] !== answer || a[2] > grade || choices.some(c => !Lessons.GROUPS[grade].includes(c))) fail(q, 'Animal group wrong'); break; }
      case 'living': if (!Lessons.LIVING[answer].some(x => x[0] === q.name)) fail(q, 'Living wrong'); break;
      case 'matter': if (!Lessons.MATTER[answer].some(x => x[0] === q.name) || (grade === 1 && choices.includes('gas'))) fail(q, 'Matter wrong'); break;
      case 'sense': if (!Lessons.SENSES[answer][1].includes(q.act)) fail(q, 'Sense wrong'); break;
      case 'habitat': if (!Lessons.HABITATS[answer][1].some(x => x[0] === q.name)) fail(q, 'Habitat wrong'); break;
      case 'lifecycle': { const st = Lessons.LIFECYCLES[q.name][1];
        if (st[q.idx] !== answer || new Set(choices).size !== st.length) fail(q, 'Life cycle wrong');
        const m = q.text.match(/after the (.+)\?/); if (m && st[q.idx - 1] !== m[1]) fail(q, 'Life cycle step mismatch');
        if (q.text.includes('FIRST') && q.idx !== 0) fail(q, 'Life cycle FIRST wrong'); break; }
      case 'plantpart': if (!Lessons.PLANT_PARTS[answer].includes(q.job)) fail(q, 'Plant part wrong'); break;
      default: fail(q, 'Unknown science type');
    }
    if (/\b(a|an) (a|an|the|milk|juice|honey|rain|steam|smoke|grass)\b/.test(q.text) || /\ba [aeiou]/.test(q.text.replace(/a unit/g, ''))) fail(q, 'Article grammar');
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
      case 'sight': if (answer !== q.hint || !q.say.includes(answer) || !data.SIGHT[grade].includes(answer)) fail(q, 'Sight word wrong');
        if (choices.some(c => c !== answer && data.SOUND_ALIKE.some(g => g.includes(c) && g.includes(answer)))) fail(q, 'Two choices sound the same'); break;
      case 'blend': if (!data.BLENDS[answer] || !data.BLENDS[answer][q.hint] || !q.visual.includes(data.BLENDS[answer][q.hint])) fail(q, 'Blend wrong');
        if (choices.filter(c => q.hint.startsWith(c)).length !== 1) fail(q, 'Two blends fit the word'); break;
      case 'longvowel': if (!data.LONG[q.vowel].includes(answer)) fail(q, 'Long vowel answer wrong');
        if (choices.some(c => c !== answer && (!data.CVC.includes(c) || ['car', 'cow', 'key'].includes(c)))) fail(q, 'Wrong choice is not a short-vowel word'); break;
      case 'plural': if (data.PLURALS[q.base] !== answer) fail(q, 'Plural wrong'); break;
      case 'compound': if (!data.COMPOUNDS.some(([a, b]) => a + b === answer && q.say.startsWith(`${a} plus ${b}`))) fail(q, 'Compound wrong'); break;
      case 'contraction': if (data.CONTRACTIONS[q.long] !== answer) fail(q, 'Contraction wrong'); break;
      case 'syllable': if (data.SYLLABLES[q.word] !== answer) fail(q, 'Syllable count wrong'); break;
      case 'antonym': case 'synonym': {
        const pairs = q.type === 'antonym' ? data.ANTONYMS : data.SYNONYMS;
        const pair = pairs.find(p => p.includes(q.word));
        if (!pair || !pair.includes(answer) || answer === q.word) fail(q, `${q.type} answer wrong`);
        if (choices.filter(c => pair.includes(c)).length !== 1) fail(q, `Two ${q.type} choices fit`);
        if (q.type === 'antonym' && choices.some(c => c !== answer && pairs.find(p => p.includes(c))[2] === pair[2])) fail(q, 'Antonym distractor from the same idea');
        break;
      }
      case 'spelling': if (!data.SPELLING[answer] || choices.some(c => c !== answer && !data.SPELLING[answer].includes(c))) fail(q, 'Spelling wrong'); break;
      case 'prefix': {
        const expect = { un: `not ${q.base}`, re: `${q.base} again`, pre: `before ${q.base}` }[q.p];
        if (q.word !== q.p + q.base || answer !== expect || !data.PREFIX_WORDS[q.p].includes(q.base)) fail(q, 'Prefix meaning wrong');
        break;
      }
      case 'past': if (data.PAST[q.base] !== answer || choices.some(c => c !== answer && (Object.keys(data.PAST).includes(c) || ['singed', 'seed'].includes(c)))) fail(q, 'Past tense wrong'); break;
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
for (const sub of SUBJECTS) for (const g of [1, 2, 3]) for (const l of [1, 2])
  for (const t of new Set(MIX[sub][g][l])) if (!typesSeen.has(`${sub}${g}.${t}`)) errors.push(`Never generated ${sub} grade ${g} ${t}`);

console.log(`Checked ${N.toLocaleString()} questions across ${SUBJECTS.length} subjects and 3 grades: ${keys.size.toLocaleString()} different ones, ${typesSeen.size} question types.`);
if (errors.length) {
  console.log(`\n❌ ${errors.length} problem(s):\n` + errors.join('\n'));
  process.exit(1);
}
console.log('✅ All questions correct.');
