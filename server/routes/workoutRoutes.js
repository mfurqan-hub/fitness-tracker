const express = require('express');
const router = express.Router();
const {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');
const { validateWorkout } = require('../validators/resourceValidators');

router.use(protect);

router.get('/stats/summary', getWorkoutStats);
router.route('/')
  .get(getWorkouts)
  .post(validateWorkout, createWorkout);

router.route('/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

module.exports = router;
