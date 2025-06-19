const { validationResult } = require('express-validator');
const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-__v');
    res.status(200).json({ 
      success: true, 
      count: students.length, 
      data: students 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Get single student by ID
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Create new student
exports.createStudent = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        error: 'A student with this email already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Export student data as CSV
exports.exportStudentsCSV = async (req, res) => {
  try {
    const students = await Student.find();
    
    // Generate CSV header
    let csv = 'Name,Email,Phone,Codeforces Handle,Current Rating,Max Rating,Total Contests,Solved Problems,Last Updated\n';
    
    // Add data rows
    students.forEach(student => {
      csv += `"${student.name}","${student.email}","${student.phone}","${student.codeforcesHandle}",${student.currentRating},${student.maxRating},${student.totalContests},${student.solvedProblems},"${student.lastUpdated.toISOString()}"\n`;
    });
    
    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
    
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Toggle email reminder setting for a student
exports.toggleEmailReminders = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    // Toggle the emailRemindersEnabled field
    student.emailRemindersEnabled = !student.emailRemindersEnabled;
    await student.save();
    
    res.status(200).json({ 
      success: true, 
      data: student 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};