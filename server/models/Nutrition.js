const mongoose = require('mongoose');
const { MEAL_TYPES } = require('../config/constants');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  servingSize: {
    type: String,
    default: '1 serving'
  },
  quantity: {
    type: Number,
    min: [0.1, 'Quantity must be at least 0.1'],
    default: 1
  },
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative'],
    required: [true, 'Calories count is required']
  },
  protein: {
    type: Number, // in grams
    min: [0, 'Protein cannot be negative'],
    default: 0
  },
  carbs: {
    type: Number, // in grams
    min: [0, 'Carbohydrates cannot be negative'],
    default: 0
  },
  fat: {
    type: Number, // in grams
    min: [0, 'Fat cannot be negative'],
    default: 0
  }
});

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    mealType: {
      type: String,
      enum: MEAL_TYPES,
      required: [true, 'Meal type is required'],
      index: true
    },
    foods: [foodItemSchema],
    totalCalories: {
      type: Number,
      default: 0
    },
    totalProtein: {
      type: Number,
      default: 0
    },
    totalCarbs: {
      type: Number,
      default: 0
    },
    totalFat: {
      type: Number,
      default: 0
    },
    waterMl: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

nutritionSchema.pre('save', function (next) {
  let cal = 0;
  let pro = 0;
  let carb = 0;
  let fat = 0;

  if (this.foods && this.foods.length > 0) {
    this.foods.forEach((item) => {
      const q = item.quantity || 1;
      cal += (item.calories || 0) * q;
      pro += (item.protein || 0) * q;
      carb += (item.carbs || 0) * q;
      fat += (item.fat || 0) * q;
    });
  }

  this.totalCalories = Math.round(cal);
  this.totalProtein = Math.round(pro * 10) / 10;
  this.totalCarbs = Math.round(carb * 10) / 10;
  this.totalFat = Math.round(fat * 10) / 10;
  next();
});

module.exports = mongoose.model('Nutrition', nutritionSchema);
