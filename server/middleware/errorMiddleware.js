const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

// 404 Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Log error
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with the specified ID.';
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field}. Please use another value.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    errors = Object.values(err.errors).map((e) => e.message);
    message = 'Validation failed. Please check your inputs.';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired.';
  }

  return ApiResponse.error(res, message, statusCode, errors);
};

module.exports = {
  notFound,
  errorHandler
};
