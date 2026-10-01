const express = require('express');
const authMiddleware = require('../middleware/auth');
const PredictionHistory = require('../models/PredictionHistory');
const { classifyWithHuggingFace } = require('../utils/huggingFaceClassifier');

const router = express.Router();

/**
 * @route   POST /api/news/verify
 * @desc    Analyze news article text/headline and save to prediction history
 * @access  Private
 */
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { newsContent } = req.body;

    if (!newsContent || !newsContent.trim()) {
      return res.status(400).json({ message: 'Please enter news content, headline, or article URL.' });
    }

    // Run Hugging Face AI Deep Learning Classification Engine
    const analysis = await classifyWithHuggingFace(newsContent);

    // Save prediction history to MongoDB
    const newRecord = new PredictionHistory({
      userId: req.user.id,
      newsContent: newsContent.trim(),
      prediction: analysis.prediction,
      confidenceScore: analysis.confidenceScore,
      statusMessage: analysis.explanation,
    });

    await newRecord.save();

    return res.status(200).json({
      message: 'Authenticity analysis completed.',
      prediction: analysis.prediction,
      confidenceScore: analysis.confidenceScore,
      explanation: analysis.explanation,
      keywordsFound: analysis.keywordsFound,
      recordId: newRecord._id,
      createdAt: newRecord.createdAt,
    });
  } catch (error) {
    console.error('[News Verification Error]:', error);
    return res.status(500).json({ message: 'Server error analyzing news authenticity.' });
  }
});

/**
 * @route   GET /api/news/history
 * @desc    Get prediction history for logged in user
 * @access  Private
 */
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user.id };

    if (search && search.trim()) {
      query.newsContent = { $regex: search.trim(), $options: 'i' };
    }

    const history = await PredictionHistory.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      history,
      totalCount: history.length,
    });
  } catch (error) {
    console.error('[Get History Error]:', error);
    return res.status(500).json({ message: 'Server error retrieving history logs.' });
  }
});

/**
 * @route   DELETE /api/news/history/:id
 * @desc    Delete a prediction record from history
 * @access  Private
 */
router.delete('/history/:id', authMiddleware, async (req, res) => {
  try {
    const record = await PredictionHistory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!record) {
      return res.status(404).json({ message: 'History record not found or unauthorized.' });
    }

    return res.status(200).json({ message: 'History record deleted successfully.' });
  } catch (error) {
    console.error('[Delete History Error]:', error);
    return res.status(500).json({ message: 'Server error deleting history record.' });
  }
});

module.exports = router;
