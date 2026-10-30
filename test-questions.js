// Generates lots of questions and checks every one is correct and fair.
// Usage: node test-questions.js [count]
const { generate, data } = require('./questions.js');
const N = Number(process.argv[2]) || 100000;

const errors = [];
const keys = new Set();
const fail = (q, msg) => errors.length < 30 && errors.push(`${msg}\n   ${JSON.stringify(q)}`);
const nums = s => (s.match(/\d+/g) || []).map(Number);

// Data checks: a word may not sit in two rhyme families, and every CVC word must have a picture.
const seen = new Map();
for (const fam of data.RHYMES) for (const w of fam) {
  if (seen.has(w)) errors.push(`"${w}" is in two rhyme families`);
  seen.set(w, fam);
}
if (new Set(data.SIGHT).size !== data.SIGHT.length) errors.push('Duplicate sight words');

for (let i = 0; i < N; i++) {
  const subject = ['math', 'phonics', 'mix'][i % 3];
  const level = i % 2 ? 10 : 20;
  const q = generate(subject, { mathLevel: level, phonicsLevel: i % 4 < 2 ? 1 : 2 });
  if (q.subject === 'phonics' && i % 4 < 2 && q.type === 'rhyme') fail(q, 'Rhymes are not level 1');
  if (q.subject === 'math' && level === 10 && q.type === 'missing') fail(q, 'Missing-number is not level 1');
  keys.add(q.key);
  const { choices, answer } = q;

  // Shared rules
  if (new Set(choices.map(String)).size !== choices.length) fail(q, 'Duplicate choices');
  if (choices.filter(c => c === answer).length !== 1) fail(q, 'Answer not in choices exactly once');
  if (choices.length !== (q.type === 'compare' ? 2 : 4)) fail(q, 'Wrong number of choices');
  if (!q.say || !q.text || !q.visual) fail(q, 'Missing text');

  if (q.subject === 'math') {
    if (choices.some(c => !Number.isInteger(c) || c < 0)) fail(q, 'Bad number choice');
    if (answer > level) fail(q, 'Answer above level');
    const n = nums(q.say);
    switch (q.type) {
      case 'add': if (n[0] + n[1] !== answer) fail(q, 'Addition wrong'); break;
      case 'sub': if (n[0] - n[1] !== answer || answer < 0) fail(q, 'Subtraction wrong'); break;
      case 'missing': if (n[0] + answer !== n[1]) fail(q, 'Missing number wrong'); break;
      case 'count': {
        const shown = (q.visual.match(/<span>/g) || []).length;
        if (shown !== answer) fail(q, `Shows ${shown} items but answer is ${answer}`);
        break;
      }
      case 'compare': {
        const want = q.say.includes('bigger') ? Math.max(...choices) : Math.min(...choices);
        if (want !== answer) fail(q, 'Compare wrong');
        break;
      }
      default: fail(q, 'Unknown math type');
    }
  } else {
    switch (q.type) {
      case 'begin': {
        if (!data.PICS[q.hint]) fail(q, 'No picture');
        if (q.hint[0] !== answer) fail(q, 'Starting letter wrong');
        const sameSound = [answer, ...(data.SAME_SOUND[answer] || [])];
        if (choices.filter(c => sameSound.includes(c)).length !== 1) fail(q, 'Two choices make the starting sound');
        break;
      }
      case 'cvc': {
        if (!q.visual.includes(data.PICS[answer])) fail(q, 'Picture does not match answer');
        if (choices.some(c => !data.CVC.includes(c))) fail(q, 'Non-CVC choice');
        // No two words share a picture, so only the answer matches it.
        if (choices.filter(c => data.PICS[c] === data.PICS[answer]).length !== 1) fail(q, 'Ambiguous picture');
        break;
      }
      case 'rhyme': {
        const target = q.visual.replace(/<[^>]+>/g, '');
        const fam = seen.get(target);
        if (!fam) fail(q, 'Target not in a family');
        const rhyming = choices.filter(c => fam.includes(c) && c !== target);
        if (rhyming.length !== 1 || rhyming[0] !== answer) fail(q, 'Must be exactly one rhyming choice');
        if (choices.includes(target)) fail(q, 'Target word offered as a choice');
        break;
      }
      case 'sight':
        if (answer !== q.hint || !q.say.includes(answer)) fail(q, 'Spoken word differs from answer');
        break;
      default: fail(q, 'Unknown phonics type');
    }
  }
}

// Every picture emoji must be unique, or "which word is this?" could have two answers.
const emojis = Object.values(data.PICS);
if (new Set(emojis).size !== emojis.length) errors.push('Two words share an emoji');

console.log(`Checked ${N.toLocaleString()} questions, ${keys.size.toLocaleString()} different ones.`);
if (errors.length) {
  console.log(`\n❌ ${errors.length} problem(s):\n` + errors.join('\n'));
  process.exit(1);
}
console.log('✅ All questions correct.');
