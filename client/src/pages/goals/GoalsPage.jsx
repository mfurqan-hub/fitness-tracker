import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  Trophy,
  CheckCircle,
  Calendar,
  Trash2,
  Edit,
  Clock,
  Flame,
  Dumbbell
} from 'lucide-react';
import { goalService } from '../../services/extraServices';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const GoalsPage = () => {
  const toast = useToast();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Goal Form State
  const initialForm = {
    title: '',
    type: 'weight_loss',
    startingValue: 78,
    currentValue: 76,
    targetValue: 73,
    unit: 'kg',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalService.getGoals({ status: statusFilter });
      if (res.success) {
        setGoals(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load fitness goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setIsEditMode(true);
    setSelectedGoal(goal);
    setFormData({
      title: goal.title,
      type: goal.type,
      startingValue: goal.startingValue,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      unit: goal.unit,
      startDate: new Date(goal.startDate).toISOString().split('T')[0],
      targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
      status: goal.status
    });
    setIsModalOpen(true);
  };

  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Goal title is required.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        startingValue: Number(formData.startingValue),
        currentValue: Number(formData.currentValue),
        targetValue: Number(formData.targetValue)
      };

      if (isEditMode) {
        const res = await goalService.updateGoal(selectedGoal._id, payload);
        if (res.success) {
          toast.success('Goal updated successfully!');
          if (res.data?.status === 'completed') {
            triggerConfetti();
          }
        }
      } else {
        const res = await goalService.createGoal(payload);
        if (res.success) {
          toast.success('Goal created! Let\'s crush it! 💪');
          if (res.data?.status === 'completed') {
            triggerConfetti();
          }
        }
      }

      setIsModalOpen(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.message || 'Failed to save goal.');
    } finally {
      setActionLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await goalService.deleteGoal(deletingId);
      toast.success('Goal removed.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchGoals();
    } catch (err) {
      toast.error('Failed to delete goal.');
    } finally {
      setActionLoading(false);
    }
  };

  const statuses = ['All', 'active', 'completed', 'failed'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Target Goals & Milestones</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Set quantifiable targets for body weight, strength lifts, and workout consistency
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} /> Create New Goal
        </button>
      </div>

      {/* Filter Status Pills */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>
            Status:
          </span>
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : goals.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <Trophy size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Goals Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Set your first fitness milestone and track your progress in real time!
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} /> Create Milestone
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {goals.map((g) => {
            const isCompleted = g.status === 'completed';
            const isFailed = g.status === 'failed';

            return (
              <div
                key={g._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: isCompleted ? 'rgba(16, 185, 129, 0.4)' : undefined,
                  backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.03)' : undefined
                }}
              >
                <div className="flex items-start justify-between gap-2" style={{ marginBottom: '0.75rem' }}>
                  <span
                    className={`badge ${
                      isCompleted ? 'badge-emerald' : isFailed ? 'badge-rose' : 'badge-cyan'
                    }`}
                  >
                    {g.status?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Target: {formatDate(g.targetDate)}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>{g.title}</h3>

                {/* Progress Metric details */}
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', margin: '0.75rem 0' }}>
                  <div className="flex items-center justify-between" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Current: <strong>{g.currentValue} {g.unit}</strong></span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>Target: {g.targetValue} {g.unit}</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${g.progressPercent || 0}%`,
                        backgroundColor: isCompleted ? '#10b981' : '#06b6d4',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    {g.progressPercent || 0}% Complete
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Started {formatDate(g.startDate)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="btn btn-secondary btn-icon btn-sm"
                      title="Update Progress"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(g._id);
                        setIsDeleteOpen(true);
                      }}
                      className="btn btn-ghost btn-icon btn-sm"
                      style={{ color: '#ef4444' }}
                      title="Delete Goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal (Create / Update) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Update Goal & Progress' : 'Create Fitness Goal'}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmitGoal}>
          <div className="form-group">
            <label className="form-label">Goal Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Reach 72kg Body Weight or Bench 100kg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Goal Category</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain / Muscle</option>
                <option value="strength">Strength Lift (1RM)</option>
                <option value="workout_frequency">Workout Frequency</option>
                <option value="distance">Running Distance</option>
                <option value="calories">Daily Calorie Target</option>
                <option value="custom">Custom Milestone</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Measurement Unit</label>
              <input
                type="text"
                className="form-input"
                placeholder="kg, lbs, workouts, km"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Starting Value</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.startingValue}
                onChange={(e) => setFormData({ ...formData, startingValue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Value</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Value</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Deadline *</label>
              <input
                type="date"
                className="form-input"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
          </div>

          {isEditMode && (
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed / Expired</option>
              </select>
            </div>
          )}

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : isEditMode ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Goal"
        message="Are you sure you want to delete this fitness milestone?"
        loading={actionLoading}
      />
    </div>
  );
};

export default GoalsPage;
