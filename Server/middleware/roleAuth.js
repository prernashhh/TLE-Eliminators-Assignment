/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Required role(s) to access the route
 * @returns {function} Express middleware function
 */
const authorize = (roles) => {
  // Convert single role to array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Verify token must be called before this middleware
    if (!req.user) {
      return res.status(500).json({
        success: false,
        error: 'Server error - authentication not performed'
      });
    }

    // Check if user's role is in the allowed roles
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Access denied. ${req.user.role} is not authorized to access this resource.`
    });
  };
};

module.exports = authorize;