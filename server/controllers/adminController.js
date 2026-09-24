const User = require('../models/User');
const Workout = require('../models/Workout');
const Nutrition = require('../models/Nutrition');
const SupportTicket = require('../models/SupportTicket');
const SystemLog = require('../models/SystemLog');
const Exercise = require('../models/Exercise');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get Admin Overview Statistics
// @route   GET /api/admin/overview
// @access  Private/Admin
const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalWorkouts = await Workout.countDocuments();
    const totalNutritionLogs = await Nutrition.countDocuments();
    const totalExercises = await Exercise.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } });

    // Registrations over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.find().sort('-createdAt').limit(8).select('-password');
    const recentTickets = await SupportTicket.find().sort('-updatedAt').limit(5).populate('user', 'name email');
    const recentLogs = await SystemLog.find().sort('-createdAt').limit(10);

    return ApiResponse.success(res, 'Admin overview metrics retrieved', {
      stats: {
        totalUsers,
        activeUsers,
        totalWorkouts,
        totalNutritionLogs,
        totalExercises,
        openTickets
      },
      recentUsers,
      recentTickets,
      recentLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, role filter, pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 15 } = req.query;

    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status) {
      query.isActive = status === 'active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    return ApiResponse.success(res, 'Users list retrieved', users, 200, {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (activate/suspend/change role)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    // Protect against self-deactivation or self-demotion
    if (user._id.toString() === req.user._id.toString() && isActive === false) {
      return ApiResponse.badRequest(res, 'You cannot deactivate your own administrative account.');
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;

    await user.save();

    await SystemLog.create({
      action: 'ADMIN_USER_UPDATE',
      user: req.user._id,
      userEmail: req.user.email,
      details: { targetUserId: user._id, targetEmail: user.email, isActive, role },
      severity: 'warning'
    });

    return ApiResponse.success(res, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user and associated records
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (user._id.toString() === req.user._id.toString()) {
      return ApiResponse.badRequest(res, 'Cannot delete yourself');
    }

    // Cascade delete user data
    await Promise.all([
      Workout.deleteMany({ user: user._id }),
      Nutrition.deleteMany({ user: user._id }),
      SupportTicket.deleteMany({ user: user._id }),
      User.findByIdAndDelete(user._id)
    ]);

    await SystemLog.create({
      action: 'ADMIN_USER_DELETE',
      user: req.user._id,
      userEmail: req.user.email,
      details: { deletedEmail: user.email },
      severity: 'warning'
    });

    return ApiResponse.success(res, 'User and all related data purged successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getSystemLogs = async (req, res, next) => {
  try {
    const { severity, limit = 50 } = req.query;
    const query = {};
    if (severity) query.severity = severity;

    const logs = await SystemLog.find(query).sort('-createdAt').limit(Number(limit));
    return ApiResponse.success(res, 'System logs retrieved', logs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform system settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSystemSettings = async (req, res, next) => {
  try {
    const SystemSetting = require('../models/SystemSetting');
    let settings = await SystemSetting.findOne({ key: 'platform_config' });
    if (!settings) {
      settings = await SystemSetting.create({ key: 'platform_config' });
    }
    return ApiResponse.success(res, 'System settings retrieved', settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform system settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSystemSettings = async (req, res, next) => {
  try {
    const SystemSetting = require('../models/SystemSetting');
    const { allowUserRegistration, maintenanceMode, emailNotifications, maxDailyWorkouts, rateLimitPerMinute, systemNotice } = req.body;

    let settings = await SystemSetting.findOne({ key: 'platform_config' });
    if (!settings) {
      settings = new SystemSetting({ key: 'platform_config' });
    }

    if (allowUserRegistration !== undefined) settings.allowUserRegistration = allowUserRegistration;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
    if (maxDailyWorkouts !== undefined) settings.maxDailyWorkouts = maxDailyWorkouts;
    if (rateLimitPerMinute !== undefined) settings.rateLimitPerMinute = rateLimitPerMinute;
    if (systemNotice !== undefined) settings.systemNotice = systemNotice;
    settings.updatedBy = req.user._id;

    await settings.save();

    await SystemLog.create({
      action: 'ADMIN_SETTINGS_UPDATE',
      user: req.user._id,
      userEmail: req.user.email,
      details: { allowUserRegistration, maintenanceMode, emailNotifications, systemNotice },
      severity: 'info'
    });

    return ApiResponse.success(res, 'System settings updated successfully', settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminOverview,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getSystemLogs,
  getSystemSettings,
  updateSystemSettings
};

