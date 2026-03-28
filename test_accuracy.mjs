import fs from 'fs';
import url from 'url';
import path from 'path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rawData = fs.readFileSync(path.join(__dirname, 'src', 'data', 'ingredients.json'));
const ingredientsData = JSON.parse(rawData);

const db = new Map();
ingredientsData.forEach(ing => {
  db.set(ing.name.toLowerCase(), ing);
});

function parseIngredients(rawString) {
  if (!rawString || typeof rawString !== 'string') return {};

  const cleanString = rawString.replace(/\./g, '').replace(/\*/g, '').toLowerCase();
  const rawList = cleanString.split(',').map(item => item.trim()).filter(item => item.length > 0);

  const matched = [];
  const flagged = [];

  rawList.forEach(item => {
    let match = db.get(item);
    if (!match) {
      for (const [key, value] of db.entries()) {
        if (item.includes(key)) {
          const regex = new RegExp(`\\b${key}\\b`);
          if (regex.test(item)) { match = value; break; }
        }
      }
    }
    if (match) {
      matched.push(match);
      if (!match.is_fa_safe) flagged.push(match);
    }
  });

  const safeRatio = matched.length > 0 ? ((matched.length - flagged.length) / matched.length) * 100 : 0;
  return { flaggedCount: flagged.length, accuracyScore: safeRatio };
}

const testCases = [
  { name: "Pure Safe Moisturizer", list: "Water, Glycerin, Squalane, Hyaluronic Acid, Niacinamide", expectedFlags: 0 },
  { name: "Unsafe Foundation", list: "Water, Isopropyl Myristate, Iron Oxides, Talc", expectedFlags: 1 },
  { name: "Unsafe Cleanser", list: "Water, Sodium Laurel Sulfate, Polysorbate 20, Panthenol", expectedFlags: 1 },
  { name: "Safe Sunscreen", list: "Zinc Oxide, Titanium Dioxide, Dimethicone, Cyclopentasiloxane", expectedFlags: 0 },
  { name: "Highly Unsafe Oil Blend", list: "Coconut Oil, Olive Oil, Jojoba Oil, Rosehip Oil", expectedFlags: 4 }
];

let passCount = 0;
console.log("--- AURA ENGINE ACCURACY TEST ---");
testCases.forEach((tc, idx) => {
  const result = parseIngredients(tc.list);
  const passed = result.flaggedCount === tc.expectedFlags;
  if(passed) passCount++;
  console.log(`Test ${idx+1}: ${tc.name}`);
  console.log(`Expected Flags: ${tc.expectedFlags} | Actual Flags: ${result.flaggedCount}`);
  console.log(`Status: ${passed ? '✓ PASSED' : '✗ FAILED'}\n`);
});

const logicAccuracy = (passCount / testCases.length) * 100;
console.log(`Overall Logic Accuracy: ${logicAccuracy}%`);
