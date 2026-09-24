import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  Dumbbell,
  PieChart as PieIcon,
  Layers,
  Sparkles
} from 'lucide-react';
import { workoutService } from '../../services/workoutService';
import { progressService } from '../../services/extraServices';
import { LineChartWidget, BarChartWidget, DoughnutChartWidget } from '../../components/charts/FitnessCharts';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const AnalyticsPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [workoutStats, setWorkoutStats] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [statsRes, progRes] = await Promise.all([
          workoutService.getWorkoutStats(),
          progressService.getProgressHistory({ timeRange: 'all' })
        ]);

        if (statsRes.success) setWorkoutStats(statsRes.data);
        if (progRes.success) setProgressHistory(progRes.data || []);
      } catch (err) {
        toast.error('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <CardSkeleton count={4} />;
  }

  // Workout Category Distribution Data
  const categories = workoutStats?.categoryDistribution || [];
  const categoryLabels = categories.map((c) => c._id || 'Other');
  const categoryCounts = categories.map((c) => c.count);

  const categoryDoughnutData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['Strength', 'Cardio', 'HIIT'],
    datasets: [
      {
        data: categoryCounts.length > 0 ? categoryCounts : [12, 5, 3],
        backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#a78bfa', '#fb7185', '#94a3b8'],
        borderWidth: 0
      }
    ]
  };

  // Workout Duration Bar Data
  const recentWorkouts = workoutStats?.recentWeeklyWorkouts || [];
  const durationLabels = recentWorkouts.map((w) => formatDate(w.date));
  const durationValues = recentWorkouts.map((w) => w.duration);
  const caloriesValues = recentWorkouts.map((w) => w.caloriesBurned);

  const durationBarData = {
    labels: durationLabels.length > 0 ? durationLabels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Duration (Minutes)',
        data: durationValues.length > 0 ? durationValues : [60, 45, 50, 75, 45, 60],
        backgroundColor: '#10b981',
        borderRadius: 6
      }
    ]
  };

  // Volume Lifted Trend Data
  const volumeLabels = recentWorkouts.map((w) => formatDate(w.date));
  const volumeValues = recentWorkouts.map((w) => w.totalVolume);

  const volumeTrendData = {
    labels: volumeLabels.length > 0 ? volumeLabels : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Volume Lifted (kg)',
        data: volumeValues.length > 0 ? volumeValues : [8500, 11200, 14300, 18500],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.35
      }
    ]
  };

  // Strength Progression (Bench, Squat, Deadlift from progress history)
  const strengthLabels = progressHistory.map((p) => formatDate(p.date));
  const benchValues = progressHistory.map((p) => p.performanceMetrics?.benchPressMax || 0);
  const squatValues = progressHistory.map((p) => p.performanceMetrics?.squatMax || 0);
  const deadliftValues = progressHistory.map((p) => p.performanceMetrics?.deadliftMax || 0);

  const strengthProgressionData = {
    labels: strengthLabels.length > 0 ? strengthLabels : ['Baseline', 'Check 1', 'Check 2', 'Current'],
    datasets: [
      {
        label: 'Bench Press (kg)',
        data: benchValues.length > 0 && benchValues.some((v) => v > 0) ? benchValues : [80, 85, 90, 92.5],
        borderColor: '#f59e0b',
        borderWidth: 2,
        tension: 0.2
      },
      {
        label: 'Squat (kg)',
        data: squatValues.length > 0 && squatValues.some((v) => v > 0) ? squatValues : [100, 105, 115, 117.5],
        borderColor: '#10b981',
        borderWidth: 2,
        tension: 0.2
      },
      {
        label: 'Deadlift (kg)',
        data: deadliftValues.length > 0 && deadliftValues.some((v) => v > 0) ? deadliftValues : [130, 137.5, 145, 150],
        borderColor: '#a78bfa',
        borderWidth: 2,
        tension: 0.2
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Analytics & Aggregations</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Deep-dive insights into volume tonnage, category distributions, and compound lifts
        </p>
      </div>

      {/* Aggregate KPI cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Dumbbell size={24} />
            </div>
            <div>
              <div className="stat-label">Total Cumulative Volume</div>
              <div className="stat-value">{workoutStats?.totals?.totalVol?.toLocaleString() || 0} <span style={{ fontSize: '0.85rem' }}>kg</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
              <Activity size={24} />
            </div>
            <div>
              <div className="stat-label">Total Active Time</div>
              <div className="stat-value">{workoutStats?.totals?.totalMins || 0} <span style={{ fontSize: '0.85rem' }}>minutes</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Flame size={24} />
            </div>
            <div>
              <div className="stat-label">Estimated Calories Burned</div>
              <div className="stat-value">{workoutStats?.totals?.totalCals?.toLocaleString() || 0} <span style={{ fontSize: '0.85rem' }}>kcal</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Workout Category Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <PieIcon size={18} color="#10b981" /> Workout Category Distribution
            </h3>
          </div>
          <DoughnutChartWidget data={categoryDoughnutData} height={220} />
        </div>

        {/* Volume Lifted Progression */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={18} color="#06b6d4" /> Total Volume Progression (kg)
            </h3>
          </div>
          <LineChartWidget data={volumeTrendData} height={220} yAxisLabel="Volume (kg)" />
        </div>

        {/* Compound Lift Strength Progression */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Sparkles size={18} color="#a78bfa" /> Big 3 Compound Lifts Progression (Bench / Squat / Deadlift)
            </h3>
          </div>
          <LineChartWidget data={strengthProgressionData} height={260} yAxisLabel="1RM (kg)" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
