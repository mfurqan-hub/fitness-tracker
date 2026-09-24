import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem' }}>
          <div
            style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <AlertCircle size={36} />
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#ef4444' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            The fitness track or resource you are looking for has been moved, renamed, or does not exist.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/dashboard" className="btn btn-primary">
              <Home size={16} /> Return to Dashboard
            </Link>
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={16} /> Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
