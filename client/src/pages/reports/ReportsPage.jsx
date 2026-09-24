import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Flame,
  Dumbbell,
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { reportService } from '../../services/extraServices';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const ReportsPage = () => {
  const toast = useToast();
  const [reportType, setReportType] = useState('combined');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      const res = await reportService.getReportPreview({
        type: reportType,
        startDate,
        endDate
      });
      if (res.success) {
        setPreview(res.data);
      }
    } catch (err) {
      toast.error('Failed to generate report preview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [reportType, startDate, endDate]);

  const handleDownloadCSV = () => {
    const url = reportService.getCSVDownloadUrl({ type: reportType === 'combined' ? 'workouts' : reportType, startDate, endDate });
    window.open(url, '_blank');
    toast.success('CSV export initiated!');
  };

  const handleDownloadPDF = () => {
    const url = reportService.getPDFDownloadUrl({ type: reportType, startDate, endDate });
    window.open(url, '_blank');
    toast.success('PDF report compilation initiated!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Reports & Export Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Generate structured fitness audits, download coaching PDFs, and export CSV spreadsheets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleDownloadCSV} className="btn btn-secondary">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-primary">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {/* Filter & Range Selector */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Report Type Selector */}
          <div className="flex items-center gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Report Type:</label>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="combined">Combined Fitness Summary</option>
              <option value="workouts">Workouts & Volume Only</option>
              <option value="nutrition">Nutrition & Macros Only</option>
              <option value="progress">Body Measurements & Progress</option>
            </select>
          </div>

          {/* Date Range Pickers */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From:</label>
              <input
                type="date"
                className="form-input"
                style={{ width: 'auto', padding: '0.45rem 0.75rem' }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>To:</label>
              <input
                type="date"
                className="form-input"
                style={{ width: 'auto', padding: '0.45rem 0.75rem' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Box */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="stat-widget">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Dumbbell size={24} />
              </div>
              <div>
                <div className="stat-label">Workouts in Period</div>
                <div className="stat-value">{preview?.summary?.totalWorkouts || 0}</div>
              </div>
            </div>

            <div className="stat-widget">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                <Activity size={24} />
              </div>
              <div>
                <div className="stat-label">Total Workout Time</div>
                <div className="stat-value">{preview?.summary?.totalWorkoutMinutes || 0} <span style={{ fontSize: '0.85rem' }}>mins</span></div>
              </div>
            </div>

            <div className="stat-widget">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Flame size={24} />
              </div>
              <div>
                <div className="stat-label">Calories Burned</div>
                <div className="stat-value">{preview?.summary?.totalCaloriesBurned?.toLocaleString() || 0} <span style={{ fontSize: '0.85rem' }}>kcal</span></div>
              </div>
            </div>

            <div className="stat-widget">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                <Layers size={24} />
              </div>
              <div>
                <div className="stat-label">Nutrition Logs</div>
                <div className="stat-value">{preview?.summary?.nutritionDaysLogged || 0} <span style={{ fontSize: '0.85rem' }}>entries</span></div>
              </div>
            </div>
          </div>

          {/* Detailed Preview Sections */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FileText size={18} color="#10b981" /> Report Live Data Stream ({formatDate(startDate)} - {formatDate(endDate)})
              </h3>
            </div>

            {/* Workouts Preview Table */}
            {preview?.workouts && preview.workouts.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#10b981' }}>
                  Recorded Workout Sessions
                </h4>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Duration</th>
                        <th>Calories</th>
                        <th>Exercises</th>
                        <th>Total Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.workouts.map((w) => (
                        <tr key={w._id}>
                          <td>{formatDate(w.date)}</td>
                          <td style={{ fontWeight: 600 }}>{w.title}</td>
                          <td><span className="badge badge-emerald">{w.category}</span></td>
                          <td>{w.duration} mins</td>
                          <td>{w.caloriesBurned} kcal</td>
                          <td>{w.exercises?.length || 0} items</td>
                          <td><strong>{w.totalVolume} kg</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Nutrition Logs Preview Table */}
            {preview?.nutrition && preview.nutrition.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#06b6d4' }}>
                  Nutrition & Meal Entries
                </h4>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Meal Type</th>
                        <th>Total Calories</th>
                        <th>Protein</th>
                        <th>Carbs</th>
                        <th>Fat</th>
                        <th>Foods</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.nutrition.map((n) => (
                        <tr key={n._id}>
                          <td>{formatDate(n.date)}</td>
                          <td><span className="badge badge-amber">{n.mealType}</span></td>
                          <td style={{ fontWeight: 700 }}>{n.totalCalories} kcal</td>
                          <td>{n.totalProtein}g</td>
                          <td>{n.totalCarbs}g</td>
                          <td>{n.totalFat}g</td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {n.foods.map((f) => f.name).join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
