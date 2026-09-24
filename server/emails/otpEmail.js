/**
 * OTP Email Template — 6-digit code for email verification
 */
const getOtpEmailTemplate = ({ name, otp, expiresInMinutes = 10 }) => {
  const subject = `${otp} — Your FitPulse Verification Code`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FitPulse OTP Verification</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(160deg,#1e293b 0%,#0f172a 100%);border-radius:20px;border:1px solid #334155;overflow:hidden;max-width:520px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#10b981 0%,#06b6d4 100%);padding:30px 40px;text-align:center;">
              <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;">FitPulse ⚡</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Email Verification</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <p style="margin:0 0 12px;font-size:22px;font-weight:700;color:#f1f5f9;">Hi ${name || 'Athlete'}! 👋</p>
              <p style="margin:0 0 28px;font-size:15px;color:#94a3b8;line-height:1.7;">
                Use the verification code below to confirm your email address. This code is valid for <strong style="color:#f1f5f9;">${expiresInMinutes} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#0f172a;border:2px dashed #10b981;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
                <div style="letter-spacing:16px;font-size:42px;font-weight:900;color:#10b981;font-family:'Courier New',monospace;line-height:1;">${otp}</div>
                <div style="margin-top:10px;font-size:12px;color:#64748b;letter-spacing:1px;text-transform:uppercase;">Your one-time code</div>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#64748b;line-height:1.6;">
                ⏰ This code expires in <strong style="color:#f87171;">${expiresInMinutes} minutes</strong>.<br/>
                🔒 Never share this code with anyone.<br/>
                ❓ Didn't request this? You can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #1e293b;">
              <p style="margin:0;font-size:12px;color:#475569;text-align:center;">
                © 2026 FitPulse · Academic Fitness Tracker<br/>
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
};

module.exports = { getOtpEmailTemplate };
