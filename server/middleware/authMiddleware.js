const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, 'Authentication required. No token provided.');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return ApiResponse.unauthorized(res, 'User belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'This account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.auth(`Token validation failed: ${error.message}`);
    return ApiResponse.unauthorized(res, 'Invalid or expired token. Please log in again.');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Role (${req.user ? req.user.role : 'guest'}) is not authorized to access this resource.`
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
