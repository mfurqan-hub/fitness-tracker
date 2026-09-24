import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  Apple,
  LifeBuoy,
  ShieldCheck,
  Activity,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  ScrollText
} from 'lucide-react';
import { adminService } from '../../services/extraServices';
import StatCard from '../../components/common/StatCard';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const AdminDashboardPage = () => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        setLoading(true);
        const res = await adminService.getOverview();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load admin overview.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  if (loading) {
    return <CardSkeleton count={4} />;
  }

  const stats = data?.stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Admin KPI Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          unit="accounts"
          icon={Users}
          color="emerald"
          subtext={`${stats.activeUsers || 0} Active`}
        />

        <StatCard
          title="Total Workouts Logged"
          value={stats.totalWorkouts || 0}
          unit="sessions"
          icon={Dumbbell}
          color="cyan"
          subtext="Across all athletes"
        />

        <StatCard
          title="Nutrition Records"
          value={stats.totalNutritionLogs || 0}
          unit="meal logs"
          icon={Apple}
          color="amber"
          subtext="MongoDB collections"
        />

        <StatCard
          title="Pending Tickets"
          value={stats.openTickets || 0}
          unit="inquiries"
          icon={LifeBuoy}
          color="rose"
          subtext="Support triage"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Users Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Users size={18} color="#10b981" /> Recently Registered Athletes
            </h3>
            <Link to="/admin/users" className="btn btn-ghost btn-sm">
              Manage Users <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentUsers?.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-rose' : 'badge-emerald'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-cyan' : 'badge-gray'}`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Support Tickets */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <LifeBuoy size={18} color="#f43f5e" /> Recent Support Dispatch
            </h3>
            <Link to="/admin/tickets" className="btn btn-ghost btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data?.recentTickets?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                No support tickets currently.
              </div>
            ) : (
              data?.recentTickets?.map((t) => (
                <div
                  key={t._id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
                      <span className="badge badge-amber">{t.status}</span>
                      <strong style={{ fontSize: '0.9rem' }}>{t.subject}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      From: {t.user?.name || 'User'} ({t.user?.email || 'N/A'})
                    </div>
                  </div>

                  <Link to="/admin/tickets" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                    Reply
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Audit Activity Logs */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <ScrollText size={18} color="#a78bfa" /> Live System Audit Logs
          </h3>
          <Link to="/admin/logs" className="btn btn-ghost btn-sm">
            All Logs <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User / Trigger</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentLogs?.map((log) => (
                <tr key={log._id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDateTime(log.createdAt)}</td>
                  <td><code>{log.action}</code></td>
                  <td>{log.userEmail || 'System'}</td>
                  <td>
                    <span className={`badge ${log.severity === 'error' ? 'badge-rose' : log.severity === 'warning' ? 'badge-amber' : 'badge-emerald'}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
