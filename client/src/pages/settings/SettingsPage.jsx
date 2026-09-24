import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Palette,
  Bell,
  Scale,
  Lock,
  Save,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';
import { reminderService } from '../../services/extraServices';
import { useToast } from '../../context/ToastContext';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    gender: user?.gender || 'male',
    age: user?.age || 25,
    height: user?.height || 178,
    weight: user?.weight || 75,
    bio: user?.bio || '',
    fitnessGoal: user?.fitnessGoal || 'muscle_gain',
    targetCalories: user?.targetCalories || 2200,
    targetProtein: user?.targetProtein || 160,
    targetCarbs: user?.targetCarbs || 220,
    targetFat: user?.targetFat || 65,
    targetWater: user?.targetWater || 2500,
    avatar: user?.avatar || ''
  });

  // Password Change State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    units: {
      weight: user?.preferences?.units?.weight || 'kg',
      height: user?.preferences?.units?.height || 'cm',
      distance: user?.preferences?.units?.distance || 'km'
    },
    notifications: {
      workoutReminders: user?.preferences?.notifications?.workoutReminders ?? true,
      mealReminders: user?.preferences?.notifications?.mealReminders ?? true,
      goalCelebrations: user?.preferences?.notifications?.goalCelebrations ?? true
    }
  });

  // Reminders list
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', type: 'workout', time: '07:30' });

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await reminderService.getReminders();
        if (res.success) setReminders(res.data || []);
      } catch (e) {}
    };
    fetchReminders();
  }, []);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authService.updateProfile(profileData);
      if (res.success) {
        toast.success('Profile and macro targets saved! ✅');
        updateUser(res.data);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Preferences Save (Theme, Units, Notifications)
  const handleSavePreferences = async (newTheme = theme) => {
    try {
      setLoading(true);
      const payload = {
        theme: newTheme,
        units: preferences.units,
        notifications: preferences.notifications
      };
      const res = await authService.updatePreferences(payload);
      if (res.success) {
        toast.success('Preferences saved to MongoDB!');
        updateUser({ preferences: res.data });
      }
    } catch (err) {
      toast.error('Failed to update preferences.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      const res = await authService.updatePassword(passwords);
      if (res.success) {
        toast.success('Password updated successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const res = await authService.uploadAvatar(formData);
      if (res.success) {
        toast.success('Avatar uploaded!');
        setProfileData((prev) => ({ ...prev, avatar: res.data.avatar }));
        updateUser({ avatar: res.data.avatar });
      }
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  // Create Reminder
  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!newReminder.title.trim()) return;
    try {
      const res = await reminderService.createReminder(newReminder);
      if (res.success) {
        toast.success('Reminder added!');
        setReminders([...reminders, res.data]);
        setNewReminder({ title: '', type: 'workout', time: '07:30' });
      }
    } catch (err) {
      toast.error('Failed to create reminder.');
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await reminderService.deleteReminder(id);
      toast.success('Reminder removed.');
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (err) {
      toast.error('Failed to delete reminder.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Biometrics', icon: User },
    { id: 'targets', label: 'Daily Macro Targets', icon: Sparkles },
    { id: 'appearance', label: 'Appearance & Units', icon: Palette },
    { id: 'reminders', label: 'Scheduled Reminders', icon: Bell },
    { id: 'security', label: 'Security & Password', icon: Lock }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Personalize profile metrics, nutritional targets, UI theme, and security preferences
        </p>
      </div>

      {/* Tabs Nav */}
      <div className="tabs-nav">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile & Biometrics */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSaveProfile}>
            {/* Avatar Section */}
            <div className="flex items-center gap-4" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  overflow: 'hidden'
                }}
              >
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profileData.name.charAt(0) || 'U'
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Profile Picture</h4>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={14} /> Upload New Photo
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.username}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.age}
                  onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.height}
                  onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={profileData.gender}
                  onChange={(e) => setFormData({ ...profileData, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Fitness Goal</label>
                <select
                  className="form-select"
                  value={profileData.fitnessGoal}
                  onChange={(e) => setProfileData({ ...profileData, fitnessGoal: e.target.value })}
                >
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="endurance">Endurance</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="overall_health">Overall Health</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Notes</label>
              <textarea
                className="form-textarea"
                placeholder="A few words about your fitness journey..."
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Macro Targets */}
      {activeTab === 'targets' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Daily Target Nutrition & Hydration</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            These values calculate your percentage dials on the Dashboard and Nutrition Tracker.
          </p>

          <form onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Daily Calories (kcal)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.targetCalories}
                  onChange={(e) => setProfileData({ ...profileData, targetCalories: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Water Target (ml)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.targetWater}
                  onChange={(e) => setProfileData({ ...profileData, targetWater: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label className="form-label">Target Protein (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.targetProtein}
                  onChange={(e) => setProfileData({ ...profileData, targetProtein: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Carbs (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.targetCarbs}
                  onChange={(e) => setProfileData({ ...profileData, targetCarbs: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Fat (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={profileData.targetFat}
                  onChange={(e) => setProfileData({ ...profileData, targetFat: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> Update Nutritional Targets
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Appearance & Units */}
      {activeTab === 'appearance' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Visual Theme & Metric Units</h3>

          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label">Theme Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {['dark', 'light', 'system'].map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => {
                    setTheme(th);
                    handleSavePreferences(th);
                  }}
                  className={`btn ${theme === th ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {th} Mode
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Weight Unit</label>
              <select
                className="form-select"
                value={preferences.units.weight}
                onChange={(e) => setPreferences({
                  ...preferences,
                  units: { ...preferences.units, weight: e.target.value }
                })}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Height Unit</label>
              <select
                className="form-select"
                value={preferences.units.height}
                onChange={(e) => setPreferences({
                  ...preferences,
                  units: { ...preferences.units, height: e.target.value }
                })}
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet & Inches (ft)</option>
              </select>
            </div>
          </div>

          <button onClick={() => handleSavePreferences()} className="btn btn-primary" disabled={loading}>
            <Save size={16} /> Save Preference Settings
          </button>
        </div>
      )}

      {/* Tab 4: Scheduled Reminders */}
      {activeTab === 'reminders' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Scheduled Daily Alerts</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Manage timed notifications for workouts, post-workout meals, and hydration.
          </p>

          {/* Add Reminder Form */}
          <form onSubmit={handleCreateReminder} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Evening Cardio Session"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Type</label>
              <select
                className="form-select"
                value={newReminder.type}
                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
              >
                <option value="workout">Workout</option>
                <option value="meal">Meal Log</option>
                <option value="water">Water</option>
                <option value="goal">Goal Check</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Time</label>
              <input
                type="time"
                className="form-input"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> Add
            </button>
          </form>

          {/* Reminders List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {reminders.map((r) => (
              <div
                key={r._id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: {r.type}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="badge badge-rose">{r.time}</span>
                  <button onClick={() => handleDeleteReminder(r._id)} className="btn btn-ghost btn-icon btn-sm" style={{ color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Change Account Password</h3>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (Min 6 characters)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={passwords.confirmNewPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
