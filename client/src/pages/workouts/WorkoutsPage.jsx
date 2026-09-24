import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Calendar,
  Clock,
  Flame,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { workoutService } from '../../services/workoutService';
import { exerciseService } from '../../services/exerciseService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const WorkoutsPage = () => {
  const toast = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exerciseLibrary, setExerciseLibrary] = useState([]);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    category: 'Strength',
    date: new Date().toISOString().split('T')[0],
    duration: 45,
    caloriesBurned: 0,
    notes: '',
    tags: '',
    exercises: [
      { name: 'Barbell Bench Press', sets: 3, reps: 10, weight: 60, duration: 0, notes: '' }
    ]
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await workoutService.getWorkouts({
        search: search.trim(),
        category,
        page,
        limit: 12
      });
      if (res.success) {
        setWorkouts(res.data || []);
        setMeta(res.meta);
      }
    } catch (err) {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [category, page]);

  useEffect(() => {
    // Load exercise names for dropdown autocomplete
    const loadExercises = async () => {
      try {
        const res = await exerciseService.getExercises();
        if (res.success) setExerciseLibrary(res.data || []);
      } catch (e) {}
    };
    loadExercises();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchWorkouts();
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (workout) => {
    setIsEditMode(true);
    setSelectedWorkout(workout);
    setFormData({
      title: workout.title,
      category: workout.category,
      date: new Date(workout.date).toISOString().split('T')[0],
      duration: workout.duration,
      caloriesBurned: workout.caloriesBurned,
      notes: workout.notes || '',
      tags: workout.tags?.join(', ') || '',
      exercises: workout.exercises && workout.exercises.length > 0 ? workout.exercises : [
        { name: '', sets: 3, reps: 10, weight: 0, duration: 0, notes: '' }
      ]
    });
    setIsModalOpen(true);
  };

  // Add Exercise Row in Form
  const handleAddExerciseRow = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { name: '', sets: 3, reps: 10, weight: 0, duration: 0, notes: '' }
      ]
    });
  };

  // Remove Exercise Row
  const handleRemoveExerciseRow = (index) => {
    const updated = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: updated });
  };

  // Handle Exercise Field Change
  const handleExerciseChange = (index, field, value) => {
    const updated = [...formData.exercises];
    updated[index][field] = value;
    setFormData({ ...formData, exercises: updated });
  };

  // Submit Workout (Create or Update)
  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Workout title is required.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        caloriesBurned: Number(formData.caloriesBurned),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        exercises: formData.exercises.map((ex) => ({
          ...ex,
          sets: Number(ex.sets || 1),
          reps: Number(ex.reps || 0),
          weight: Number(ex.weight || 0),
          duration: Number(ex.duration || 0)
        }))
      };

      if (isEditMode) {
        const res = await workoutService.updateWorkout(selectedWorkout._id, payload);
        if (res.success) {
          toast.success('Workout updated successfully!');
          setIsModalOpen(false);
          fetchWorkouts();
        }
      } else {
        const res = await workoutService.createWorkout(payload);
        if (res.success) {
          toast.success('Workout logged successfully! 🎉');
          setIsModalOpen(false);
          fetchWorkouts();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save workout.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await workoutService.deleteWorkout(deletingId);
      toast.success('Workout deleted successfully.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchWorkouts();
    } catch (err) {
      toast.error('Failed to delete workout.');
    } finally {
      setActionLoading(false);
    }
  };

  const categories = ['All', 'Strength', 'Cardio', 'HIIT', 'Flexibility', 'Sports', 'Other'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Workout Journal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Build routines, log weight sets, and monitor total volume progression
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} /> New Workout
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '260px' }}>
            <div className="form-input-wrapper">
              <Search size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input form-input-with-icon"
                placeholder="Search workouts by title, notes, or exercise name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          {/* Categories Pill Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : workouts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <Dumbbell size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Workouts Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
            {search || category !== 'All'
              ? 'No sessions match your search filters.'
              : 'You have not logged any workouts yet. Start by recording your latest routine!'}
          </p>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} /> Log Workout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {workouts.map((w) => (
            <div key={w._id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-start justify-between gap-2" style={{ marginBottom: '0.75rem' }}>
                <span className="badge badge-emerald">{w.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(w.date)}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {w.title}
              </h3>

              {w.notes && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5, flex: 1 }}>
                  "{w.notes}"
                </p>
              )}

              {/* Stats row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  margin: 'auto 0 1rem',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>DURATION</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{w.duration}m</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>CALORIES</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b' }}>{w.caloriesBurned}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>VOLUME</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#06b6d4' }}>{w.totalVolume} kg</div>
                </div>
              </div>

              {/* Exercise Count preview */}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={14} color="#10b981" />
                <span>{w.exercises?.length || 0} exercises recorded</span>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(w)}
                    className="btn btn-secondary btn-icon btn-sm"
                    title="Edit Workout"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(w._id);
                      setIsDeleteOpen(true);
                    }}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: '#ef4444' }}
                    title="Delete Workout"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <button
                  onClick={() => handleOpenEdit(w)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}
                >
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workout Builder Modal (Create & Edit) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Edit Workout Session' : 'Record New Workout'}
        maxWidth="750px"
      >
        <form onSubmit={handleSubmitWorkout}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Workout Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Chest & Triceps Hypertrophy"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="HIIT">HIIT</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (Minutes) *</label>
              <input
                type="number"
                className="form-input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calories Burned (Estimated)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Auto-calculated if 0"
                value={formData.caloriesBurned}
                onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                min="0"
              />
            </div>
          </div>

          {/* Dynamic Exercise Sets Table */}
          <div style={{ margin: '1.25rem 0', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Dumbbell size={16} color="#10b981" /> Exercise Sets
              </h4>
              <button
                type="button"
                onClick={handleAddExerciseRow}
                className="btn btn-secondary btn-sm"
              >
                <Plus size={14} /> Add Exercise
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.exercises.map((ex, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                    gap: '0.5rem',
                    alignItems: 'center',
                    padding: '0.5rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <input
                    type="text"
                    list="exercise-autocomplete"
                    className="form-input"
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Sets"
                    value={ex.sets}
                    onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                    min="1"
                    title="Sets"
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Reps"
                    value={ex.reps}
                    onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                    min="0"
                    title="Reps"
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Weight (kg)"
                    value={ex.weight}
                    onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
                    min="0"
                    step="0.5"
                    title="Weight in kg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExerciseRow(idx)}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: '#ef4444' }}
                    title="Remove row"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Datalist for autocomplete */}
            <datalist id="exercise-autocomplete">
              {exerciseLibrary.map((ex) => (
                <option key={ex._id} value={ex.name} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Reflections</label>
            <textarea
              className="form-textarea"
              placeholder="Felt great, increased bench press by 2.5 kg, great mind-muscle connection..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : isEditMode ? 'Update Workout' : 'Save Workout'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Workout"
        message="Are you sure you want to delete this workout log? This action cannot be undone."
        loading={actionLoading}
      />
    </div>
  );
};

export default WorkoutsPage;
