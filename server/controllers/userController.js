const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      age,
      height,
      weight,
      bio,
      fitnessGoal,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      targetWater,
      preferences,
      avatar
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (name) user.name = name.trim();
    if (gender) user.gender = gender;
    if (age !== undefined) user.age = Number(age);
    if (height !== undefined) user.height = Number(height);
    if (weight !== undefined) user.weight = Number(weight);
    if (bio !== undefined) user.bio = bio.trim();
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;
    if (targetCalories !== undefined) user.targetCalories = Number(targetCalories);
    if (targetProtein !== undefined) user.targetProtein = Number(targetProtein);
    if (targetCarbs !== undefined) user.targetCarbs = Number(targetCarbs);
    if (targetFat !== undefined) user.targetFat = Number(targetFat);
    if (targetWater !== undefined) user.targetWater = Number(targetWater);
    if (avatar !== undefined) user.avatar = avatar;

    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences
      };
    }

    const updatedUser = await user.save();
    return ApiResponse.success(res, 'Profile updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'No image file uploaded');
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    return ApiResponse.success(res, 'Avatar uploaded successfully', { avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences (Units, Theme, Notifications)
// @route   PUT /api/users/preferences
// @access  Private
const updatePreferences = async (req, res, next) => {
  try {
    const { units, theme, notifications } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (units) {
      user.preferences.units = { ...user.preferences.units.toObject(), ...units };
    }
    if (theme) {
      user.preferences.theme = theme;
    }
    if (notifications) {
      user.preferences.notifications = { ...user.preferences.notifications.toObject(), ...notifications };
    }

    const updatedUser = await user.save();
    return ApiResponse.success(res, 'Preferences updated successfully', updatedUser.preferences);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  uploadAvatar,
  updatePreferences
};
