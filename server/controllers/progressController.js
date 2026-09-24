const Progress = require('../models/Progress');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all progress / body measurement entries
// @route   GET /api/progress
// @access  Private
const getProgressHistory = async (req, res, next) => {
  try {
    const { timeRange = 'all' } = req.query; // '1w', '1m', '3m', '1y', 'all'
    const query = { user: req.user._id };

    if (timeRange !== 'all') {
      const dateLimit = new Date();
      if (timeRange === '1w') dateLimit.setDate(dateLimit.getDate() - 7);
      else if (timeRange === '1m') dateLimit.setMonth(dateLimit.getMonth() - 1);
      else if (timeRange === '3m') dateLimit.setMonth(dateLimit.getMonth() - 3);
      else if (timeRange === '1y') dateLimit.setFullYear(dateLimit.getFullYear() - 1);

      query.date = { $gte: dateLimit };
    }

    const records = await Progress.find(query).sort('date');
    return ApiResponse.success(res, 'Progress records retrieved', records);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new progress entry
// @route   POST /api/progress
// @access  Private
const addProgress = async (req, res, next) => {
  try {
    const {
      date,
      weight,
      bodyFat,
      muscleMass,
      measurements,
      performanceMetrics,
      photos,
      notes
    } = req.body;

    if (!weight) {
      return ApiResponse.badRequest(res, 'Body weight is required.');
    }

    const progress = await Progress.create({
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      weight: Number(weight),
      bodyFat: bodyFat ? Number(bodyFat) : null,
      muscleMass: muscleMass ? Number(muscleMass) : null,
      measurements: measurements || {},
      performanceMetrics: performanceMetrics || {},
      photos: photos || [],
      notes: notes || ''
    });

    return ApiResponse.created(res, 'Progress entry recorded successfully', progress);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing progress entry
// @route   PUT /api/progress/:id
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const record = await Progress.findOne({ _id: req.params.id, user: req.user._id });
    if (!record) {
      return ApiResponse.notFound(res, 'Progress record not found or unauthorized');
    }

    const {
      date,
      weight,
      bodyFat,
      muscleMass,
      measurements,
      performanceMetrics,
      photos,
      notes
    } = req.body;

    if (date) record.date = new Date(date);
    if (weight !== undefined) record.weight = Number(weight);
    if (bodyFat !== undefined) record.bodyFat = bodyFat ? Number(bodyFat) : null;
    if (muscleMass !== undefined) record.muscleMass = muscleMass ? Number(muscleMass) : null;
    if (measurements !== undefined) record.measurements = measurements;
    if (performanceMetrics !== undefined) record.performanceMetrics = performanceMetrics;
    if (photos !== undefined) record.photos = photos;
    if (notes !== undefined) record.notes = notes;

    const updated = await record.save();
    return ApiResponse.success(res, 'Progress entry updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a progress entry
// @route   DELETE /api/progress/:id
// @access  Private
const deleteProgress = async (req, res, next) => {
  try {
    const record = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!record) {
      return ApiResponse.notFound(res, 'Progress record not found or unauthorized');
    }
    return ApiResponse.success(res, 'Progress entry removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgressHistory,
  addProgress,
  updateProgress,
  deleteProgress
};
