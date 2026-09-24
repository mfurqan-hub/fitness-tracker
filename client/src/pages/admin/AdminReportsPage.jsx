import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Users,
  Dumbbell,
  Apple,
  LifeBuoy,
  FileSpreadsheet,
  FileCode,
  ShieldAlert,
  Calendar,
  Layers,
  Database
} from 'lucide-react';
import { adminService } from '../../services/extraServices';
import StatCard from '../../components/common/StatCard';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';

const AdminReportsPage = () => {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await adminService.getOverview();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load system reports and analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const exportJSON = () => {
    try {
      const exportBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(exportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fitpulse-system-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      toast.success('System analytics exported as JSON.');
    } catch (err) {
      toast.error('Failed to export report.');
    }
  };

  const exportCSV = () => {
    try {
      const stats = data?.stats || {};
      const rows = [
        ['Metric', 'Value'],
        ['Total Registered Users', stats.totalUsers || 0],
        ['Active Users', stats.activeUsers || 0],
        ['Total Workouts Logged', stats.totalWorkouts || 0],
        ['Total Nutrition Logs', stats.totalNutritionLogs || 0],
        ['Total Exercises in Library', stats.totalExercises || 0],
        ['Open Support Tickets', stats.openTickets || 0],
        ['Generated At', new Date().toISOString()]
      ];
      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `fitpulse-platform-summary-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('System summary exported as CSV.');
    } catch (err) {
      toast.error('Failed to export CSV report.');
    }
  };

  if (loading) {
    return <CardSkeleton count={4} />;
  }

  const stats = data?.stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            System Analytics & Platform Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Aggregated platform performance, database telemetry, and administrative export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="btn btn-secondary">
            <FileSpreadsheet size={16} color="#10b981" /> Export CSV Summary
          </button>
          <button onClick={exportJSON} className="btn btn-secondary">
            <FileCode size={16} color="#06b6d4" /> Export Raw JSON
          </button>
        </div>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="User Ecosystem"
          value={stats.totalUsers || 0}
          unit="total accounts"
          icon={Users}
          color="emerald"
          subtext={`${stats.activeUsers || 0} Active accounts`}
        />
        <StatCard
          title="Workouts Executed"
          value={stats.totalWorkouts || 0}
          unit="total sessions"
          icon={Dumbbell}
          color="cyan"
          subtext="Platform aggregate"
        />
        <StatCard
          title="Nutrition Entries"
          value={stats.totalNutritionLogs || 0}
          unit="meal logs"
          icon={Apple}
          color="amber"
          subtext="Dietary records"
        />
        <StatCard
          title="Exercise Catalog"
          value={stats.totalExercises || 0}
          unit="movements"
          icon={Database}
          color="rose"
          subtext="Standard & Custom"
        />
      </div>

      {/* Platform Breakdown Tables */}
      <div className="grid grid-cols-2 gap-6">
        {/* Platform Integrity & Server Health */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Database size={18} color="#06b6d4" /> Server & Engine Telemetry
            </h3>
            <span className="badge badge-emerald">Operational</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div className="flex items-center justify-between" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Database Engine</span>
              <strong>MongoDB Mongoose Driver</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Security Protocol</span>
              <strong>JWT Bearer + bcrypt (10 Salt Rounds)</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>RBAC Model</span>
              <strong style={{ color: '#f43f5e' }}>Admin vs Athlete Segmentation</strong>
            </div>
            <div className="flex items-center justify-between" style={{ padding: '0.75rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Support Backlog</span>
              <strong>{stats.openTickets || 0} Tickets Requiring Action</strong>
            </div>
          </div>
        </div>

        {/* Database Collection Statistics */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Layers size={18} color="#a78bfa" /> Platform Collections Overview
            </h3>
            <span className="badge badge-cyan">Indexed Collections</span>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Documents</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>users</code></td>
                  <td><strong>{stats.totalUsers || 0}</strong></td>
                  <td><span className="badge badge-emerald">Healthy</span></td>
                </tr>
                <tr>
                  <td><code>workouts</code></td>
                  <td><strong>{stats.totalWorkouts || 0}</strong></td>
                  <td><span className="badge badge-emerald">Healthy</span></td>
                </tr>
                <tr>
                  <td><code>nutritions</code></td>
                  <td><strong>{stats.totalNutritionLogs || 0}</strong></td>
                  <td><span className="badge badge-emerald">Healthy</span></td>
                </tr>
                <tr>
                  <td><code>exercises</code></td>
                  <td><strong>{stats.totalExercises || 0}</strong></td>
                  <td><span className="badge badge-emerald">Healthy</span></td>
                </tr>
                <tr>
                  <td><code>supporttickets</code></td>
                  <td><strong>{stats.openTickets || 0}</strong></td>
                  <td><span className="badge badge-amber">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
