import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  Apple,
  LineChart,
  BarChart3,
  Target,
  FileText,
  Settings,
  HelpCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { label: 'Exercise Library', icon: BookOpen, path: '/exercises' },
    { label: 'Nutrition & Macros', icon: Apple, path: '/nutrition' },
    { label: 'Body Progress', icon: LineChart, path: '/progress' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Fitness Goals', icon: Target, path: '/goals' },
    { label: 'Reports & Export', icon: FileText, path: '/reports' },
    { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Support & Help', icon: HelpCircle, path: '/support' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: '70px',
          bottom: 0,
          left: 0,
          zIndex: 95,
          transition: 'transform var(--transition-normal)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
        className="sidebar-container"
      >
        {/* Navigation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 0.85rem' }}>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              padding: '0 0.75rem 0.5rem'
            }}
          >
            Core Modules
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`
                  }
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--accent-primary-glow)' : 'transparent',
                    border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Section */}
          {isAdmin && (
            <div style={{ marginTop: '1.5rem' }}>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#f43f5e',
                  padding: '0 0.75rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <ShieldAlert size={14} /> Administration
              </div>

              <NavLink
                to="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isActive ? '#f43f5e' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <ShieldAlert size={18} />
                <span>Admin Console</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* User Mini Widget at bottom of sidebar */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-card)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={12} color="#10b981" /> Goal: {user?.fitnessGoal?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
