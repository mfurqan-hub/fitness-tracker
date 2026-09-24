import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Lock,
  UserPlus,
  RefreshCw,
  Server
} from 'lucide-react';
import { adminService } from '../../services/extraServices';
import { useToast } from '../../context/ToastContext';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

const AdminSettingsPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    allowUserRegistration: true,
    maintenanceMode: false,
    emailNotifications: true,
    maxDailyWorkouts: 10,
    rateLimitPerMinute: 100,
    systemNotice: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await adminService.getSettings();
        if (res.success && res.data) {
          setSettings({
            allowUserRegistration: res.data.allowUserRegistration !== false,
            maintenanceMode: Boolean(res.data.maintenanceMode),
            emailNotifications: res.data.emailNotifications !== false,
            maxDailyWorkouts: res.data.maxDailyWorkouts || 10,
            rateLimitPerMinute: res.data.rateLimitPerMinute || 100,
            systemNotice: res.data.systemNotice || ''
          });
        }
      } catch (err) {
        toast.error('Failed to load system settings from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await adminService.updateSettings(settings);
      if (res.success) {
        toast.success('System settings persisted successfully to MongoDB.');
      } else {
        toast.error(res.message || 'Failed to save settings.');
      }
    } catch (err) {
      toast.error('Server error updating system settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CardSkeleton count={3} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Platform Governance & System Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Configure server-side operational policies, user registration flags, and platform rules
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Core Access Controls */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Lock size={18} color="#f43f5e" /> Access & Registration Policies
            </h3>
            <span className="badge badge-rose">Server Enforced</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            {/* Allow Registration */}
            <div className="flex items-center justify-between" style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={16} color="#10b981" /> Open Public Registration
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  When disabled, new sign-ups are rejected by the backend API with a 403 status.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowUserRegistration}
                  onChange={(e) => setSettings({ ...settings, allowUserRegistration: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </label>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between" style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={16} color="#f59e0b" /> System Maintenance Flag
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Restricts non-administrative athlete traffic when performing upgrades.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
              </label>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between" style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={16} color="#06b6d4" /> Global Notification Dispatch
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Enable automatic background reminders and support notification broadcasts.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: '#06b6d4', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Operational Limits */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Sliders size={18} color="#06b6d4" /> Operational Thresholds & Rate Limiting
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4" style={{ marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">Max Daily Workouts Per Athlete</label>
              <input
                type="number"
                min="1"
                max="50"
                className="form-input"
                value={settings.maxDailyWorkouts}
                onChange={(e) => setSettings({ ...settings, maxDailyWorkouts: Number(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Prevents denial-of-service and extreme database bloat
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">API Rate Limit (Requests/Min)</label>
              <input
                type="number"
                min="10"
                max="1000"
                className="form-input"
                value={settings.rateLimitPerMinute}
                onChange={(e) => setSettings({ ...settings, rateLimitPerMinute: Number(e.target.value) })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Applied across authenticated athlete API routes
              </span>
            </div>
          </div>
        </div>

        {/* Global Broadcast Notice */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Server size={18} color="#a78bfa" /> Global Platform Notice Banner
            </h3>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">System Broadcast Message (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Scheduled server maintenance on Sunday at 02:00 UTC."
              value={settings.systemNotice}
              onChange={(e) => setSettings({ ...settings, systemNotice: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Broadcasted across the user dashboard header when non-empty.
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', backgroundColor: '#f43f5e', borderColor: '#f43f5e' }}
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Persisting to Database...' : 'Save System Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
