import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  Activity,
  Target,
  Clock,
  Plus,
  ArrowRight,
  Droplets,
  Calendar,
  TrendingUp,
  CheckCircle,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workoutService } from '../../services/workoutService';
import { nutritionService } from '../../services/nutritionService';
import { progressService, goalService, reminderService } from '../../services/extraServices';
import StatCard from '../../components/common/StatCard';
import { LineChartWidget, BarChartWidget } from '../../components/charts/FitnessCharts';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate, formatWeight } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  // States
  const [stats, setStats] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [todayNutrition, setTodayNutrition] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const todayStr = new Date().toISOString().split('T')[0];

        const [workoutRes, statsRes, nutritionRes, progressRes, goalsRes, reminderRes] =
          await Promise.all([
            workoutService.getWorkouts({ limit: 4 }),
            workoutService.getWorkoutStats(),
            nutritionService.getNutritionLogs({ date: todayStr }),
            progressService.getProgressHistory({ timeRange: '1m' }),
            goalService.getGoals({ status: 'active' }),
            reminderService.getReminders()
          ]);

        if (workoutRes.success) setRecentWorkouts(workoutRes.data || []);
        if (statsRes.success) setStats(statsRes.data);
        if (nutritionRes.success) setTodayNutrition(nutritionRes.data);
        if (progressRes.success) setProgressHistory(progressRes.data || []);
        if (goalsRes.success) setGoals(goalsRes.data || []);
        if (reminderRes.success) setReminders(reminderRes.data || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickWater = async () => {
    try {
      const res = await nutritionService.logWater({ amountMl: 250 });
      if (res.success) {
        toast.success('+250 ml Water Logged! 💧');
        setTodayNutrition((prev) => ({
          ...prev,
          totals: {
            ...prev?.totals,
            waterMl: (prev?.totals?.waterMl || 0) + 250
          }
        }));
      }
    } catch (err) {
      toast.error('Failed to log water');
    }
  };

  // Prepare Weight Chart Data
  const weightLabels = progressHistory.length > 0
    ? progressHistory.map((p) => formatDate(p.date))
    : ['Week 1', 'Week 2', 'Week 3', 'Current'];

  const weightValues = progressHistory.length > 0
    ? progressHistory.map((p) => p.weight)
    : [user?.weight || 75, user?.weight || 75];

  const weightChartData = {
    labels: weightLabels,
    datasets: [
      {
        label: 'Body Weight (kg)',
        data: weightValues,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointRadius: 4
      }
    ]
  };

  // Prepare Weekly Workouts Bar Chart Data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const workoutMinsByDay = [0, 0, 0, 0, 0, 0, 0];
  
  if (stats?.recentWeeklyWorkouts) {
    stats.recentWeeklyWorkouts.forEach((w) => {
      const d = new Date(w.date).getDay();
      const index = d === 0 ? 6 : d - 1; // Mon=0, Sun=6
      workoutMinsByDay[index] += w.duration || 0;
    });
  }

  const workoutBarData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Duration (Mins)',
        data: workoutMinsByDay,
        backgroundColor: '#06b6d4',
        borderRadius: 8
      }
    ]
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '300px' }} />
        <CardSkeleton count={4} />
      </div>
    );
  }

  const totalCaloriesToday = todayNutrition?.totals?.calories || 0;
  const targetCalories = todayNutrition?.targets?.calories || user?.targetCalories || 2000;
  const caloriePercent = Math.min(100, Math.round((totalCaloriesToday / targetCalories) * 100));

  const totalWaterToday = todayNutrition?.totals?.waterMl || 0;
  const targetWater = todayNutrition?.targets?.waterMl || user?.targetWater || 2500;
  const waterPercent = Math.min(100, Math.round((totalWaterToday / targetWater) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Welcome Banner */}
      <div
        className="card-glass"
        style={{
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
          borderColor: 'rgba(16, 185, 129, 0.25)'
        }}
      >
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
            <span className="badge badge-emerald">
              <Sparkles size={12} /> Real-Time MongoDB Synced
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            You are on track toward your <strong style={{ color: '#10b981' }}>{user?.fitnessGoal?.replace('_', ' ')}</strong> objective.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/workouts" className="btn btn-primary">
            <Plus size={16} /> Log Workout
          </Link>
          <Link to="/nutrition" className="btn btn-secondary">
            <Plus size={16} /> Log Meal
          </Link>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Today's Nutrition"
          value={totalCaloriesToday}
          unit={`/ ${targetCalories} kcal`}
          icon={Flame}
          color="amber"
          subtext={`${caloriePercent}% of daily calorie target`}
        />

        <StatCard
          title="Current Weight"
          value={user?.weight || '--'}
          unit={user?.preferences?.units?.weight || 'kg'}
          icon={Activity}
          color="emerald"
          subtext="Updated via Progress Log"
        />

        <StatCard
          title="Total Workouts"
          value={stats?.totalWorkouts || recentWorkouts.length || 0}
          unit="sessions"
          icon={Dumbbell}
          color="cyan"
          subtext={`${stats?.totals?.totalMins || 0} active minutes`}
        />

        <StatCard
          title="Active Goals"
          value={goals.length}
          unit="targets"
          icon={Target}
          color="purple"
          subtext="Tracked milestones"
        />
      </div>

      {/* Main Grid: Charts & Feeds */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Charts */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Weight Trend Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp size={18} color="#10b981" /> Weight Progress Progression
              </div>
              <Link to="/progress" className="btn btn-ghost btn-sm">
                View Log <ArrowRight size={14} />
              </Link>
            </div>
            <LineChartWidget
              data={weightChartData}
              height={240}
              yAxisLabel="Weight (kg)"
            />
          </div>

          {/* Weekly Workout Volume Bar Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={18} color="#06b6d4" /> Weekly Training Minutes
              </div>
              <Link to="/analytics" className="btn btn-ghost btn-sm">
                Full Analytics <ArrowRight size={14} />
              </Link>
            </div>
            <BarChartWidget data={workoutBarData} height={220} yAxisLabel="Minutes" />
          </div>

          {/* Recent Workouts List */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Dumbbell size={18} color="#10b981" /> Recent Workout Sessions
              </div>
              <Link to="/workouts" className="btn btn-ghost btn-sm">
                All Workouts <ArrowRight size={14} />
              </Link>
            </div>

            {recentWorkouts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <p>No workouts recorded yet.</p>
                <Link to="/workouts" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                  <Plus size={14} /> Record Your First Workout
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentWorkouts.map((workout) => (
                  <div
                    key={workout._id}
                    style={{
                      padding: '0.875rem 1.25rem',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border-subtle)',
                      transition: 'transform var(--transition-fast)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{workout.title}</div>
                      <div className="flex items-center gap-2" style={{ marginTop: '0.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span className="badge badge-emerald">{workout.category}</span>
                        <span>• {workout.duration} mins</span>
                        <span>• {workout.caloriesBurned} kcal burned</span>
                        <span>• {workout.exercises?.length || 0} exercises</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(workout.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Nutrition, Goals, Reminders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Today's Nutrition Breakdown Widget */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Flame size={18} color="#f59e0b" /> Daily Nutrition
              </div>
              <Link to="/nutrition" className="btn btn-ghost btn-sm">
                Log Food <ArrowRight size={14} />
              </Link>
            </div>

            {/* Calorie Progress Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="flex items-center justify-between" style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 600 }}>Calories</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalCaloriesToday} / {targetCalories} kcal</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${caloriePercent}%`,
                    backgroundColor: '#f59e0b',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
            </div>

            {/* Macros Distribution Mini-Bars */}
            <div className="grid grid-cols-3 gap-2" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>PROTEIN</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{todayNutrition?.totals?.protein || 0}g</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Target {todayNutrition?.targets?.protein || 150}g</div>
              </div>

              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>CARBS</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#06b6d4' }}>{todayNutrition?.totals?.carbs || 0}g</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Target {todayNutrition?.targets?.carbs || 200}g</div>
              </div>

              <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>FAT</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#a78bfa' }}>{todayNutrition?.totals?.fat || 0}g</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Target {todayNutrition?.targets?.fat || 65}g</div>
              </div>
            </div>

            {/* Quick Water Intake Button */}
            <div style={{ padding: '0.85rem', backgroundColor: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                <div className="flex items-center gap-1.5" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4' }}>
                  <Droplets size={16} /> Hydration Tracker
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{totalWaterToday} / {targetWater} ml</span>
              </div>
              <button
                onClick={handleQuickWater}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', borderColor: 'rgba(6, 182, 212, 0.4)' }}
              >
                +250 ml Quick Log
              </button>
            </div>
          </div>

          {/* Active Goals Widget */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Target size={18} color="#a78bfa" /> Active Goals
              </div>
              <Link to="/goals" className="btn btn-ghost btn-sm">
                Manage <ArrowRight size={14} />
              </Link>
            </div>

            {goals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active goals. <Link to="/goals" style={{ color: '#10b981', fontWeight: 600 }}>Create one!</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {goals.slice(0, 3).map((g) => (
                  <div key={g._id}>
                    <div className="flex items-center justify-between" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600 }}>{g.title}</span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{g.progressPercent || 0}%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${g.progressPercent || 0}%`,
                          backgroundColor: '#10b981',
                          borderRadius: 'var(--radius-full)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reminders Mini-Widget */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Clock size={18} color="#fb7185" /> Daily Reminders
              </div>
              <Link to="/settings" className="btn btn-ghost btn-sm">
                Config <ArrowRight size={14} />
              </Link>
            </div>

            {reminders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No reminders scheduled.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {reminders.slice(0, 3).map((r) => (
                  <div
                    key={r._id}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{r.title}</span>
                    <span className="badge badge-rose">{r.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
