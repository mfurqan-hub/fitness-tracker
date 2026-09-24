import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Github, Heart, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1.5rem 2rem',
        marginTop: 'auto'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '2.5rem' }}>
          {/* Col 1 */}
          <div style={{ gridColumn: 'span 1' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2.25rem',
                  height: '2.25rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Dumbbell size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                FITPULSE
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Production-style MERN fitness intelligence platform with realtime biometric tracking, workout logging, and macro analytics.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Core Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/workouts" className="hover:text-emerald-400">Workout Builder</Link></li>
              <li><Link to="/exercises" className="hover:text-emerald-400">Exercise Catalogue</Link></li>
              <li><Link to="/nutrition" className="hover:text-emerald-400">Macro Calculator</Link></li>
              <li><Link to="/analytics" className="hover:text-emerald-400">SaaS Analytics</Link></li>
              <li><Link to="/goals" className="hover:text-emerald-400">Goal Milestones</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Platform & Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/about" className="hover:text-emerald-400">About FitPulse</Link></li>
              <li><Link to="/features" className="hover:text-emerald-400">Feature Specifications</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400">Contact Team</Link></li>
              <li><Link to="/support" className="hover:text-emerald-400">Support Desk</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Academic eProject
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Designed & developed with MongoDB, Express.js, React.js, and Node.js with complete JWT auth and REST architecture.
            </p>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald"><Zap size={12} /> REST API v1.0</span>
              <span className="badge badge-cyan"><ShieldCheck size={12} /> JWT Secured</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            © {new Date().getFullYear()} FitPulse Fitness Tracker. Academic eProject. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart size={14} color="#f43f5e" /> using the MERN Stack.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
