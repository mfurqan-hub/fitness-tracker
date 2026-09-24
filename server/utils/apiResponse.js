class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200, meta = null) {
    const payload = {
      success: true,
      message,
      data
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const payload = {
      success: false,
      message
    };
    if (errors) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }

  static badRequest(res, message = 'Bad Request', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static conflict(res, message = 'Conflict detected') {
    return this.error(res, message, 409);
  }

  static unprocessable(res, message = 'Validation error', errors = null) {
    return this.error(res, message, 422, errors);
  }

  static tooManyRequests(res, message = 'Too many requests') {
    return this.error(res, message, 429);
  }
}

module.exports = ApiResponse;
