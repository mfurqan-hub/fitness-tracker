const mongoose = require('mongoose');
const {
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
  DIFFICULTIES
} = require('../config/constants');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Exercise name cannot exceed 100 characters']
    },
    category: {
      type: String,
      enum: EXERCISE_CATEGORIES,
      default: 'Strength',
      index: true
    },
    muscleGroup: {
      type: String,
      enum: MUSCLE_GROUPS,
      required: [true, 'Primary muscle group is required'],
      index: true
    },
    secondaryMuscles: [
      {
        type: String,
        enum: MUSCLE_GROUPS
      }
    ],
    equipment: {
      type: String,
      enum: [
        'Barbell',
        'Dumbbell',
        'Machine',
        'Cable',
        'Bodyweight',
        'Kettlebell',
        'Resistance Band',
        'Cardio Machine',
        'None',
        'Other'
      ],
      default: 'Bodyweight'
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'Beginner'
    },
    instructions: [
      {
        type: String,
        trim: true
      }
    ],
    tips: [
      {
        type: String,
        trim: true
      }
    ],
    imageUrl: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
