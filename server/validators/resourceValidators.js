const ApiResponse = require('../utils/apiResponse');

const validateWorkout = (req, res, next) => {
  const { title, duration, category } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Workout title is required.');
  }

  if (duration === undefined || duration === null || Number(duration) <= 0) {
    errors.push('Duration must be a positive number of minutes.');
  }

  if (errors.length > 0) {
    return ApiResponse.unprocessable(res, 'Validation failed for workout.', errors);
  }

  next();
};

const validateNutrition = (req, res, next) => {
  const { mealType, foods } = req.body;
  const errors = [];

  if (!mealType) {
    errors.push('Meal type (Breakfast, Lunch, Dinner, Snacks) is required.');
  }

  if (!foods || !Array.isArray(foods) || foods.length === 0) {
    errors.push('At least one food item must be included in the meal entry.');
  }

  if (errors.length > 0) {
    return ApiResponse.unprocessable(res, 'Validation failed for nutrition log.', errors);
  }

  next();
};

const validateGoal = (req, res, next) => {
  const { title, type, startingValue, targetValue, targetDate } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Goal title is required.');
  }

  if (!type) {
    errors.push('Goal type is required.');
  }

  if (startingValue === undefined || isNaN(Number(startingValue))) {
    errors.push('Starting value is required and must be a number.');
  }

  if (targetValue === undefined || isNaN(Number(targetValue))) {
    errors.push('Target value is required and must be a number.');
  }

  if (!targetDate) {
    errors.push('Target date is required.');
  }

  if (errors.length > 0) {
    return ApiResponse.unprocessable(res, 'Validation failed for goal.', errors);
  }

  next();
};

module.exports = {
  validateWorkout,
  validateNutrition,
  validateGoal
};
