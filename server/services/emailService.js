const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { getVerificationEmailTemplate } = require('../emails/verificationEmail');
const { getPasswordResetEmailTemplate } = require('../emails/passwordResetEmail');
const { getWelcomeEmailTemplate } = require('../emails/welcomeEmail');
const { getOtpEmailTemplate } = require('../emails/otpEmail');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });
    logger.info(`SMTP Transporter initialized for ${host}:${port}`);
    return transporter;
  }

  if (process.env.NODE_ENV === 'production') {
    logger.error('SMTP configuration missing in production environment. Emails will fail.');
    throw new Error('SMTP credentials missing in production environment. Please configure SMTP_HOST, SMTP_USER, SMTP_PASS.');
  }

  // Development / Test mode without SMTP: simulated dry-run transporter
  logger.warn('SMTP credentials not configured. Running in simulated dry-run mode for development/testing.');
  return null;
};

const sendMail = async ({ to, subject, html, text }) => {
  const mailFrom = process.env.MAIL_FROM || 'FitPulse <no-reply@fitnesstracker.com>';
  const activeTransporter = getTransporter();

  if (!activeTransporter) {
    // Dry-run mode for dev/test
    logger.info(`[EMAIL SIMULATION] To: ${to} | Subject: "${subject}" (Dry-run mode active)`);
    return { success: true, simulated: true };
  }

  try {
    const info = await activeTransporter.sendMail({
      from: mailFrom,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, '')
    });
    logger.info(`Email dispatched successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    return { success: false, error: err.message };
  }
};

/**
 * Sends an email verification link to a user.
 */
const sendVerificationEmail = async ({ to, name, token }) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verificationUrl = `${clientUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const template = getVerificationEmailTemplate({ name, verificationUrl });

  return await sendMail({
    to,
    subject: template.subject,
    html: template.html
  });
};

/**
 * Sends a password reset link to a user.
 */
const sendPasswordResetEmail = async ({ to, name, token }) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const template = getPasswordResetEmailTemplate({ name, resetUrl });

  return await sendMail({
    to,
    subject: template.subject,
    html: template.html
  });
};

/**
 * Sends a welcome email after account verification.
 */
const sendWelcomeEmail = async ({ to, name }) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const dashboardUrl = `${clientUrl}/dashboard`;
  const template = getWelcomeEmailTemplate({ name, dashboardUrl });

  return await sendMail({
    to,
    subject: template.subject,
    html: template.html
  });
};

/**
 * Sends a 6-digit OTP to the user for email verification.
 */
const sendOtpEmail = async ({ to, name, otp, expiresInMinutes = 10 }) => {
  const template = getOtpEmailTemplate({ name, otp, expiresInMinutes });
  return await sendMail({
    to,
    subject: template.subject,
    html: template.html
  });
};

module.exports = {
  sendMail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendOtpEmail
};
