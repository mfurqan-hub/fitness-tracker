const express = require('express');
const router = express.Router();
const {
  getProgressHistory,
  addProgress,
  updateProgress,
  deleteProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProgressHistory)
  .post(addProgress);

router.route('/:id')
  .put(updateProgress)
  .delete(deleteProgress);

module.exports = router;
