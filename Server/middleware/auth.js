const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token in the Authorization header
 * Adds user data to req.user if valid token is provided
 */
const verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  let token;
  
  // Check if token exists and has Bearer prefix
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request object
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Authorization denied.'
    });
  }
};

module.exports = verifyToken;