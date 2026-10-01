const { analyzeNewsContent: localNlpAnalyze } = require('./nlpClassifier');

/**
 * Classify news content using Hugging Face Transformer Inference API
 */
async function classifyWithHuggingFace(text) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey || !apiKey.startsWith('hf_')) {
    return localNlpAnalyze(text);
  }

  // Pre-check impossible claims first (e.g. "time machine", "flat earth")
  const localCheck = localNlpAnalyze(text);
  if (localCheck.prediction === 'FAKE' && localCheck.keywordsFound && localCheck.keywordsFound.length > 0) {
    localCheck.modelUsed = 'Hybrid NLP Rule Classifier';
    return localCheck;
  }

  const model = process.env.HUGGINGFACE_MODEL || 'hamzab/roberta-fake-news-classification';
  const url = `https://router.huggingface.co/hf-inference/models/${model}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const predictions = Array.isArray(data[0]) ? data[0] : data;
        const topResult = predictions.reduce((max, item) => (item.score > max.score ? item : max), predictions[0]);

        const labelUpper = (topResult.label || '').toUpperCase();
        let prediction = 'GENUINE';

        if (labelUpper.includes('FAKE') || labelUpper.includes('LABEL_0') || labelUpper.includes('UNRELIABLE')) {
          prediction = 'FAKE';
        } else if (labelUpper.includes('REAL') || labelUpper.includes('LABEL_1') || labelUpper.includes('RELIABLE')) {
          prediction = 'GENUINE';
        }

        const scorePercent = parseFloat((topResult.score * 100).toFixed(1));

        return {
          prediction,
          confidenceScore: scorePercent,
          explanation: `Evaluated by Hugging Face Deep Learning AI Model (${model}). Verdict: ${prediction} with ${scorePercent}% confidence score.`,
          keywordsFound: [],
          modelUsed: `HuggingFace (${model})`,
        };
      }
    }
  } catch (err) {
    console.warn('[Hugging Face Inference Error]:', err.message);
  }

  // Fall back to hybrid NLP classifier
  return localCheck;
}

module.exports = { classifyWithHuggingFace };
