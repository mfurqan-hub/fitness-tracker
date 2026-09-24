const getWelcomeEmailTemplate = ({ name, dashboardUrl = 'http://localhost:5173/dashboard' }) => {
  return {
    subject: 'Welcome to FitPulse — Account Verified!',
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
          .text { font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px; }
          .feature-list { background-color: #0f172a; border-radius: 12px; padding: 18px 24px; margin: 20px 0; border: 1px solid #334155; }
          .feature-item { font-size: 14px; color: #cbd5e1; margin-bottom: 10px; display: flex; align-items: center; }
          .feature-item:last-child { margin-bottom: 0; }
          .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff !important; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .footer { font-size: 12px; color: #64748b; border-top: 1px solid #334155; padding-top: 20px; margin-top: 28px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ FITPULSE</div>
          <div class="title">Welcome to FitPulse, ${name || 'Athlete'}! 🎉</div>
          <div class="text">
            Your email has been verified. Your athlete account is active and ready for your fitness journey.
          </div>
          <div class="feature-list">
            <div class="feature-item">🏋️ &nbsp;<strong>Workouts:</strong> Log multi-set routines with automatic volume progression</div>
            <div class="feature-item">🥗 &nbsp;<strong>Nutrition:</strong> Track daily macros, calories, and hydration balance</div>
            <div class="feature-item">📈 &nbsp;<strong>Progress:</strong> Record body metrics and track personal records</div>
            <div class="feature-item">🎯 &nbsp;<strong>Goals:</strong> Set performance milestones and celebrate breakthroughs</div>
          </div>
          <div style="text-align: center;">
            <a href="${dashboardUrl}" class="btn" target="_blank">Launch Athlete Dashboard</a>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} FitPulse Fitness Tracker. Built for champions.
          </div>
        </div>
      </body>
      </html>
    `
  };
};

module.exports = { getWelcomeEmailTemplate };
