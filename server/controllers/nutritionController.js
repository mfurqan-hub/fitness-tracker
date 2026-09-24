const Nutrition = require('../models/Nutrition');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get nutrition logs for a given date or range
// @route   GET /api/nutrition
// @access  Private
const getNutritionLogs = async (req, res, next) => {
  try {
    const { date, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await Nutrition.find(query).sort('date');

    // Aggregate totals for the selected period
    let totalCal = 0;
    let totalPro = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let totalWater = 0;

    logs.forEach((log) => {
      totalCal += log.totalCalories || 0;
      totalPro += log.totalProtein || 0;
      totalCarb += log.totalCarbs || 0;
      totalFat += log.totalFat || 0;
      totalWater += log.waterMl || 0;
    });

    return ApiResponse.success(res, 'Nutrition logs retrieved', {
      logs,
      totals: {
        calories: totalCal,
        protein: Math.round(totalPro * 10) / 10,
        carbs: Math.round(totalCarb * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        waterMl: totalWater
      },
      targets: {
        calories: req.user.targetCalories || 2000,
        protein: req.user.targetProtein || 150,
        carbs: req.user.targetCarbs || 200,
        fat: req.user.targetFat || 65,
        waterMl: req.user.targetWater || 2500
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a meal log entry
// @route   POST /api/nutrition
// @access  Private
const addMealLog = async (req, res, next) => {
  try {
    const { mealType, date, foods, waterMl, notes } = req.body;

    const log = await Nutrition.create({
      user: req.user._id,
      mealType,
      date: date ? new Date(date) : new Date(),
      foods: foods || [],
      waterMl: waterMl ? Number(waterMl) : 0,
      notes: notes || ''
    });

    return ApiResponse.created(res, 'Meal logged successfully', log);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meal log entry
// @route   PUT /api/nutrition/:id
// @access  Private
const updateMealLog = async (req, res, next) => {
  try {
    const log = await Nutrition.findOne({ _id: req.params.id, user: req.user._id });
    if (!log) {
      return ApiResponse.notFound(res, 'Nutrition log not found or unauthorized');
    }

    const { mealType, date, foods, waterMl, notes } = req.body;

    if (mealType) log.mealType = mealType;
    if (date) log.date = new Date(date);
    if (foods) log.foods = foods;
    if (waterMl !== undefined) log.waterMl = Number(waterMl);
    if (notes !== undefined) log.notes = notes;

    const updated = await log.save();
    return ApiResponse.success(res, 'Meal log updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal log entry
// @route   DELETE /api/nutrition/:id
// @access  Private
const deleteMealLog = async (req, res, next) => {
  try {
    const log = await Nutrition.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) {
      return ApiResponse.notFound(res, 'Nutrition log not found or unauthorized');
    }
    return ApiResponse.success(res, 'Meal log deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Log quick water intake
// @route   POST /api/nutrition/water
// @access  Private
const logWater = async (req, res, next) => {
  try {
    const { amountMl, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find first log of the day or create a snacks water entry
    let log = await Nutrition.findOne({
      user: req.user._id,
      date: { $gte: targetDate, $lte: endOfDay }
    });

    if (log) {
      log.waterMl = (log.waterMl || 0) + Number(amountMl || 250);
      await log.save();
    } else {
      log = await Nutrition.create({
        user: req.user._id,
        mealType: 'Snacks',
        date: new Date(),
        foods: [],
        waterMl: Number(amountMl || 250)
      });
    }

    return ApiResponse.success(res, 'Water intake logged', { waterMl: log.waterMl });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNutritionLogs,
  addMealLog,
  updateMealLog,
  deleteMealLog,
  logWater
};
