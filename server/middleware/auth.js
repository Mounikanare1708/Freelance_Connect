const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - require valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Token invalid.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

/**
 * Authorize specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const hasAccess = roles.some(role => {
      if (role === 'freelancer') return userRole === 'freelancer' || userRole === 'both';
      if (role === 'client') return userRole === 'client' || userRole === 'both';
      return userRole === role;
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Role '${userRole}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

/**
 * Optional auth - attach user if token exists, don't fail if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
  } catch (_) {
    // Silent fail - token may be invalid but route is public
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
