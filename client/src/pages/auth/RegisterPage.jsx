import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Dumbbell,
  RefreshCw,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { firebaseAuthService } from '../../services/firebaseAuth';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// ── OTP Verify Screen ──────────────────────────────────────────────────────────
const OtpVerifyScreen = ({ email, userName, onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const otpValue = otp.join('');

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMsg('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      pasted.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      setErrorMsg('Please enter the full 6-digit OTP.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await authService.verifyOtp(email, otpValue);
      if (res.success) {
        onVerified(res.data);
      } else {
        setErrorMsg(res.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await authService.sendOtp(email);
      if (res.success) {
        setSuccessMsg('A new OTP has been sent to your email!');
        startCooldown();
      } else {
        setErrorMsg(res.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Icon */}
      <div style={{
        width: '4rem', height: '4rem', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.25rem', boxShadow: '0 0 24px rgba(16,185,129,0.4)'
      }}>
        <ShieldCheck size={28} color="#fff" />
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Verify Your Email ✉️
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        We've sent a <strong style={{ color: 'var(--text-primary)' }}>6-digit OTP</strong> to<br />
        <strong style={{ color: '#10b981' }}>{email}</strong><br />
        <span style={{ fontSize: '0.8rem' }}>Enter it below to activate your account.</span>
      </p>

      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem', marginBottom: '1.25rem'
        }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{
          backgroundColor: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem', marginBottom: '1.25rem'
        }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleVerify}>
        {/* 6-digit OTP Boxes */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.75rem' }}
          onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              id={`otp-digit-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              style={{
                width: '3rem', height: '3.5rem', textAlign: 'center',
                fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Courier New', monospace",
                borderRadius: '12px', border: digit ? '2px solid #10b981' : '2px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)',
                outline: 'none', transition: 'border-color 0.15s',
                caretColor: '#10b981'
              }}
            />
          ))}
        </div>

        <button
          id="btn-verify-otp"
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem' }}
          disabled={loading || otpValue.length !== 6}
        >
          {loading ? <><RefreshCw size={16} className="animate-spin" /> Verifying...</> : <>Verify & Activate <ArrowRight size={18} /></>}
        </button>
      </form>

      <button
        id="btn-resend-otp"
        type="button"
        onClick={handleResend}
        disabled={resendLoading || resendCooldown > 0}
        style={{
          background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer',
          color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--accent-primary)',
          fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
        }}
      >
        {resendLoading ? (
          <><RefreshCw size={14} className="animate-spin" /> Sending...</>
        ) : resendCooldown > 0 ? (
          `Resend OTP in ${resendCooldown}s`
        ) : (
          <><RotateCcw size={14} /> Resend OTP</>
        )}
      </button>
    </div>
  );
};

// ── Main Register Page ─────────────────────────────────────────────────────────
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    age: '25',
    height: '178',
    weight: '75',
    fitnessGoal: 'muscle_gain'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const { register, loginWithFirebase, updateUser, login: ctxLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      username: formData.username.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      gender: formData.gender,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      fitnessGoal: formData.fitnessGoal
    });
    setLoading(false);

    if (result.success) {
      // Show OTP verification screen
      setShowOtpScreen(true);
    } else {
      setErrorMsg(result.message || 'Registration failed.');
    }
  };

  const handleOtpVerified = (userData) => {
    // Update auth context with verified user data and redirect
    if (userData?.token) {
      localStorage.setItem('fitpulse_token', userData.token);
      const { token, ...userInfo } = userData;
      localStorage.setItem('fitpulse_user', JSON.stringify(userInfo));
    }
    navigate('/dashboard', { replace: true });
  };

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const res = await firebaseAuthService.checkRedirectResult();
        if (res && res.success && res.idToken) {
          setGoogleLoading(true);
          const authRes = await loginWithFirebase(res.idToken);
          if (authRes.success) {
            navigate(authRes.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
          } else {
            setErrorMsg(authRes.message || 'Google registration authorization failed.');
          }
          setGoogleLoading(false);
        }
      } catch (err) {
        console.error('Redirect sign-in error:', err);
      }
    };
    processRedirect();
  }, []);

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setGoogleLoading(true);

    try {
      const socialRes = await firebaseAuthService.signInWithGoogle();

      if (!socialRes.success) {
        if (socialRes.redirecting) return;
        setErrorMsg(socialRes.error || 'Google sign-in was cancelled.');
        setGoogleLoading(false);
        return;
      }

      const authRes = await loginWithFirebase(socialRes.idToken);
      if (authRes.success) {
        navigate(authRes.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
      } else {
        setErrorMsg(authRes.message || 'Google registration authorization failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with authentication server.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: showOtpScreen ? '480px' : '640px', width: '100%' }}>
          <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>

            {showOtpScreen ? (
              <OtpVerifyScreen
                email={formData.email.trim().toLowerCase()}
                userName={formData.name}
                onVerified={handleOtpVerified}
              />
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                  <div
                    style={{
                      width: '3.25rem', height: '3.25rem', borderRadius: '16px',
                      background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                      color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <Dumbbell size={26} />
                  </div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Create Your FitPulse Account</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Join the platform and personalize your fitness tracking profile
                  </p>
                </div>

                {errorMsg && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem', marginBottom: '1.25rem'
                  }}>
                    {errorMsg}
                  </div>
                )}

                {/* Google Sign Up */}
                <button
                  type="button"
                  id="btn-google-register"
                  onClick={handleGoogleSignIn}
                  disabled={loading || googleLoading}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', marginBottom: '1.5rem' }}
                >
                  {googleLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>Sign Up with Google</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 0 1.5rem' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Or Register with Email
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <div className="form-input-wrapper">
                        <User size={18} className="form-input-icon" />
                        <input
                          type="text"
                          name="name"
                          id="reg-name"
                          className="form-input form-input-with-icon"
                          placeholder="Alex Johnson"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Username *</label>
                      <div className="form-input-wrapper">
                        <AtSign size={18} className="form-input-icon" />
                        <input
                          type="text"
                          name="username"
                          id="reg-username"
                          className="form-input form-input-with-icon"
                          placeholder="alexj"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <div className="form-input-wrapper">
                      <Mail size={18} className="form-input-icon" />
                      <input
                        type="email"
                        name="email"
                        id="reg-email"
                        className="form-input form-input-with-icon"
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <div className="form-input-wrapper">
                        <Lock size={18} className="form-input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          id="reg-password"
                          className="form-input form-input-with-icon"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password *</label>
                      <div className="form-input-wrapper">
                        <Lock size={18} className="form-input-icon" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          id="reg-confirm-password"
                          className="form-input form-input-with-icon"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Physical Profile Details */}
                  <div style={{ margin: '1.25rem 0 1rem', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Sparkles size={14} color="#10b981" /> Biometric Baseline
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Age</label>
                        <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} min="10" max="120" />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Height (cm)</label>
                        <input type="number" name="height" className="form-input" value={formData.height} onChange={handleChange} min="50" max="250" />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Weight (kg)</label>
                        <input type="number" name="weight" className="form-input" value={formData.weight} onChange={handleChange} step="0.1" min="20" max="300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3" style={{ marginTop: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Gender</label>
                        <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-Binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Primary Goal</label>
                        <select name="fitnessGoal" className="form-select" value={formData.fitnessGoal} onChange={handleChange}>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="endurance">Endurance</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="overall_health">Overall Health</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    id="btn-register-submit"
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                    disabled={loading || googleLoading}
                  >
                    {loading ? 'Registering Account...' : 'Complete Registration'} <ArrowRight size={18} />
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
