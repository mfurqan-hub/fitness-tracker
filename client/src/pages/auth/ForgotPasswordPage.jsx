import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to process password reset request.');
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
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 20px rgba(244, 63, 94, 0.35)'
                }}
              >
                <KeyRound size={24} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Reset Password</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Enter your registered email to receive recovery instructions
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

            {submitted ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <CheckCircle2 size={48} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instructions Sent</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                  If an account exists with <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
                </p>
                <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="form-input-wrapper">
                    <Mail size={18} className="form-input-icon" />
                    <input
                      type="email"
                      className="form-input form-input-with-icon"
                      placeholder="athlete@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', backgroundColor: '#f43f5e', borderColor: '#f43f5e' }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Send Reset Link'} <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
                  <Link to="/login" style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
