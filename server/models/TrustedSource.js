const mongoose = require('mongoose');

const trustedSourceSchema = new mongoose.Schema(
  {
    domainName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    organization: {
      type: String,
      required: true,
    },
    trustScore: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      default: 'Mainstream News',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TrustedSource', trustedSourceSchema);
