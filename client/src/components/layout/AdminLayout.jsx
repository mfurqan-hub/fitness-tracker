import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldAlert, Terminal, Lock } from 'lucide-react';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Admin Security Banner */}
      <div
        style={{
          borderBottom: '1px solid rgba(244, 63, 94, 0.25)',
          backgroundColor: 'rgba(244, 63, 94, 0.08)',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge badge-rose" style={{ padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldAlert size={14} /> Elevated System Console
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Superadministrator Mode & Platform Governance Active
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={13} color="#10b981" /> RBAC Enforced
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Terminal size={13} color="#f43f5e" /> Audit Stream Active
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          style={{
            flex: 1,
            padding: '1.75rem',
            marginLeft: isSidebarOpen && window.innerWidth >= 1024 ? '260px' : 0,
            transition: 'margin-left var(--transition-normal)',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
