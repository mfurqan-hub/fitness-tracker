import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Missing password reset token in URL.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.message || 'Failed to reset password.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
                <ShieldCheck size={26} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>New Password</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Create a strong password for your account
              </p>
            </div>

            {!token ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f43f5e', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <AlertCircle size={44} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Invalid Reset Link</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  The password reset link is missing a valid token.
                </p>
                <Link to="/forgot-password" className="btn btn-primary" style={{ width: '100%' }}>
                  Request New Reset Link
                </Link>
              </div>
            ) : success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <CheckCircle2 size={48} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Password Updated!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                  Your password has been successfully updated with bcrypt encryption. You can now sign in.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                  Sign In Now <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div className="form-input-wrapper">
                    <Lock size={18} className="form-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input form-input-with-icon"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div className="form-input-wrapper">
                    <Lock size={18} className="form-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input form-input-with-icon"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Update Password'} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
