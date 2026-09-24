const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, validatePasswordChange } = require('../validators/authValidator');
const { authLimiter } = require('../middleware/rateLimiter');

// Authentication & Social Login
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/firebase', authLimiter, firebaseAuth);

// OTP Email Verification
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);

// Email Verification (legacy link-based — kept for compatibility) & Password Recovery
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Authenticated User Endpoints
router.get('/me', protect, getMe);
router.put('/update-password', protect, validatePasswordChange, updatePassword);

module.exports = router;
