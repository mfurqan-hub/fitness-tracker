const express = require('express');
const router = express.Router();
const {
  getNutritionLogs,
  addMealLog,
  updateMealLog,
  deleteMealLog,
  logWater
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');
const { validateNutrition } = require('../validators/resourceValidators');

router.use(protect);

router.post('/water', logWater);

router.route('/')
  .get(getNutritionLogs)
  .post(validateNutrition, addMealLog);

router.route('/:id')
  .put(updateMealLog)
  .delete(deleteMealLog);

module.exports = router;
