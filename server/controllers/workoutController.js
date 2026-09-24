const Workout = require('../models/Workout');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get user workouts (with search, category filter, date range, pagination)
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate, page = 1, limit = 10, sort = '-date' } = req.query;

    const query = { user: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { 'exercises.name': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Workout.countDocuments(query);
    const workouts = await Workout.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.success(res, 'Workouts fetched successfully', workouts, 200, {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout by ID
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return ApiResponse.notFound(res, 'Workout not found');
    }
    return ApiResponse.success(res, 'Workout details retrieved', workout);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res, next) => {
  try {
    const { title, category, date, duration, caloriesBurned, notes, tags, exercises } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      title,
      category: category || 'Strength',
      date: date ? new Date(date) : new Date(),
      duration: Number(duration),
      caloriesBurned: caloriesBurned ? Number(caloriesBurned) : 0,
      notes: notes || '',
      tags: tags || [],
      exercises: exercises || []
    });

    // Create a completion notification for the user
    await Notification.create({
      user: req.user._id,
      title: 'Workout Completed! 💪',
      message: `Great job completing "${workout.title}"! Burned approx ${workout.caloriesBurned} kcal.`,
      type: 'workout',
      actionUrl: `/workouts`
    });

    return ApiResponse.created(res, 'Workout logged successfully', workout);
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return ApiResponse.notFound(res, 'Workout not found or unauthorized');
    }

    const { title, category, date, duration, caloriesBurned, notes, tags, exercises } = req.body;

    if (title) workout.title = title;
    if (category) workout.category = category;
    if (date) workout.date = new Date(date);
    if (duration !== undefined) workout.duration = Number(duration);
    if (caloriesBurned !== undefined) workout.caloriesBurned = Number(caloriesBurned);
    if (notes !== undefined) workout.notes = notes;
    if (tags) workout.tags = tags;
    if (exercises) workout.exercises = exercises;

    const updated = await workout.save();
    return ApiResponse.success(res, 'Workout updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) {
      return ApiResponse.notFound(res, 'Workout not found or unauthorized');
    }
    return ApiResponse.success(res, 'Workout deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get workout statistics summary
// @route   GET /api/workouts/stats/summary
// @access  Private
const getWorkoutStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalWorkouts = await Workout.countDocuments({ user: userId });

    const categoryAggregation = await Workout.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalDuration: { $sum: '$duration' }, totalCalories: { $sum: '$caloriesBurned' } } }
    ]);

    // Past 7 days volume & workouts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWorkouts = await Workout.find({
      user: userId,
      date: { $gte: sevenDaysAgo }
    }).sort('date');

    const totalVolumeResult = await Workout.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalVol: { $sum: '$totalVolume' }, totalMins: { $sum: '$duration' }, totalCals: { $sum: '$caloriesBurned' } } }
    ]);

    return ApiResponse.success(res, 'Workout statistics computed', {
      totalWorkouts,
      categoryDistribution: categoryAggregation,
      recentWeeklyWorkouts: recentWorkouts,
      totals: totalVolumeResult[0] || { totalVol: 0, totalMins: 0, totalCals: 0 }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
};
