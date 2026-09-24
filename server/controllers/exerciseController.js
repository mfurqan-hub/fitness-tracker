const Exercise = require('../models/Exercise');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all exercises (supports muscleGroup, category, equipment, difficulty filter, search)
// @route   GET /api/exercises
// @access  Public / Private
const getExercises = async (req, res, next) => {
  try {
    const { muscleGroup, category, equipment, difficulty, search } = req.query;

    const query = {};

    if (muscleGroup && muscleGroup !== 'All') {
      query.$or = [{ muscleGroup: muscleGroup }, { secondaryMuscles: muscleGroup }];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (equipment && equipment !== 'All') {
      query.equipment = equipment;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(query).sort('name');
    return ApiResponse.success(res, 'Exercises fetched successfully', exercises);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exercise by ID
// @route   GET /api/exercises/:id
// @access  Public / Private
const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return ApiResponse.notFound(res, 'Exercise not found');
    }
    return ApiResponse.success(res, 'Exercise details retrieved', exercise);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new exercise (Admin or Custom User Exercise)
// @route   POST /api/exercises
// @access  Private
const createExercise = async (req, res, next) => {
  try {
    const { name, category, muscleGroup, secondaryMuscles, equipment, difficulty, instructions, tips, imageUrl } = req.body;

    const existing = await Exercise.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) {
      return ApiResponse.conflict(res, 'An exercise with this name already exists in the library.');
    }

    const isCustom = req.user.role !== 'admin';
    const exercise = await Exercise.create({
      name: name.trim(),
      category: category || 'Strength',
      muscleGroup,
      secondaryMuscles: secondaryMuscles || [],
      equipment: equipment || 'Bodyweight',
      difficulty: difficulty || 'Beginner',
      instructions: instructions || [],
      tips: tips || [],
      imageUrl: imageUrl || '',
      isCustom,
      createdBy: isCustom ? req.user._id : null
    });

    return ApiResponse.created(res, 'Exercise created successfully', exercise);
  } catch (error) {
    next(error);
  }
};

// @desc    Update exercise (Admin or owner)
// @route   PUT /api/exercises/:id
// @access  Private (Admin or Custom Creator)
const updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return ApiResponse.notFound(res, 'Exercise not found');
    }

    // Role check: If not admin and not creator, deny
    if (req.user.role !== 'admin' && (!exercise.createdBy || exercise.createdBy.toString() !== req.user._id.toString())) {
      return ApiResponse.forbidden(res, 'You are not authorized to modify this exercise.');
    }

    const { name, category, muscleGroup, secondaryMuscles, equipment, difficulty, instructions, tips, imageUrl } = req.body;

    if (name) exercise.name = name.trim();
    if (category) exercise.category = category;
    if (muscleGroup) exercise.muscleGroup = muscleGroup;
    if (secondaryMuscles) exercise.secondaryMuscles = secondaryMuscles;
    if (equipment) exercise.equipment = equipment;
    if (difficulty) exercise.difficulty = difficulty;
    if (instructions) exercise.instructions = instructions;
    if (tips) exercise.tips = tips;
    if (imageUrl !== undefined) exercise.imageUrl = imageUrl;

    const updated = await exercise.save();
    return ApiResponse.success(res, 'Exercise updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exercise (Admin only or custom owner)
// @route   DELETE /api/exercises/:id
// @access  Private
const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return ApiResponse.notFound(res, 'Exercise not found');
    }

    if (req.user.role !== 'admin' && (!exercise.createdBy || exercise.createdBy.toString() !== req.user._id.toString())) {
      return ApiResponse.forbidden(res, 'You are not authorized to delete this exercise.');
    }

    await Exercise.findByIdAndDelete(req.params.id);
    return ApiResponse.success(res, 'Exercise deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
};
