const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const { validateGoal } = require('../validators/resourceValidators');

router.use(protect);

router.route('/')
  .get(getGoals)
  .post(validateGoal, createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
