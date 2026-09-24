const Reminder = require('../models/Reminder');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get user reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort('time');
    return ApiResponse.success(res, 'Reminders retrieved', reminders);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res, next) => {
  try {
    const { title, type, time, days, isActive } = req.body;

    const reminder = await Reminder.create({
      user: req.user._id,
      title: title.trim(),
      type: type || 'workout',
      time,
      days: days || ['Mon', 'Wed', 'Fri'],
      isActive: isActive !== undefined ? isActive : true
    });

    return ApiResponse.created(res, 'Reminder created successfully', reminder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update reminder / toggle active status
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return ApiResponse.notFound(res, 'Reminder not found');
    }

    const { title, type, time, days, isActive } = req.body;

    if (title) reminder.title = title.trim();
    if (type) reminder.type = type;
    if (time) reminder.time = time;
    if (days) reminder.days = days;
    if (isActive !== undefined) reminder.isActive = isActive;

    const updated = await reminder.save();
    return ApiResponse.success(res, 'Reminder updated', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reminder) {
      return ApiResponse.notFound(res, 'Reminder not found');
    }
    return ApiResponse.success(res, 'Reminder deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
};
