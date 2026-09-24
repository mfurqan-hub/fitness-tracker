import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  Menu,
  X,
  CheckCheck,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ThemeToggle from '../common/ThemeToggle';
import { formatDateTime } from '../../utils/formatters';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem'
      }}
    >
      {/* Left section: Logo & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-icon"
            title="Toggle Sidebar"
            style={{ display: 'flex' }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        <Link to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2">
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Dumbbell size={20} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              FITPULSE
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                display: 'block',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '-4px'
              }}
            >
              PRO MERN SUITE
            </span>
          </div>
        </Link>
      </div>

      {/* Right section: Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {isAuthenticated ? (
          <>
            {/* Notifications Center */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="btn btn-secondary btn-icon"
                style={{ position: 'relative' }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.5)'
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '360px',
                    maxWidth: '90vw',
                    padding: 0,
                    zIndex: 200,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="badge badge-emerald">{unreadCount} New</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '0.85rem' }}>No notifications right now.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          style={{
                            padding: '0.875rem 1.25rem',
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: notif.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.05)',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start',
                            transition: 'background var(--transition-fast)'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: notif.isRead ? 600 : 700,
                                color: notif.isRead ? 'var(--text-primary)' : '#10b981',
                                marginBottom: '0.2rem'
                              }}
                            >
                              {notif.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {notif.message}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                              {formatDateTime(notif.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notif.isRead && (
                              <button
                                onClick={() => markAsRead(notif._id)}
                                className="btn btn-ghost btn-icon"
                                style={{ width: '24px', height: '24px' }}
                                title="Mark read"
                              >
                                <CheckCheck size={14} color="#10b981" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif._id)}
                              className="btn btn-ghost btn-icon"
                              style={{ width: '24px', height: '24px' }}
                              title="Delete notification"
                            >
                              <Trash2 size={14} color="#94a3b8" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-full)' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-card-hover)',
                    border: '2px solid var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {showProfileMenu && (
                <div
                  className="card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '220px',
                    padding: '0.5rem',
                    zIndex: 200,
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                    <div style={{ marginTop: '0.3rem' }}>
                      <span className={`badge ${isAdmin ? 'badge-rose' : 'badge-emerald'}`}>
                        {user?.role?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#f43f5e' }}
                      >
                        <Shield size={16} /> Admin Overview
                      </Link>
                      <Link
                        to="/admin/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <Settings size={16} /> Platform Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <User size={16} /> Profile & Biometrics
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <Settings size={16} /> Preferences
                      </Link>
                    </>
                  )}

                  <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.4rem 0' }} />

                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#ef4444' }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-outline btn-sm">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
