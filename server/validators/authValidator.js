const ApiResponse = require('../utils/apiResponse');

const validateRegister = (req, res, next) => {
  const { name, username, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Full name is required.');
  }

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long.');
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push('Password and Confirm Password do not match.');
  }

  if (errors.length > 0) {
    return ApiResponse.unprocessable(res, 'Validation failed for registration.', errors);
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email or username is required.');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return ApiResponse.unprocessable(res, 'Validation failed for login.', errors);
  }

  next();
};

const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push('Current password is required.');
  }

  if (!newPassword || newPassword.length < 6) {
    errors.push('New password must be at least 6 characters long.');
  }

  if (confirmNewPassword && newPassword !== confirmNewPassword) {
    errors.push('New password confirmation does not match.');
  }

  if (errors.length > 0) {
    return ApiResponse.unprocessable(res, 'Validation failed for password change.', errors);
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordChange
};
