const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all user goals (supports status filter: active, completed, failed)
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const goals = await Goal.find(query).sort('-createdAt');
    return ApiResponse.success(res, 'Goals retrieved successfully', goals);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res, next) => {
  try {
    const { title, type, startingValue, currentValue, targetValue, unit, startDate, targetDate } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      type: type || 'weight_loss',
      startingValue: Number(startingValue),
      currentValue: currentValue !== undefined ? Number(currentValue) : Number(startingValue),
      targetValue: Number(targetValue),
      unit: unit || 'kg',
      startDate: startDate ? new Date(startDate) : new Date(),
      targetDate: new Date(targetDate)
    });

    return ApiResponse.created(res, 'Fitness goal created successfully', goal);
  } catch (error) {
    next(error);
  }
};

// @desc    Update goal or progress
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return ApiResponse.notFound(res, 'Goal not found or unauthorized');
    }

    const { title, type, startingValue, currentValue, targetValue, unit, targetDate, status } = req.body;

    if (title) goal.title = title.trim();
    if (type) goal.type = type;
    if (startingValue !== undefined) goal.startingValue = Number(startingValue);
    if (currentValue !== undefined) goal.currentValue = Number(currentValue);
    if (targetValue !== undefined) goal.targetValue = Number(targetValue);
    if (unit) goal.unit = unit;
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (status) goal.status = status;

    const updated = await goal.save();

    // Trigger notification if newly completed
    if (updated.status === 'completed' && !updated.isCompletedNotified) {
      updated.isCompletedNotified = true;
      await updated.save();

      await Notification.create({
        user: req.user._id,
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You successfully reached your goal: "${updated.title}"!`,
        type: 'goal_achieved',
        actionUrl: '/goals'
      });
    }

    return ApiResponse.success(res, 'Goal updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return ApiResponse.notFound(res, 'Goal not found or unauthorized');
    }
    return ApiResponse.success(res, 'Goal removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
