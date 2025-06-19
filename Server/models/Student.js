const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  codeforcesHandle: {
    type: String,
    required: [true, 'Please provide a Codeforces handle'],
    trim: true,
  },
  currentRating: {
    type: Number,
    default: 0,
  },
  maxRating: {
    type: Number,
    default: 0,
  },
  totalContests: {
    type: Number,
    default: 0,
  },
  solvedProblems: {
    type: Number,
    default: 0,
  },
  preferredLanguage: {
    type: String,
    default: 'C++',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  lastSubmissionDate: {
    type: Date,
    default: null,
  },
  emailReminders: {
    type: Number,
    default: 0,
  },
  emailRemindersEnabled: {
    type: Boolean,
    default: true,
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Creates createdAt and updatedAt fields
});

module.exports = mongoose.model('Student', StudentSchema);