import fs from 'fs';
import url from 'url';
import path from 'path';

// Manual import mapping to support running without full compilation
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rawData = fs.readFileSync(path.join(__dirname, 'src', 'data', 'ingredients.json'));
const ingredientsData = JSON.parse(rawData);

// Simplified version of the exported function for terminal testing execution
const db = new Map();
ingredientsData.forEach(ing => {
  db.set(ing.name.toLowerCase(), ing);
});

function parseIngredients(rawString) {
  if (!rawString || typeof rawString !== 'string') return {};

  const cleanString = rawString.replace(/\./g, '').replace(/\*/g, '').toLowerCase();
  const rawList = cleanString.split(',').map(item => item.trim()).filter(item => item.length > 0);

  const matched = [];
  const unknown = [];
  const flagged = [];
  const safeSwaps = {};
  let totalComedogenicRating = 0;

  rawList.forEach(item => {
    let match = db.get(item);

    if (!match) {
      for (const [key, value] of db.entries()) {
        if (item.includes(key)) {
          const regex = new RegExp(`\\b${key}\\b`);
          if (regex.test(item)) {
            match = value;
            break;
          }
        }
      }
    }

    if (match) {
      matched.push(match);
      totalComedogenicRating += match.comedogenic_rating;

      if (!match.is_fa_safe) {
        flagged.push(match);
        if (match.safe_swap) {
          safeSwaps[match.name] = match.safe_swap;
        }
      }
    } else {
      unknown.push(item);
    }
  });

  const matchedCount = matched.length;
  const flaggedCount = flagged.length;
  let safetyScore = 100;

  if (matchedCount > 0) {
    const safeRatio = (matchedCount - flaggedCount) / matchedCount;
    safetyScore = Math.round(safeRatio * 100);
    safetyScore -= (totalComedogenicRating * 2);
    if (safetyScore < 0) safetyScore = 0;
  } else {
    safetyScore = 0;
  }

  return {
    safetyScore,
    totalParsed: rawList.length,
    matchedCount,
    unknownCount: unknown.length,
    flaggedCount,
    flaggedTriggers: flagged,
    safeSwaps,
    unknownIngredients: unknown,
    comedogenicPenalty: totalComedogenicRating * 2
  };
}

console.log("--- TEST RUN: FA Trigger Check ---");
const testString = "Water, Glycerin, Isopropyl Myristate, Polysorbate 20*, Niacinamide, magic fairy dust, Squalane, Coconut Oil, pure Dimethicone.";
console.log(`Input: ${testString}\n`);

const result = parseIngredients(testString);
console.log(JSON.stringify(result, null, 2));
