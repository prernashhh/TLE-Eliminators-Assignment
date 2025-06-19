const axios = require('axios');
const Student = require('../models/Student');
const ContestData = require('../models/ContestData');
const ProblemData = require('../models/ProblemData');

// Base URL for Codeforces API
const CF_API_BASE = 'https://codeforces.com/api';

/**
 * Fetches user info from Codeforces
 * @param {string} handle - Codeforces handle
 */
exports.getUserInfo = async (handle) => {
  try {
    const response = await axios.get(`${CF_API_BASE}/user.info`, {
      params: { handles: handle }
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch user data');
    }
    
    return response.data.result[0];
  } catch (error) {
    console.error(`Error fetching CF user info: ${error.message}`);
    throw error;
  }
};

/**
 * Fetches user's contest history
 * @param {string} handle - Codeforces handle
 */
exports.getUserContests = async (handle) => {
  try {
    const response = await axios.get(`${CF_API_BASE}/user.rating`, {
      params: { handle }
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch contest history');
    }
    
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching contest history: ${error.message}`);
    throw error;
  }
};

/**
 * Fetches user's submissions
 * @param {string} handle - Codeforces handle
 * @param {number} count - Number of submissions to fetch
 */
exports.getUserSubmissions = async (handle, count = 100) => {
  try {
    const response = await axios.get(`${CF_API_BASE}/user.status`, {
      params: { handle, count }
    });
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch submissions');
    }
    
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching submissions: ${error.message}`);
    throw error;
  }
};

/**
 * Sync all Codeforces data for a student
 * @param {Object} student - Student document
 */
exports.syncStudentCodeforcesData = async (student) => {
  try {
    // Get CF user info
    const userInfo = await this.getUserInfo(student.codeforcesHandle);
    
    // Update student data
    student.currentRating = userInfo.rating || 0;
    student.maxRating = userInfo.maxRating || 0;
    student.lastUpdated = new Date();
    
    await student.save();
    
    // Get contest history
    const contests = await this.getUserContests(student.codeforcesHandle);
    
    // Update total contests count
    student.totalContests = contests.length;
    await student.save();
    
    // Save contest data
    for (const contest of contests) {
      await ContestData.findOneAndUpdate(
        { 
          student: student._id, 
          cfContestId: contest.contestId 
        },
        {
          name: contest.contestName,
          date: new Date(contest.ratingUpdateTimeSeconds * 1000),
          rank: contest.rank,
          oldRating: contest.oldRating,
          newRating: contest.newRating,
          ratingChange: contest.newRating - contest.oldRating
        },
        { upsert: true, new: true }
      );
    }
    
    // Get submissions
    const submissions = await this.getUserSubmissions(student.codeforcesHandle, 500);
    
    // Filter accepted submissions and extract unique problems
    const acceptedSubmissions = submissions.filter(sub => sub.verdict === 'OK');
    
    // Track latest submission date
    if (submissions.length > 0) {
      const latestSubmission = new Date(submissions[0].creationTimeSeconds * 1000);
      student.lastSubmissionDate = latestSubmission;
      await student.save();
    }
    
    // Count solved problems
    const uniqueProblems = new Map();
    const languages = {};
    
    for (const submission of acceptedSubmissions) {
      const problemKey = `${submission.problem.contestId}-${submission.problem.index}`;
      
      // Count languages
      const lang = submission.programmingLanguage.split(' ')[0]; // Extract main language
      languages[lang] = (languages[lang] || 0) + 1;
      
      // Skip if we already processed this problem
      if (uniqueProblems.has(problemKey)) continue;
      
      uniqueProblems.set(problemKey, submission);
      
      // Save problem data
      await ProblemData.findOneAndUpdate(
        {
          student: student._id,
          problemId: problemKey
        },
        {
          contestId: submission.problem.contestId,
          index: submission.problem.index,
          name: submission.problem.name,
          rating: submission.problem.rating || 0,
          tags: submission.problem.tags,
          solvedDate: new Date(submission.creationTimeSeconds * 1000),
          submissionId: submission.id,
          language: submission.programmingLanguage
        },
        { upsert: true, new: true }
      );
    }
    
    // Update solved problems count
    student.solvedProblems = uniqueProblems.size;
    
    // Update preferred language
    if (Object.keys(languages).length > 0) {
      const preferredLanguage = Object.entries(languages).sort((a, b) => b[1] - a[1])[0][0];
      student.preferredLanguage = preferredLanguage;
    }
    
    await student.save();
    
    return {
      success: true,
      updatedStudent: student
    };
  } catch (error) {
    console.error(`Error syncing data for ${student.name}:`, error);
    return {
      success: false,
      error: error.message
    };
  }
};