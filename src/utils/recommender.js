import productsData from '../data/products.json';

// Simple heuristic engine to infer product category based on its ingredient markers
function inferCategory(parsedIngredients) {
  const allIngredients = [
    ...(parsedIngredients.matched || []),
    ...(parsedIngredients.flaggedTriggers || []),
    ...(parsedIngredients.unknownIngredients || []).map(x => ({ name: x }))
  ];

  const names = allIngredients.map(i => i.name.toLowerCase());

  // 1. Check for Surfactants -> Cleanser
  const cleanserMarkers = ['sulfate', 'betaine', 'glucoside', 'sarcosinate', 'isethionate'];
  if (names.some(name => cleanserMarkers.some(marker => name.includes(marker)))) {
    return 'Cleanser';
  }

  // 2. Check for UV Filters -> Sunscreen
  const sunscreenMarkers = ['zinc oxide', 'titanium dioxide', 'avobenzone', 'octinoxate', 'homosalate', 'octisalate', 'octocrylene'];
  if (names.some(name => sunscreenMarkers.some(marker => name.includes(marker)))) {
    // If it has tint/oxides AND titanium, could be foundation, but we'll lean sunscreen if exact chemical filters exist.
    return 'Sunscreen';
  }

  // 3. Check for obvious pigments -> Foundation
  const foundationMarkers = ['iron oxide', 'mica', 'tin oxide', 'bismuth oxychloride'];
  if (names.some(name => foundationMarkers.some(marker => name.includes(marker)))) {
    return 'Foundation';
  }

  // 4. Default -> Moisturizer
  return 'Moisturizer';
}

export function getSafeSwaps(parsedResults, targetCategory = "All") {
  if (!parsedResults || parsedResults.flaggedCount === 0) return null;

  const category = (targetCategory && targetCategory !== "All") ? targetCategory : inferCategory(parsedResults);
  const recommendations = productsData.filter(product => product.category.toLowerCase() === category.toLowerCase());

  return {
    category,
    recommendations: recommendations.slice(0, 5) // Return top 5
  };
}
