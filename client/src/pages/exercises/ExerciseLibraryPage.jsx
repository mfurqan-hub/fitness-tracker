import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Info,
  Dumbbell,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Trash2,
  Edit
} from 'lucide-react';
import { exerciseService } from '../../services/exerciseService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ExerciseLibraryPage = () => {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [equipment, setEquipment] = useState('All');

  // Modal states
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // New Exercise Form
  const initialForm = {
    name: '',
    category: 'Strength',
    muscleGroup: 'Chest',
    secondaryMuscles: '',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: '',
    tips: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await exerciseService.getExercises({
        search: search.trim(),
        muscleGroup,
        difficulty,
        equipment
      });
      if (res.success) {
        setExercises(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [muscleGroup, difficulty, equipment]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExercises();
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Exercise name is required.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        secondaryMuscles: formData.secondaryMuscles ? formData.secondaryMuscles.split(',').map((s) => s.trim()).filter(Boolean) : [],
        instructions: formData.instructions ? formData.instructions.split('\n').filter(Boolean) : [],
        tips: formData.tips ? formData.tips.split('\n').filter(Boolean) : []
      };

      const res = await exerciseService.createExercise(payload);
      if (res.success) {
        toast.success('Exercise added to catalogue!');
        setIsCreateOpen(false);
        setFormData(initialForm);
        fetchExercises();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExercise = async () => {
    try {
      setActionLoading(true);
      await exerciseService.deleteExercise(deletingId);
      toast.success('Exercise deleted.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchExercises();
    } catch (err) {
      toast.error(err.message || 'Failed to delete exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const equipments = ['All', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'None'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Exercise Catalogue</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Comprehensive encyclopedia of strength, cardio, and functional exercises
          </p>
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Add Custom Exercise
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <div className="form-input-wrapper" style={{ flex: 1 }}>
              <Search size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input form-input-with-icon"
                placeholder="Search by exercise name (e.g. Bench Press, Squat, Pull-Up)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>

          {/* Muscle Group Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
              Target:
            </span>
            {muscleGroups.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscleGroup(m)}
                className={`btn btn-sm ${muscleGroup === m ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Secondary Filters (Difficulty & Equipment) */}
          <div className="flex items-center gap-4 flex-wrap" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <div className="flex items-center gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Difficulty:</label>
              <select
                className="form-select"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Equipment:</label>
              <select
                className="form-select"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
              >
                {equipments.map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : exercises.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <BookOpen size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Exercises Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Try clearing filters or search queries to see available exercises.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {exercises.map((ex) => (
            <div
              key={ex._id}
              className="card card-interactive"
              onClick={() => {
                setSelectedExercise(ex);
                setIsDetailOpen(true);
              }}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                <span className="badge badge-emerald">{ex.muscleGroup}</span>
                <span
                  className={`badge ${
                    ex.difficulty === 'Beginner'
                      ? 'badge-cyan'
                      : ex.difficulty === 'Intermediate'
                      ? 'badge-amber'
                      : 'badge-rose'
                  }`}
                >
                  {ex.difficulty}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{ex.name}</h3>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Equipment: <strong style={{ color: 'var(--text-primary)' }}>{ex.equipment}</strong>
              </div>

              {ex.instructions && ex.instructions.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {ex.instructions[0]}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  View Coaching Cues →
                </span>

                {(isAdmin || ex.isCustom) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(ex._id);
                      setIsDeleteOpen(true);
                    }}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: '#ef4444' }}
                    title="Delete Exercise"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedExercise.name}
          maxWidth="680px"
        >
          <div>
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '1.25rem' }}>
              <span className="badge badge-emerald">{selectedExercise.muscleGroup} Target</span>
              <span className="badge badge-cyan">{selectedExercise.equipment}</span>
              <span className="badge badge-purple">{selectedExercise.difficulty}</span>
              <span className="badge badge-gray">{selectedExercise.category}</span>
            </div>

            {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={16} color="#10b981" /> Step-by-Step Instructions
                </h4>
                <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {selectedExercise.instructions.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {selectedExercise.tips && selectedExercise.tips.length > 0 && (
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HelpCircle size={15} /> Pro Coaching Tips
                </h4>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {selectedExercise.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Custom Exercise Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Exercise"
        maxWidth="650px"
      >
        <form onSubmit={handleCreateExercise}>
          <div className="form-group">
            <label className="form-label">Exercise Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Bulgarian Split Squat"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Primary Muscle</label>
              <select
                className="form-select"
                value={formData.muscleGroup}
                onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
              >
                {muscleGroups.filter((m) => m !== 'All').map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Equipment</label>
              <select
                className="form-select"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              >
                {equipments.filter((eq) => eq !== 'All').map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                {difficulties.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instructions (One step per line)</label>
            <textarea
              className="form-textarea"
              placeholder="Step 1: Set foot on bench&#10;Step 2: Descend down until parallel&#10;Step 3: Drive upwards through heel"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Coaching Tips (One tip per line)</label>
            <textarea
              className="form-textarea"
              placeholder="Keep torso upright&#10;Do not let front knee cave inward"
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Add Exercise'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteExercise}
        title="Delete Exercise"
        message="Are you sure you want to remove this exercise from the catalogue?"
        loading={actionLoading}
      />
    </div>
  );
};

export default ExerciseLibraryPage;
