import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Search,
  Trash2,
  Edit,
  CheckCircle,
  Layers
} from 'lucide-react';
import { exerciseService } from '../../services/exerciseService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';

const AdminExercisesPage = () => {
  const toast = useToast();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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
        muscleGroup
      });
      if (res.success) {
        setExercises(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load exercise library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [muscleGroup]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExercises();
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ex) => {
    setIsEditMode(true);
    setSelectedId(ex._id);
    setFormData({
      name: ex.name,
      category: ex.category,
      muscleGroup: ex.muscleGroup,
      secondaryMuscles: ex.secondaryMuscles?.join(', ') || '',
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      instructions: ex.instructions?.join('\n') || '',
      tips: ex.tips?.join('\n') || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitExercise = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        secondaryMuscles: formData.secondaryMuscles ? formData.secondaryMuscles.split(',').map((s) => s.trim()).filter(Boolean) : [],
        instructions: formData.instructions ? formData.instructions.split('\n').filter(Boolean) : [],
        tips: formData.tips ? formData.tips.split('\n').filter(Boolean) : []
      };

      if (isEditMode) {
        await exerciseService.updateExercise(selectedId, payload);
        toast.success('Exercise modified.');
      } else {
        await exerciseService.createExercise(payload);
        toast.success('Exercise added to catalog.');
      }

      setIsModalOpen(false);
      fetchExercises();
    } catch (err) {
      toast.error(err.message || 'Failed to save exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExercise = async () => {
    try {
      setActionLoading(true);
      await exerciseService.deleteExercise(deletingId);
      toast.success('Exercise removed.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchExercises();
    } catch (err) {
      toast.error('Failed to delete exercise.');
    } finally {
      setActionLoading(false);
    }
  };

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Exercise Catalogue Manager</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Curate and manage standardized exercises, muscle allocations, and coaching cues
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={18} /> Add Catalog Exercise
        </button>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '260px' }}>
            <div className="form-input-wrapper">
              <Search size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input form-input-with-icon"
                placeholder="Search catalog exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-1.5 flex-wrap">
            {muscleGroups.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMuscleGroup(m)}
                className={`btn btn-sm ${muscleGroup === m ? 'btn-primary' : 'btn-secondary'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises Table */}
      <div className="card">
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No exercises found.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Exercise Name</th>
                  <th>Muscle Group</th>
                  <th>Equipment</th>
                  <th>Difficulty</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((ex) => (
                  <tr key={ex._id}>
                    <td><strong style={{ fontSize: '0.95rem' }}>{ex.name}</strong></td>
                    <td><span className="badge badge-emerald">{ex.muscleGroup}</span></td>
                    <td>{ex.equipment}</td>
                    <td><span className="badge badge-cyan">{ex.difficulty}</span></td>
                    <td><span className="badge badge-purple">{ex.category}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenEdit(ex)} className="btn btn-secondary btn-icon btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingId(ex._id);
                            setIsDeleteOpen(true);
                          }}
                          className="btn btn-ghost btn-icon btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Modify Catalog Exercise' : 'Add Catalog Exercise'}
        maxWidth="650px"
      >
        <form onSubmit={handleSubmitExercise}>
          <div className="form-group">
            <label className="form-label">Exercise Name *</label>
            <input
              type="text"
              className="form-input"
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
                {['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'None'].map((eq) => (
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
                {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instructions (One step per line)</label>
            <textarea
              className="form-textarea"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tips & Cues (One per line)</label>
            <textarea
              className="form-textarea"
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : isEditMode ? 'Update Exercise' : 'Save to Catalog'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteExercise}
        title="Delete Exercise"
        message="Are you sure you want to remove this exercise from the system catalogue?"
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminExercisesPage;
