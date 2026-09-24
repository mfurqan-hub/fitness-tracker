import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Dumbbell,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { firebaseAuthService } from '../../services/firebaseAuth';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, loginWithFirebase } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePostLoginRedirect = (userRole) => {
    const intendedDestination = location.state?.from?.pathname;
    if (intendedDestination && !intendedDestination.startsWith('/login') && !intendedDestination.startsWith('/register')) {
      navigate(intendedDestination, { replace: true });
    } else if (userRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email/username and password.');
      return;
    }

    setLoading(true);
    const result = await login({ email: email.trim(), password });
    setLoading(false);

    if (result.success) {
      handlePostLoginRedirect(result.user?.role);
    } else {
      setErrorMsg(result.message || 'Login failed. Please check credentials.');
    }
  };

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const res = await firebaseAuthService.checkRedirectResult();
        if (res && res.success && res.idToken) {
          setGoogleLoading(true);
          const authRes = await loginWithFirebase(res.idToken);
          if (authRes.success) {
            handlePostLoginRedirect(authRes.user?.role);
          } else {
            setErrorMsg(authRes.message || 'Google login authorization failed.');
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
        setErrorMsg(socialRes.error || 'Google sign-in cancelled or failed.');
        setGoogleLoading(false);
        return;
      }

      const authRes = await loginWithFirebase(socialRes.idToken);
      if (authRes.success) {
        handlePostLoginRedirect(authRes.user?.role);
      } else {
        setErrorMsg(authRes.message || 'Google login authorization failed.');
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
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{
                  width: '3.25rem',
                  height: '3.25rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
                }}
              >
                <Dumbbell size={26} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Welcome Back</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Sign in to your FitPulse account
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem'
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Google Sign In */}
            <button
              type="button"
              id="btn-google-login"
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
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 0 1.5rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Or with Email
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email or Username</label>
                <div className="form-input-wrapper">
                  <Mail size={18} className="form-input-icon" />
                  <input
                    id="login-email"
                    type="text"
                    className="form-input form-input-with-icon"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input form-input-with-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                id="btn-email-login"
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
                disabled={loading || googleLoading}
              >
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
