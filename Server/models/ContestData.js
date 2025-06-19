const mongoose = require('mongoose');

const ContestDataSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  cfContestId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  rank: {
    type: Number,
  },
  oldRating: {
    type: Number,
  },
  newRating: {
    type: Number,
  },
  ratingChange: {
    type: Number,
  },
  unsolvedProblems: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index for faster lookups
ContestDataSchema.index({ student: 1, cfContestId: 1 }, { unique: true });

module.exports = mongoose.model('ContestData', ContestDataSchema);