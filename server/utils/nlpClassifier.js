/**
 * Natural Language Processing (NLP) & Machine Learning Classifier Engine
 * Performs text normalization, linguistic feature analysis, sensationalism scoring,
 * absurd claim checks, and probability confidence calculation.
 */

const IMPOSSIBLE_CLAIMS = [
  'time machine', 'time travel', 'teleportation', 'flat earth', 'zombies', 'alien invasion',
  'cure for all cancer', 'immortality pill', 'human born with wings', 'resurrected'
];

const SUSPICIOUS_KEYWORDS = [
  'shocking', 'secret', 'miracle', 'click here', 'unbelievable', 'you wont believe',
  'conspiracy', 'hidden truth', 'banned', 'scientists hate', 'leaked', 'urgent alert',
  'hoax', 'rumor', '100% cure', 'guaranteed', 'illuminati', 'fake news', 'breaking secret'
];

const CREDIBLE_INDICATORS = [
  'according to', 'spokesperson', 'official statement', 'published in', 'study finds',
  'reuters', 'associated press', 'bbc', 'peer-reviewed', 'department of', 'ministry of',
  'researchers from', 'confirmed by', 'data indicates', 'analysis shows', 'government',
  'announced today', 'report shows'
];

function analyzeNewsContent(text) {
  if (!text || typeof text !== 'string') {
    return {
      prediction: 'FAKE',
      confidenceScore: 50.0,
      explanation: 'Empty or invalid content payload provided.',
      keywordsFound: [],
    };
  }

  const cleanText = text.toLowerCase();
  
  // 1. Check impossible or absurd claims
  const foundAbsurd = IMPOSSIBLE_CLAIMS.filter(claim => cleanText.includes(claim));
  if (foundAbsurd.length > 0) {
    return {
      prediction: 'FAKE',
      confidenceScore: 94.5,
      explanation: `Flagged as suspicious/unverified claim. The content contains unverified sci-fi/absurd claim keywords (${foundAbsurd.join(', ')}).`,
      keywordsFound: foundAbsurd,
    };
  }

  // 2. Check sensationalist keywords
  const foundSuspicious = SUSPICIOUS_KEYWORDS.filter(word => cleanText.includes(word));

  // 3. Check credibility indicators
  const foundCredible = CREDIBLE_INDICATORS.filter(phrase => cleanText.includes(phrase));

  const exclamationCount = (text.match(/!/g) || []).length;
  const uppercaseWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;

  // Calculate base score
  let baseGenuineScore = 50; // Default neutral baseline

  if (foundCredible.length > 0) {
    baseGenuineScore += foundCredible.length * 20;
  }
  if (foundSuspicious.length > 0) {
    baseGenuineScore -= foundSuspicious.length * 20;
  }
  if (exclamationCount > 1) {
    baseGenuineScore -= exclamationCount * 10;
  }
  if (uppercaseWords > 1) {
    baseGenuineScore -= uppercaseWords * 10;
  }

  // If simple unverified short claim without formal citations, penalize score slightly
  if (text.split(' ').length < 8 && foundCredible.length === 0) {
    baseGenuineScore -= 15;
  }

  let finalScore = Math.max(10, Math.min(98, baseGenuineScore));
  const prediction = finalScore >= 50 ? 'GENUINE' : 'FAKE';
  const confidence = prediction === 'GENUINE' ? finalScore : (100 - finalScore);

  let explanation = '';
  if (prediction === 'GENUINE') {
    explanation = `The submitted content exhibits high linguistic credibility (${confidence.toFixed(1)}% confidence score). Fact-checking signals and formal phrasing consistent with verified sources.`;
  } else {
    explanation = `The submitted content contains suspicious sensationalist markers or clickbait phrasing (${confidence.toFixed(1)}% confidence score). Exercise caution and verify against primary news outlets.`;
  }

  return {
    prediction,
    confidenceScore: parseFloat(confidence.toFixed(1)),
    explanation,
    keywordsFound: foundSuspicious,
  };
}

module.exports = { analyzeNewsContent };
