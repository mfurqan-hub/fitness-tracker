const getPasswordResetEmailTemplate = ({ name, resetUrl, supportEmail = 'support@fitnesstracker.com' }) => {
  return {
    subject: 'Password Reset Request — FitPulse',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #f43f5e; margin-bottom: 24px; text-align: center; }
          .title { font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
          .text { font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; text-align: center; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px; margin-top: 28px; text-align: center; }
          .code-box { background-color: #0f172a; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 13px; color: #f43f5e; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ FITPULSE SECURITY</div>
          <div class="title">Reset Your Password</div>
          <div class="text">
            Hello <strong>${name || 'Athlete'}</strong>,<br><br>
            We received a request to reset your FitPulse account password. Click the button below to choose a new password:
          </div>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
          </div>
          <div class="text" style="font-size: 13px;">
            Or copy and paste this link into your browser:
            <div class="code-box">${resetUrl}</div>
            This reset link is single-use and will expire in 1 hour. If you did not request a password reset, you can safely disregard this email—your account remains secure.
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} FitPulse Fitness Tracker. All rights reserved.<br>
            Need assistance? Contact <a href="mailto:${supportEmail}" style="color: #f43f5e;">${supportEmail}</a>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

module.exports = { getPasswordResetEmailTemplate };
