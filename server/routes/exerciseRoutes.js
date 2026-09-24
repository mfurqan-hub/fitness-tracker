const express = require('express');
const router = express.Router();
const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getExercises);
router.get('/:id', getExerciseById);

// Protected routes (Admin or Custom User Exercise)
router.post('/', protect, createExercise);
router.put('/:id', protect, updateExercise);
router.delete('/:id', protect, deleteExercise);

module.exports = router;
