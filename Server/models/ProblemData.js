const mongoose = require('mongoose');

const ProblemDataSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  problemId: {
    type: String, // Format: contestId-index (e.g., "1700-A")
    required: true,
  },
  contestId: {
    type: Number,
  },
  index: {
    type: String, // Problem index in contest (A, B, C, etc.)
  },
  name: {
    type: String,
  },
  rating: {
    type: Number, // Difficulty rating
  },
  tags: [{
    type: String
  }],
  solvedDate: {
    type: Date,
    required: true,
  },
  submissionId: {
    type: Number,
  },
  language: {
    type: String,
  },
}, {
  timestamps: true,
});

// Compound index for preventing duplicate problem submissions
ProblemDataSchema.index({ student: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('ProblemData', ProblemDataSchema);
