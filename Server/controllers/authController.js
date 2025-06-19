const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if role is not provided
    });

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }, // Token expires in 1 day
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          token
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }, // Token expires in 1 day
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          success: true,
          token
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    // Use the user ID from the verified token (added by auth middleware)
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};