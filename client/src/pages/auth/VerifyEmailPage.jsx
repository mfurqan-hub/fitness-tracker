import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setLoading(false);
        setErrorMsg('No verification token provided. Please use the link sent to your email.');
        return;
      }

      try {
        setLoading(true);
        const res = await authService.verifyEmail(token);
        if (res.success) {
          setVerified(true);
        } else {
          setErrorMsg(res.message || 'Verification token is invalid or expired.');
        }
      } catch (err) {
        setErrorMsg(err.message || 'Verification link has expired or is invalid.');
      } finally {
        setLoading(false);
      }
    };

    performVerification();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    try {
      setResending(true);
      await authService.resendVerification(resendEmail.trim());
      setResendSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <div className="card" style={{ padding: '2.5rem 2rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
            
            {loading ? (
              <div>
                <div style={{ width: '48px', height: '48px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'skeletonLoading 1s infinite' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>Verifying Your Email</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Authenticating your cryptographic token with FitPulse security...
                </p>
              </div>
            ) : verified ? (
              <div>
                <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={56} />
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.5rem' }}>Account Verified! 🎉</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                  Your email address has been verified. Your athlete profile is now active with full tracking privileges.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Sign In to Dashboard <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <div>
                <div style={{ color: '#f43f5e', display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <AlertCircle size={52} />
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem' }}>Verification Link Expired</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  {errorMsg || 'The verification link may have expired or was already used.'}
                </p>

                {resendSuccess ? (
                  <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={20} style={{ margin: '0 auto 0.35rem' }} />
                    If an unverified account with <strong>{resendEmail}</strong> exists, a new link has been dispatched.
                  </div>
                ) : (
                  <form onSubmit={handleResend} style={{ marginTop: '1rem', textAlign: 'left' }}>
                    <div className="form-group">
                      <label className="form-label">Resend Verification Email</label>
                      <div className="form-input-wrapper">
                        <Mail size={18} className="form-input-icon" />
                        <input
                          type="email"
                          className="form-input form-input-with-icon"
                          placeholder="your.email@example.com"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={resending}
                      className="btn btn-secondary"
                      style={{ width: '100%', marginBottom: '1rem' }}
                    >
                      {resending ? <RefreshCw size={16} className="animate-spin" /> : <Mail size={16} />}
                      {resending ? 'Sending...' : 'Request New Link'}
                    </button>
                  </form>
                )}

                <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-muted)' }}>
                  Back to Sign In
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyEmailPage;
