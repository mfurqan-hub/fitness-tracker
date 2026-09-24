import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Users,
  Dumbbell,
  LifeBuoy,
  BarChart3,
  ScrollText,
  Sliders,
  ShieldAlert,
  ShieldCheck,
  Server
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const adminNavItems = [
    { label: 'Admin Overview', icon: Activity, path: '/admin/dashboard' },
    { label: 'User Directory', icon: Users, path: '/admin/users' },
    { label: 'Exercise Manager', icon: Dumbbell, path: '/admin/exercises' },
    { label: 'Support Tickets', icon: LifeBuoy, path: '/admin/tickets' },
    { label: 'System Analytics & Reports', icon: BarChart3, path: '/admin/reports' },
    { label: 'System Audit Logs', icon: ScrollText, path: '/admin/logs' },
    { label: 'Platform Settings', icon: Sliders, path: '/admin/settings' }
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
          borderRight: '1px solid rgba(244, 63, 94, 0.25)',
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
              color: '#f43f5e',
              padding: '0 0.75rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <ShieldAlert size={13} /> Administration Suite
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
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
                    backgroundColor: isActive ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)'
                  })}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin System Status at bottom of sidebar */}
        <div
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(244, 63, 94, 0.2)',
            backgroundColor: 'rgba(244, 63, 94, 0.03)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(244, 63, 94, 0.4)'
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                <Server size={12} /> Superadmin Access
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
