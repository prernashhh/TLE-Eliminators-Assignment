const Student = require('../models/Student');
const ContestData = require('../models/ContestData');
const ProblemData = require('../models/ProblemData');

// Sync CF data for a specific student
exports.syncStudentData = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    // Here you would call a function that does the actual CF data fetching
    // For now, we'll just update the lastUpdated timestamp
    student.lastUpdated = new Date();
    await student.save();
    
    res.status(200).json({
      success: true,
      message: `Data synced successfully for ${student.name}`,
      data: student
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to sync Codeforces data'
    });
  }
};

// Get contest history for a student with filtering
exports.getContestHistory = async (req, res) => {
  try {
    // Get days parameter with default of 30
    const days = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Find the student first
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    // Get contest history for specified time period
    const contests = await ContestData.find({
      student: req.params.studentId,
      date: { $gte: cutoffDate }
    }).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: contests.length,
      data: contests
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Get problem solving data for a student with filtering
exports.getProblemSolvingData = async (req, res) => {
  try {
    // Get days parameter with default of 30
    const days = parseInt(req.query.days) || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Find the student first
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    
    // Get problems solved in specified time period
    const problems = await ProblemData.find({
      student: req.params.studentId,
      solvedDate: { $gte: cutoffDate }
    }).sort({ solvedDate: -1 });
    
    // Calculate statistics
    const totalProblems = problems.length;
    
    // Find most difficult problem
    let mostDifficultProblem = null;
    if (totalProblems > 0) {
      mostDifficultProblem = problems.reduce((prev, current) => 
        (prev.rating > current.rating) ? prev : current
      );
    }
    
    // Calculate average rating
    const avgRating = totalProblems > 0 
      ? problems.reduce((sum, problem) => sum + (problem.rating || 0), 0) / totalProblems 
      : 0;
    
    // Calculate average problems per day
    const avgProblemsPerDay = totalProblems / days;
    
    // Group problems by rating bucket
    const ratingBuckets = {};
    problems.forEach(problem => {
      // Define buckets (e.g., 800-999, 1000-1199, etc.)
      let bucket = 'unrated';
      if (problem.rating) {
        bucket = Math.floor(problem.rating / 200) * 200;
      }
      
      if (!ratingBuckets[bucket]) {
        ratingBuckets[bucket] = 0;
      }
      ratingBuckets[bucket]++;
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalProblems,
        mostDifficultProblem,
        avgRating,
        avgProblemsPerDay,
        ratingBuckets,
        problems
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};