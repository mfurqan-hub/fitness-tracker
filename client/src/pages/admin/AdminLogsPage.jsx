import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Filter,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import { adminService } from '../../services/extraServices';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const AdminLogsPage = () => {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSystemLogs({ severity, limit: 100 });
      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load system audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [severity]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>System Security & Audit Logs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time audit trail of logins, administrative overrides, and system events
          </p>
        </div>

        <button onClick={fetchLogs} className="btn btn-secondary">
          <RefreshCw size={16} /> Refresh Stream
        </button>
      </div>

      {/* Filter Severity */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>
            Severity Level:
          </span>
          {[
            { label: 'All Severities', val: '' },
            { label: 'Info Only', val: 'info' },
            { label: 'Warnings', val: 'warning' },
            { label: 'Errors', val: 'error' }
          ].map((s) => (
            <button
              key={s.val}
              type="button"
              onClick={() => setSeverity(s.val)}
              className={`btn btn-sm ${severity === s.val ? 'btn-primary' : 'btn-secondary'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No audit logs match current filters.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Actor / Email</th>
                  <th>IP Address</th>
                  <th>Severity</th>
                  <th>Event Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDateTime(log.createdAt)}</td>
                    <td><code>{log.action}</code></td>
                    <td>{log.userEmail || 'Internal Daemon'}</td>
                    <td><small style={{ color: 'var(--text-muted)' }}>{log.ipAddress || '127.0.0.1'}</small></td>
                    <td>
                      <span className={`badge ${log.severity === 'error' ? 'badge-rose' : log.severity === 'warning' ? 'badge-amber' : 'badge-emerald'}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogsPage;
