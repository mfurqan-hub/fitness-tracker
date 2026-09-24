import React, { useState, useEffect } from 'react';
import {
  Apple,
  Plus,
  Flame,
  Droplets,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  X,
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';
import { nutritionService } from '../../services/nutritionService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { DoughnutChartWidget } from '../../components/charts/FitnessCharts';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';

const NutritionPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const initialForm = {
    mealType: 'Breakfast',
    foods: [
      { name: '', servingSize: '1 serving', quantity: 1, calories: 250, protein: 15, carbs: 30, fat: 8 }
    ],
    waterMl: 0,
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchNutrition = async () => {
    try {
      setLoading(true);
      const res = await nutritionService.getNutritionLogs({ date: selectedDate });
      if (res.success) {
        setNutritionData(res.data);
      }
    } catch (err) {
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition();
  }, [selectedDate]);

  // Date Shift (Previous / Next Day)
  const shiftDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Open Add Meal Modal with preselected meal type
  const handleOpenAdd = (type = 'Breakfast') => {
    setIsEditMode(false);
    setFormData({ ...initialForm, mealType: type });
    setIsModalOpen(true);
  };

  // Open Edit Meal Modal
  const handleOpenEdit = (log) => {
    setIsEditMode(true);
    setEditingLogId(log._id);
    setFormData({
      mealType: log.mealType,
      foods: log.foods && log.foods.length > 0 ? log.foods : initialForm.foods,
      waterMl: log.waterMl || 0,
      notes: log.notes || ''
    });
    setIsModalOpen(true);
  };

  // Food Row Add/Remove/Change
  const handleAddFoodRow = () => {
    setFormData({
      ...formData,
      foods: [
        ...formData.foods,
        { name: '', servingSize: '1 serving', quantity: 1, calories: 150, protein: 10, carbs: 15, fat: 5 }
      ]
    });
  };

  const handleRemoveFoodRow = (index) => {
    setFormData({
      ...formData,
      foods: formData.foods.filter((_, i) => i !== index)
    });
  };

  const handleFoodChange = (index, field, value) => {
    const updated = [...formData.foods];
    updated[index][field] = value;
    setFormData({ ...formData, foods: updated });
  };

  // Submit Meal Log
  const handleSubmitMeal = async (e) => {
    e.preventDefault();
    if (!formData.foods || formData.foods.length === 0 || !formData.foods[0].name.trim()) {
      toast.error('Please specify at least one food item.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        mealType: formData.mealType,
        date: selectedDate,
        foods: formData.foods.map((f) => ({
          ...f,
          quantity: Number(f.quantity || 1),
          calories: Number(f.calories || 0),
          protein: Number(f.protein || 0),
          carbs: Number(f.carbs || 0),
          fat: Number(f.fat || 0)
        })),
        waterMl: Number(formData.waterMl || 0),
        notes: formData.notes
      };

      if (isEditMode) {
        await nutritionService.updateMealLog(editingLogId, payload);
        toast.success('Meal log updated!');
      } else {
        await nutritionService.addMealLog(payload);
        toast.success('Meal logged successfully! 🥗');
      }

      setIsModalOpen(false);
      fetchNutrition();
    } catch (err) {
      toast.error(err.message || 'Failed to save meal.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Meal
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      await nutritionService.deleteMealLog(deletingId);
      toast.success('Meal entry deleted.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchNutrition();
    } catch (err) {
      toast.error('Failed to delete meal.');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Water
  const handleAddWater = async (amount = 250) => {
    try {
      await nutritionService.logWater({ amountMl: amount, date: selectedDate });
      toast.success(`+${amount} ml logged!`);
      fetchNutrition();
    } catch (err) {
      toast.error('Failed to log water.');
    }
  };

  const totals = nutritionData?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0, waterMl: 0 };
  const targets = nutritionData?.targets || {
    calories: user?.targetCalories || 2000,
    protein: user?.targetProtein || 150,
    carbs: user?.targetCarbs || 200,
    fat: user?.targetFat || 65,
    waterMl: user?.targetWater || 2500
  };

  const caloriePct = Math.min(100, Math.round((totals.calories / targets.calories) * 100));
  const proteinPct = Math.min(100, Math.round((totals.protein / targets.protein) * 100));
  const carbsPct = Math.min(100, Math.round((totals.carbs / targets.carbs) * 100));
  const fatPct = Math.min(100, Math.round((totals.fat / targets.fat) * 100));

  // Doughnut macro chart data
  const macroChartData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fat (g)'],
    datasets: [
      {
        data: [totals.protein || 1, totals.carbs || 1, totals.fat || 1],
        backgroundColor: ['#10b981', '#06b6d4', '#a78bfa'],
        borderWidth: 0
      }
    ]
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner & Date Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Nutrition & Macro Ledger</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Daily macronutrient calibration, meal breakdowns, and hydration tracking
          </p>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button onClick={() => shiftDate(-1)} className="btn btn-secondary btn-icon" title="Previous Day">
            <ChevronLeft size={18} />
          </button>
          <input
            type="date"
            className="form-input"
            style={{ padding: '0.5rem 0.85rem', width: 'auto', fontWeight: 600 }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={() => shiftDate(1)} className="btn btn-secondary btn-icon" title="Next Day">
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="btn btn-outline btn-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Daily Macro & Calorie Overview Panel */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="grid grid-cols-4 gap-6 items-center">
          {/* Doughnut Chart */}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Macro Split
            </h4>
            <DoughnutChartWidget data={macroChartData} height={150} />
          </div>

          {/* Calorie Dial & Progress */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Daily Calories</span>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>
                  <span style={{ color: '#f59e0b' }}>{totals.calories}</span> / {targets.calories} kcal ({caloriePct}%)
                </span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${caloriePct}%`, backgroundColor: '#f59e0b', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            {/* 3 Macro Progress Bars */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>Protein</span>
                  <span>{totals.protein} / {targets.protein}g ({proteinPct}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${proteinPct}%`, backgroundColor: '#10b981' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#06b6d4' }}>Carbohydrates</span>
                  <span>{totals.carbs} / {targets.carbs}g ({carbsPct}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${carbsPct}%`, backgroundColor: '#06b6d4' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#a78bfa' }}>Fats</span>
                  <span>{totals.fat} / {targets.fat}g ({fatPct}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${fatPct}%`, backgroundColor: '#a78bfa' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Widget */}
      <div className="card" style={{ padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', backgroundColor: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
        <div className="flex items-center gap-3">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Droplets size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Hydration Target</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Logged today: <strong style={{ color: '#06b6d4' }}>{totals.waterMl} ml</strong> of {targets.waterMl} ml
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handleAddWater(250)} className="btn btn-secondary btn-sm">
            +250 ml (Glass)
          </button>
          <button onClick={() => handleAddWater(500)} className="btn btn-secondary btn-sm">
            +500 ml (Bottle)
          </button>
          <button onClick={() => handleAddWater(1000)} className="btn btn-secondary btn-sm">
            +1000 ml (Shaker)
          </button>
        </div>
      </div>

      {/* Grouped Meal Cards (Breakfast, Lunch, Dinner, Snacks) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {mealTypes.map((type) => {
          const matchingLogs = nutritionData?.logs?.filter((l) => l.mealType === type) || [];
          const mealCalories = matchingLogs.reduce((sum, l) => sum + (l.totalCalories || 0), 0);
          const mealProtein = matchingLogs.reduce((sum, l) => sum + (l.totalProtein || 0), 0);
          const mealCarbs = matchingLogs.reduce((sum, l) => sum + (l.totalCarbs || 0), 0);
          const mealFat = matchingLogs.reduce((sum, l) => sum + (l.totalFat || 0), 0);

          return (
            <div key={type} className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{type}</h3>
                  <span className="badge badge-amber">{mealCalories} kcal</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    P: {mealProtein}g | C: {mealCarbs}g | F: {mealFat}g
                  </span>
                </div>
                <button onClick={() => handleOpenAdd(type)} className="btn btn-primary btn-sm">
                  <Plus size={14} /> Add Food
                </button>
              </div>

              {matchingLogs.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No food logged for {type}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {matchingLogs.map((log) => (
                    <div
                      key={log._id}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {log.foods.map((f) => f.name).join(', ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleOpenEdit(log)} className="btn btn-ghost btn-icon btn-sm" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(log._id);
                              setIsDeleteOpen(true);
                            }}
                            className="btn btn-ghost btn-icon btn-sm"
                            style={{ color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Calories: <strong style={{ color: '#f59e0b' }}>{log.totalCalories} kcal</strong></span>
                        <span>Protein: <strong style={{ color: '#10b981' }}>{log.totalProtein}g</strong></span>
                        <span>Carbs: <strong style={{ color: '#06b6d4' }}>{log.totalCarbs}g</strong></span>
                        <span>Fat: <strong style={{ color: '#a78bfa' }}>{log.totalFat}g</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Edit Meal Log' : `Log Meal - ${formData.mealType}`}
        maxWidth="700px"
      >
        <form onSubmit={handleSubmitMeal}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Meal Type</label>
              <select
                className="form-select"
                value={formData.mealType}
                onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              >
                {mealTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Water Intake with Meal (ml)</label>
              <input
                type="number"
                className="form-input"
                placeholder="250"
                value={formData.waterMl}
                onChange={(e) => setFormData({ ...formData, waterMl: e.target.value })}
                min="0"
              />
            </div>
          </div>

          {/* Dynamic Food Items */}
          <div style={{ margin: '1rem 0', padding: '1rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Food Items</h4>
              <button type="button" onClick={handleAddFoodRow} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {formData.foods.map((food, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 36px',
                    gap: '0.4rem',
                    alignItems: 'center',
                    padding: '0.5rem',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Food Name (e.g. Oatmeal)"
                    value={food.name}
                    onChange={(e) => handleFoodChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Calories"
                    value={food.calories}
                    onChange={(e) => handleFoodChange(idx, 'calories', e.target.value)}
                    min="0"
                    title="Calories (kcal)"
                    required
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Protein (g)"
                    value={food.protein}
                    onChange={(e) => handleFoodChange(idx, 'protein', e.target.value)}
                    min="0"
                    step="0.5"
                    title="Protein in grams"
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Carbs (g)"
                    value={food.carbs}
                    onChange={(e) => handleFoodChange(idx, 'carbs', e.target.value)}
                    min="0"
                    step="0.5"
                    title="Carbs in grams"
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Fat (g)"
                    value={food.fat}
                    onChange={(e) => handleFoodChange(idx, 'fat', e.target.value)}
                    min="0"
                    step="0.5"
                    title="Fat in grams"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFoodRow(idx)}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: '#ef4444' }}
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : isEditMode ? 'Update Log' : 'Save Meal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Meal Log"
        message="Are you sure you want to delete this nutrition log entry?"
        loading={actionLoading}
      />
    </div>
  );
};

export default NutritionPage;
