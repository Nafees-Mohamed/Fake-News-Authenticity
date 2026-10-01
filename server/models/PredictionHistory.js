const mongoose = require('mongoose');

const predictionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    newsContent: {
      type: String,
      required: true,
    },
    prediction: {
      type: String,
      enum: ['GENUINE', 'FAKE', 'PENDING_ANALYSIS'],
      default: 'PENDING_ANALYSIS',
    },
    confidenceScore: {
      type: Number,
      default: 0.0,
    },
    statusMessage: {
      type: String,
      default: 'Coming in next phase (AI Model Integration)',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);
