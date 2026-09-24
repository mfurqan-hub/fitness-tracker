import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  Activity,
  Calendar,
  Trash2,
  CheckCircle,
  Layers,
  Sparkles,
  Scale
} from 'lucide-react';
import { progressService } from '../../services/extraServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LineChartWidget } from '../../components/charts/FitnessCharts';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate, formatWeight } from '../../utils/formatters';
import { calculateBMI } from '../../utils/calculations';
import { useToast } from '../../context/ToastContext';

const ProgressPage = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // New Progress Checkpoint Form
  const initialForm = {
    date: new Date().toISOString().split('T')[0],
    weight: user?.weight || 75,
    bodyFat: 15.0,
    muscleMass: 38.5,
    measurements: {
      chest: 104,
      waist: 82,
      hips: 96,
      arms: 37,
      thighs: 59,
      calves: 38
    },
    performanceMetrics: {
      restingHeartRate: 60,
      benchPressMax: 90,
      squatMax: 110,
      deadliftMax: 140
    },
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await progressService.getProgressHistory({ timeRange });
      if (res.success) {
        setRecords(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load progress records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [timeRange]);

  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    if (!formData.weight || Number(formData.weight) <= 0) {
      toast.error('Valid body weight is required.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        date: formData.date,
        weight: Number(formData.weight),
        bodyFat: formData.bodyFat ? Number(formData.bodyFat) : null,
        muscleMass: formData.muscleMass ? Number(formData.muscleMass) : null,
        measurements: {
          chest: Number(formData.measurements.chest || 0),
          waist: Number(formData.measurements.waist || 0),
          hips: Number(formData.measurements.hips || 0),
          arms: Number(formData.measurements.arms || 0),
          thighs: Number(formData.measurements.thighs || 0),
          calves: Number(formData.measurements.calves || 0)
        },
        performanceMetrics: {
          restingHeartRate: Number(formData.performanceMetrics.restingHeartRate || 0),
          benchPressMax: Number(formData.performanceMetrics.benchPressMax || 0),
          squatMax: Number(formData.performanceMetrics.squatMax || 0),
          deadliftMax: Number(formData.performanceMetrics.deadliftMax || 0)
        },
        notes: formData.notes
      };

      const res = await progressService.addProgress(payload);
      if (res.success) {
        toast.success('Progress checkpoint recorded! 📈');
        updateUser({ weight: payload.weight });
        setIsModalOpen(false);
        fetchProgress();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save checkpoint.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProgress = async () => {
    try {
      setActionLoading(true);
      await progressService.deleteProgress(deletingId);
      toast.success('Checkpoint deleted.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchProgress();
    } catch (err) {
      toast.error('Failed to delete checkpoint.');
    } finally {
      setActionLoading(false);
    }
  };

  // BMI Calculation
  const currentWeight = records.length > 0 ? records[records.length - 1].weight : user?.weight || 75;
  const bmiInfo = calculateBMI(currentWeight, user?.height || 178);

  // Chart datasets
  const chartLabels = records.map((r) => formatDate(r.date));
  const weightPoints = records.map((r) => r.weight);
  const bodyFatPoints = records.map((r) => r.bodyFat || 0);

  const weightTrendData = {
    labels: chartLabels.length > 0 ? chartLabels : ['Start', 'Current'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightPoints.length > 0 ? weightPoints : [currentWeight, currentWeight],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.3
      }
    ]
  };

  const timeRanges = [
    { label: '1 Week', val: '1w' },
    { label: '1 Month', val: '1m' },
    { label: '3 Months', val: '3m' },
    { label: '1 Year', val: '1y' },
    { label: 'All History', val: 'all' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Body Composition & Progress</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track weight, body fat %, muscle mass, and bodily circumference measurements
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Record Checkpoint
        </button>
      </div>

      {/* Top Biometric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Scale size={24} />
          </div>
          <div>
            <div className="stat-label">Current Weight</div>
            <div className="stat-value">{currentWeight} <span style={{ fontSize: '0.85rem' }}>kg</span></div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-label">Body Mass Index (BMI)</div>
            <div className="stat-value">{bmiInfo.bmi} <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{bmiInfo.category}</span></div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-label">Body Fat %</div>
            <div className="stat-value">
              {records.length > 0 && records[records.length - 1].bodyFat ? `${records[records.length - 1].bodyFat}%` : '15.0%'}
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-label">Total Checkpoints</div>
            <div className="stat-value">{records.length} <span style={{ fontSize: '0.85rem' }}>logs</span></div>
          </div>
        </div>
      </div>

      {/* Interactive Chart with Time-Range Filter */}
      <div className="card">
        <div className="card-header flex items-center justify-between flex-wrap gap-3">
          <div className="card-title">
            <TrendingUp size={18} color="#10b981" /> Weight History Timeline
          </div>

          <div className="flex items-center gap-1">
            {timeRanges.map((tr) => (
              <button
                key={tr.val}
                type="button"
                onClick={() => setTimeRange(tr.val)}
                className={`btn btn-sm ${timeRange === tr.val ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>

        <LineChartWidget data={weightTrendData} height={280} yAxisLabel="Weight (kg)" />
      </div>

      {/* Historical Checkpoints Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Detailed Measurement History</h3>
        </div>

        {loading ? (
          <CardSkeleton count={2} />
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No checkpoints recorded yet.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Body Fat</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Arms</th>
                  <th>Thighs</th>
                  <th>Bench 1RM</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.slice().reverse().map((rec) => (
                  <tr key={rec._id}>
                    <td style={{ fontWeight: 600 }}>{formatDate(rec.date)}</td>
                    <td><strong style={{ color: '#10b981' }}>{rec.weight} kg</strong></td>
                    <td>{rec.bodyFat ? `${rec.bodyFat}%` : '--'}</td>
                    <td>{rec.measurements?.chest ? `${rec.measurements.chest} cm` : '--'}</td>
                    <td>{rec.measurements?.waist ? `${rec.measurements.waist} cm` : '--'}</td>
                    <td>{rec.measurements?.arms ? `${rec.measurements.arms} cm` : '--'}</td>
                    <td>{rec.measurements?.thighs ? `${rec.measurements.thighs} cm` : '--'}</td>
                    <td>{rec.performanceMetrics?.benchPressMax ? `${rec.performanceMetrics.benchPressMax} kg` : '--'}</td>
                    <td>
                      <button
                        onClick={() => {
                          setDeletingId(rec._id);
                          setIsDeleteOpen(true);
                        }}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ color: '#ef4444' }}
                        title="Delete checkpoint"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Checkpoint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Body Checkpoint"
        maxWidth="700px"
      >
        <form onSubmit={handleSubmitProgress}>
          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Body Fat %</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.bodyFat}
                onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
              />
            </div>
          </div>

          {/* Tape Measurements */}
          <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Circumferences (cm)
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Chest</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.measurements.chest}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, chest: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Waist</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.measurements.waist}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, waist: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Arms</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.measurements.arms}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, arms: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Thighs</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.measurements.thighs}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, thighs: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Hips</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.measurements.hips}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, hips: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Calves</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={formData.measurements.calves}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, calves: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Observations</label>
            <textarea
              className="form-textarea"
              placeholder="Felt leaner this morning, vascularity improving..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Checkpoint'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteProgress}
        title="Delete Progress Log"
        message="Are you sure you want to delete this checkpoint?"
        loading={actionLoading}
      />
    </div>
  );
};

export default ProgressPage;
