import ingredientsData from '../data/ingredients.json';

// Create a lookup map for faster, exact matching.
const dbStrList = ingredientsData.map(ing => ({ key: ing.name.toLowerCase(), value: ing }));

function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + indicator // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

export function sanitizeIngredients(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];
  
  // Strip common noisy filler words before splitting to maintain token structure
  const noiseRegex = /\(aqua\/eau\)|extract|oil|derived from|[\.\*•]/gi;
  const cleanString = rawText.replace(noiseRegex, '').toLowerCase();

  return cleanString
    .split(',')
    .map(val => val.trim())
    .filter(val => val.length > 2);
}

export function parseIngredients(rawString) {
  if (!rawString || typeof rawString !== 'string') {
    return {
      safetyScore: null,
      totalParsed: 0,
      matchedCount: 0,
      unknownCount: 0,
      flaggedCount: 0,
      flaggedTriggers: [],
      matchedTokens: [],
      unknownIngredients: []
    };
  }

  const rawList = sanitizeIngredients(rawString);

  const matchedTokens = []; // Track exact token we matched for highlighting
  const unknown = [];
  const flagged = [];

  let totalComedogenicRating = 0;

  // Cross-reference with Fuzzy Logic
  rawList.forEach(item => {
    let match = null;
    
    // First pass: exact or string inclusion
    for (const entry of dbStrList) {
       if (item === entry.key || item.includes(entry.key)) {
         match = entry.value;
         break;
       }
    }

    // Second pass: Fuzzy matching (Levenshtein) if no exact match found
    if (!match && item.length > 4) {
      for (const entry of dbStrList) {
         // If distance is <= 2 (e.g. Glycerine vs Glycerin = 1)
         if (levenshteinDistance(item, entry.key) <= 2) {
           match = entry.value;
           break;
         }
      }
    }

    if (match) {
      matchedTokens.push({
        rawText: item,
        data: match
      });
      totalComedogenicRating += match.comedogenic_rating;

      if (!match.is_fa_safe) {
        flagged.push(match);
      }
    } else {
      unknown.push(item);
    }
  });

  const matchedCount = matchedTokens.length;
  const flaggedCount = flagged.length;

  let safetyScore = 100;
  if (matchedCount > 0) {
    const safeRatio = (matchedCount - flaggedCount) / matchedCount;
    safetyScore = Math.round(safeRatio * 100);
    safetyScore -= (totalComedogenicRating * 2);
    if (safetyScore < 0) safetyScore = 0;
  } else if (rawList.length > 0 && matchedCount === 0) {
    safetyScore = 0;
  }

  return {
    safetyScore,
    totalParsed: rawList.length,
    matchedCount,
    unknownCount: unknown.length,
    flaggedCount,
    flaggedTriggers: flagged,
    matchedTokens, 
    unknownIngredients: unknown,
    comedogenicPenalty: totalComedogenicRating * 2
  };
}
