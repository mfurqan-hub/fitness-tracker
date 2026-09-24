const crypto = require('crypto');
const User = require('../models/User');
const SystemLog = require('../models/SystemLog');
const ApiResponse = require('../utils/apiResponse');
const { generateToken } = require('../utils/tokenUtils');
const { verifyFirebaseIdToken } = require('../config/firebase');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// Helper: generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper to sanitize and format user response object
const formatUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  role: user.role,
  authProvider: user.authProvider || 'local',
  emailVerified: Boolean(user.emailVerified),
  avatar: user.avatar,
  gender: user.gender,
  age: user.age,
  height: user.height,
  weight: user.weight,
  bio: user.bio,
  fitnessGoal: user.fitnessGoal,
  targetCalories: user.targetCalories,
  targetProtein: user.targetProtein,
  targetCarbs: user.targetCarbs,
  targetFat: user.targetFat,
  preferences: user.preferences,
  token
});

// @desc    Register a new user (sends OTP to email)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const SystemSetting = require('../models/SystemSetting');
    const settings = await SystemSetting.findOne({ key: 'platform_config' });
    if (settings && settings.allowUserRegistration === false) {
      return ApiResponse.forbidden(res, 'New user registration is currently suspended by the system administrator.');
    }

    const { name, username, email, password, gender, age, height, weight, fitnessGoal } = req.body;

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return ApiResponse.conflict(res, 'An account with this email address already exists.');
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return ApiResponse.conflict(res, 'This username is already taken. Please choose another.');
    }

    // Generate 6-digit OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      authProvider: 'local',
      emailVerified: false,
      emailOtp: otp,
      emailOtpExpires: otpExpires,
      emailOtpAttempts: 0,
      gender: gender || 'prefer-not-to-say',
      age: age ? Number(age) : null,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      fitnessGoal: fitnessGoal || 'overall_health'
    });

    const token = generateToken(user._id, user.role);

    logger.auth(`New user registered: ${user.email} (ID: ${user._id})`);
    await SystemLog.create({
      action: 'USER_REGISTER',
      user: user._id,
      userEmail: user.email,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      severity: 'info'
    });

    // Send OTP email
    try {
      await emailService.sendOtpEmail({
        to: user.email,
        name: user.name,
        otp,
        expiresInMinutes: 10
      });
    } catch (mailErr) {
      logger.error(`Error sending OTP email: ${mailErr.message}`);
    }

    const userResponse = formatUserResponse(user, token);
    return ApiResponse.created(res, 'Registration successful. An OTP has been sent to your email.', userResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Send/Resend OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email address is required.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+emailOtp +emailOtpExpires +emailOtpAttempts');

    if (!user) {
      return ApiResponse.success(res, 'If an account with this email exists, an OTP has been sent.');
    }

    if (user.emailVerified) {
      return ApiResponse.success(res, 'This email is already verified. You can log in.');
    }

    // Rate-limit: max 5 resends per 10 min window
    if (
      user.emailOtpExpires &&
      user.emailOtpExpires > new Date() &&
      user.emailOtpAttempts >= 5
    ) {
      return ApiResponse.tooManyRequests(res, 'Too many OTP requests. Please wait before requesting again.');
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOtp = otp;
    user.emailOtpExpires = otpExpires;
    user.emailOtpAttempts = (user.emailOtpAttempts || 0) + 1;
    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendOtpEmail({
        to: user.email,
        name: user.name,
        otp,
        expiresInMinutes: 10
      });
    } catch (mailErr) {
      logger.error(`Error sending OTP: ${mailErr.message}`);
    }

    return ApiResponse.success(res, 'OTP sent to your email address.');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return ApiResponse.badRequest(res, 'Email and OTP are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+emailOtp +emailOtpExpires +emailOtpAttempts');

    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid email or OTP.');
    }

    if (user.emailVerified) {
      const token = generateToken(user._id, user.role);
      return ApiResponse.success(res, 'Email already verified.', formatUserResponse(user, token));
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      return ApiResponse.badRequest(res, 'No OTP found. Please request a new one.');
    }

    if (user.emailOtpExpires < new Date()) {
      return ApiResponse.badRequest(res, 'OTP has expired. Please request a new one.');
    }

    if (user.emailOtp !== otp.toString().trim()) {
      return ApiResponse.badRequest(res, 'Invalid OTP. Please check and try again.');
    }

    // OTP is correct — verify email
    user.emailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpires = null;
    user.emailOtpAttempts = 0;
    await user.save({ validateBeforeSave: false });

    logger.auth(`Email verified via OTP for user: ${user.email}`);
    await SystemLog.create({
      action: 'EMAIL_VERIFIED',
      user: user._id,
      userEmail: user.email,
      severity: 'info'
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({ to: user.email, name: user.name });
    } catch (mailErr) {
      logger.error(`Error sending welcome email: ${mailErr.message}`);
    }

    const token = generateToken(user._id, user.role);
    return ApiResponse.success(res, 'Email verified successfully! Welcome to FitPulse.', formatUserResponse(user, token));
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Search by email or username
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: email.toLowerCase().trim() }
      ]
    }).select('+password');

    if (!user) {
      logger.auth(`Failed login attempt for identifier: ${email}`);
      return ApiResponse.unauthorized(res, 'Invalid credentials. User not found.');
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, 'Your account has been deactivated. Please contact support.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logger.auth(`Invalid password attempt for user: ${user.email}`);
      return ApiResponse.unauthorized(res, 'Invalid email or password.');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    logger.auth(`User logged in: ${user.email}`);
    await SystemLog.create({
      action: 'USER_LOGIN',
      user: user._id,
      userEmail: user.email,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'] || '',
      severity: 'info'
    });

    const userResponse = formatUserResponse(user, token);
    return ApiResponse.success(res, 'Logged in successfully', userResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Firebase Social Authentication (Google only)
// @route   POST /api/auth/firebase
// @access  Public
const firebaseAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return ApiResponse.badRequest(res, 'Firebase ID token is required.');
    }

    // Verify token using Firebase Admin SDK
    const decodedToken = await verifyFirebaseIdToken(idToken);
    const { uid, email, name, picture, email_verified, firebase } = decodedToken;

    if (!email) {
      return ApiResponse.badRequest(res, 'Google account must provide an email address.');
    }

    const providerId = firebase?.sign_in_provider || 'google.com';
    if (!providerId.includes('google')) {
      return ApiResponse.badRequest(res, 'Only Google sign-in is supported.');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Search for existing user by firebaseUid or email
    let user = await User.findOne({
      $or: [{ firebaseUid: uid }, { email: normalizedEmail }]
    });

    if (user) {
      // Security Check: If user exists with local provider and no firebaseUid linked
      if (user.authProvider === 'local' && (!user.firebaseUid || user.firebaseUid !== uid)) {
        return ApiResponse.conflict(
          res,
          'An account with this email already exists using password authentication. Please sign in with your email and password.'
        );
      }

      if (!user.isActive) {
        return ApiResponse.forbidden(res, 'Your account has been deactivated. Please contact support.');
      }

      // Update firebase identity
      user.firebaseUid = uid;
      if (email_verified && !user.emailVerified) {
        user.emailVerified = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      logger.auth(`Google login successful: ${user.email}`);
    } else {
      // Check registration governance
      const SystemSetting = require('../models/SystemSetting');
      const settings = await SystemSetting.findOne({ key: 'platform_config' });
      if (settings && settings.allowUserRegistration === false) {
        return ApiResponse.forbidden(res, 'New user registration is currently suspended by the system administrator.');
      }

      // Generate unique username from name or email prefix
      const baseUsername = (name || normalizedEmail.split('@')[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 15) || 'athlete';

      let uniqueUsername = baseUsername;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      // Create new Google user (Role is ALWAYS user, NEVER admin from client/firebase)
      user = await User.create({
        name: name || 'Athlete',
        username: uniqueUsername,
        email: normalizedEmail,
        authProvider: 'google',
        firebaseUid: uid,
        emailVerified: Boolean(email_verified),
        avatar: picture || '',
        role: 'user', // strictly enforced
        gender: 'prefer-not-to-say',
        fitnessGoal: 'overall_health'
      });

      logger.auth(`New Google user registered: ${user.email}`);
      await SystemLog.create({
        action: 'USER_SOCIAL_REGISTER',
        user: user._id,
        userEmail: user.email,
        details: { authProvider: 'google', firebaseUid: uid },
        severity: 'info'
      });
    }

    // Generate FitPulse JWT token for API authorization
    const token = generateToken(user._id, user.role);
    const userResponse = formatUserResponse(user, token);

    return ApiResponse.success(res, 'Authenticated via Google successfully', userResponse);
  } catch (error) {
    logger.error(`Firebase auth failure: ${error.message}`);
    return ApiResponse.unauthorized(res, error.message || 'Invalid Firebase authentication token.');
  }
};

// @desc    Verify email address (legacy token-based — kept for backward compat)
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return ApiResponse.badRequest(res, 'Verification token is required.');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationTokenHash +emailVerificationExpires');

    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid or expired email verification token.');
    }

    user.emailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpires = null;
    await user.save({ validateBeforeSave: false });

    logger.auth(`Email verified for user: ${user.email}`);
    await SystemLog.create({
      action: 'EMAIL_VERIFIED',
      user: user._id,
      userEmail: user.email,
      severity: 'info'
    });

    try {
      await emailService.sendWelcomeEmail({ to: user.email, name: user.name });
    } catch (mailErr) {
      logger.error(`Error sending welcome email: ${mailErr.message}`);
    }

    return ApiResponse.success(res, 'Email address verified successfully. Your account is fully active.');
  } catch (error) {
    next(error);
  }
};

