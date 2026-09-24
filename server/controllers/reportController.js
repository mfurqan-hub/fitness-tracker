const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const Progress = require('../models/Progress');
const ApiResponse = require('../utils/apiResponse');

// Helper to filter data by date range
const buildDateFilter = (userId, startDate, endDate) => {
  const filter = { user: userId };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }
  return filter;
};

// @desc    Get summary report data (JSON preview)
// @route   GET /api/reports/preview
// @access  Private
const getReportPreview = async (req, res, next) => {
  try {
    const { type = 'combined', startDate, endDate } = req.query;
    const filter = buildDateFilter(req.user._id, startDate, endDate);

    let workouts = [];
    let nutrition = [];
    let progress = [];

    if (type === 'workouts' || type === 'combined') {
      workouts = await Workout.find(filter).sort('date');
    }
    if (type === 'nutrition' || type === 'combined') {
      nutrition = await Nutrition.find(filter).sort('date');
    }
    if (type === 'progress' || type === 'combined') {
      progress = await Progress.find(filter).sort('date');
    }

    const totalWorkoutMins = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalCaloriesIntake = nutrition.reduce((sum, n) => sum + (n.totalCalories || 0), 0);

    return ApiResponse.success(res, 'Report preview generated', {
      user: {
        name: req.user.name,
        email: req.user.email,
        currentWeight: req.user.weight
      },
      range: { startDate, endDate },
      summary: {
        totalWorkouts: workouts.length,
        totalWorkoutMinutes: totalWorkoutMins,
        totalCaloriesBurned,
        totalCaloriesIntake,
        nutritionDaysLogged: nutrition.length,
        progressEntries: progress.length
      },
      workouts,
      nutrition,
      progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export report as CSV
// @route   GET /api/reports/export/csv
// @access  Private
const exportCSV = async (req, res, next) => {
  try {
    const { type = 'workouts', startDate, endDate } = req.query;
    const filter = buildDateFilter(req.user._id, startDate, endDate);

    let data = [];
    let fields = [];
    let filename = `fitness_report_${type}_${Date.now()}.csv`;

    if (type === 'workouts') {
      const workouts = await Workout.find(filter).sort('date');
      fields = ['date', 'title', 'category', 'duration', 'caloriesBurned', 'exercisesCount', 'totalVolume'];
      data = workouts.map((w) => ({
        date: new Date(w.date).toLocaleDateString(),
        title: w.title,
        category: w.category,
        duration: `${w.duration} mins`,
        caloriesBurned: w.caloriesBurned,
        exercisesCount: w.exercises.length,
        totalVolume: `${w.totalVolume} kg`
      }));
    } else if (type === 'nutrition') {
      const nutrition = await Nutrition.find(filter).sort('date');
      fields = ['date', 'mealType', 'totalCalories', 'protein', 'carbs', 'fat', 'waterMl', 'foods'];
      data = nutrition.map((n) => ({
        date: new Date(n.date).toLocaleDateString(),
        mealType: n.mealType,
        totalCalories: n.totalCalories,
        protein: `${n.totalProtein}g`,
        carbs: `${n.totalCarbs}g`,
        fat: `${n.totalFat}g`,
        waterMl: `${n.waterMl}ml`,
        foods: n.foods.map((f) => f.name).join('; ')
      }));
    } else if (type === 'progress') {
      const progress = await Progress.find(filter).sort('date');
      fields = ['date', 'weight', 'bodyFat', 'chest', 'waist', 'arms', 'thighs', 'notes'];
      data = progress.map((p) => ({
        date: new Date(p.date).toLocaleDateString(),
        weight: `${p.weight} kg`,
        bodyFat: p.bodyFat ? `${p.bodyFat}%` : 'N/A',
        chest: p.measurements?.chest ? `${p.measurements.chest} cm` : 'N/A',
        waist: p.measurements?.waist ? `${p.measurements.waist} cm` : 'N/A',
        arms: p.measurements?.arms ? `${p.measurements.arms} cm` : 'N/A',
        thighs: p.measurements?.thighs ? `${p.measurements.thighs} cm` : 'N/A',
        notes: p.notes || ''
      }));
    }

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Export report as PDF
// @route   GET /api/reports/export/pdf
// @access  Private
const exportPDF = async (req, res, next) => {
  try {
    const { type = 'combined', startDate, endDate } = req.query;
    const filter = buildDateFilter(req.user._id, startDate, endDate);

    const workouts = await Workout.find(filter).sort('date');
    const nutrition = await Nutrition.find(filter).sort('date');
    const progress = await Progress.find(filter).sort('date');

    const doc = new PDFDocument({ margin: 40 });
    const filename = `fitness_report_${Date.now()}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Title / Header
    doc.fontSize(22).fillColor('#10B981').text('FITNESS TRACKER REPORT', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#64748B').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.text(`Athlete: ${req.user.name} (${req.user.email})`, { align: 'center' });
    doc.moveDown(1);

    // Summary Box
    doc.rect(40, doc.y, 532, 60).fill('#F8FAFC');
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold');
    doc.text(`Report Summary (${startDate || 'All time'} to ${endDate || 'Present'})`, 55, doc.y - 48);
    doc.font('Helvetica').fontSize(9).fillColor('#475569');
    const totalWorkoutMins = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const totalCalsBurned = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    doc.text(`Total Workouts Logged: ${workouts.length} | Active Time: ${totalWorkoutMins} mins | Calories Burned: ${totalCalsBurned} kcal`, 55, doc.y + 4);
    doc.text(`Nutrition Logs: ${nutrition.length} entries | Body Progress Checkpoints: ${progress.length} logs`, 55, doc.y + 4);

    doc.moveDown(3);

    // Section 1: Workouts
    if (workouts.length > 0) {
      doc.fontSize(14).fillColor('#10B981').font('Helvetica-Bold').text('Recent Workouts');
      doc.moveDown(0.5);
      workouts.slice(0, 15).forEach((w) => {
        doc.fontSize(10).fillColor('#0F172A').font('Helvetica-Bold')
          .text(`${new Date(w.date).toLocaleDateString()} - ${w.title} [${w.category}]`);
        doc.fontSize(9).fillColor('#64748B').font('Helvetica')
          .text(`Duration: ${w.duration} mins | Calories: ${w.caloriesBurned} kcal | Volume: ${w.totalVolume} kg | Exercises: ${w.exercises.length}`);
        doc.moveDown(0.4);
      });
      doc.moveDown(1);
    }

    // Section 2: Progress
    if (progress.length > 0) {
      doc.fontSize(14).fillColor('#3B82F6').font('Helvetica-Bold').text('Body Progress Measurements');
      doc.moveDown(0.5);
      progress.slice(0, 10).forEach((p) => {
        doc.fontSize(9).fillColor('#0F172A').font('Helvetica')
          .text(`${new Date(p.date).toLocaleDateString()}: Weight: ${p.weight} kg | Body Fat: ${p.bodyFat || 'N/A'}% | Waist: ${p.measurements?.waist || 'N/A'} cm | Arms: ${p.measurements?.arms || 'N/A'} cm`);
      });
      doc.moveDown(1);
    }

    // Footer
    doc.fontSize(8).fillColor('#94A3B8').text('Fitness Tracker SaaS - Academic eProject - Confidential & Personal Health Record', 40, 750, { align: 'center' });

    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReportPreview,
  exportCSV,
  exportPDF
};
