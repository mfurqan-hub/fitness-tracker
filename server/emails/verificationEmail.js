const getVerificationEmailTemplate = ({ name, verificationUrl, supportEmail = 'support@fitnesstracker.com' }) => {
  return {
    subject: 'Verify Your Email Address — FitPulse',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #10b981; margin-bottom: 24px; text-align: center; }
          .title { font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
          .text { font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; text-align: center; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px; margin-top: 28px; text-align: center; }
          .code-box { background-color: #0f172a; padding: 12px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 13px; color: #38bdf8; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ FITPULSE</div>
          <div class="title">Verify Your Email Address</div>
          <div class="text">
            Hello <strong>${name || 'Athlete'}</strong>,<br><br>
            Thank you for registering on FitPulse. To activate your account and start logging workouts, nutrition, and tracking fitness progress, please verify your email address.
          </div>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="btn" target="_blank">Verify Email Address</a>
          </div>
          <div class="text" style="font-size: 13px;">
            Or copy and paste this link into your browser:
            <div class="code-box">${verificationUrl}</div>
            This verification link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} FitPulse Fitness Tracker. All rights reserved.<br>
            Need help? Contact <a href="mailto:${supportEmail}" style="color: #10b981;">${supportEmail}</a>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

module.exports = { getVerificationEmailTemplate };