// @desc    Resend email OTP
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Please provide an email address.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+emailOtp +emailOtpExpires +emailOtpAttempts');

    if (!user) {
      return ApiResponse.success(res, 'If an unverified account with this email exists, an OTP has been sent.');
    }

    if (user.emailVerified) {
      return ApiResponse.success(res, 'This account has already been verified. You can log in.');
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOtp = otp;
    user.emailOtpExpires = otpExpires;
    user.emailOtpAttempts = (user.emailOtpAttempts || 0) + 1;
    await user.save({ validateBeforeSave: false });

    await emailService.sendOtpEmail({ to: user.email, name: user.name, otp, expiresInMinutes: 10 });

    return ApiResponse.success(res, 'A new OTP has been sent to your email.');
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Please provide an email address.');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && user.isActive && user.authProvider === 'local') {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetTokenHash = resetTokenHash;
      user.passwordResetExpires = resetExpires;
      await user.save({ validateBeforeSave: false });

      logger.auth(`Password reset requested for: ${user.email}`);

      try {
        await emailService.sendPasswordResetEmail({ to: user.email, name: user.name, token: resetToken });
      } catch (mailErr) {
        logger.error(`Failed to send password reset email: ${mailErr.message}`);
      }
    }

    return ApiResponse.success(
      res,
      'If an account with that email address exists, password reset instructions have been sent.'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return ApiResponse.badRequest(res, 'Reset token and new password are required.');
    }

    if (password.length < 6) {
      return ApiResponse.badRequest(res, 'Password must be at least 6 characters long.');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetTokenHash +passwordResetExpires');

    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid or expired password reset token.');
    }

    user.password = password;
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save(); // pre-save bcrypt hashes password

    logger.auth(`Password successfully reset for: ${user.email}`);
    await SystemLog.create({
      action: 'PASSWORD_RESET_COMPLETE',
      user: user._id,
      userEmail: user.email,
      severity: 'info'
    });

    return ApiResponse.success(res, 'Your password has been reset successfully. You can now log in.');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }
    return ApiResponse.success(res, 'User profile fetched', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return ApiResponse.badRequest(res, 'Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();

    logger.auth(`Password updated for user: ${user.email}`);
    await SystemLog.create({
      action: 'PASSWORD_CHANGE',
      user: user._id,
      userEmail: user.email,
      severity: 'info'
    });

    const token = generateToken(user._id, user.role);
    return ApiResponse.success(res, 'Password changed successfully', { token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  sendOtp,
  verifyOtp,
  login,
  firebaseAuth,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updatePassword
};
