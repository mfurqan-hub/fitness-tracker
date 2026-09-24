const mongoose = require('mongoose');
const { WORKOUT_CATEGORIES } = require('../config/constants');

const exerciseSetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'Strength'
  },
  sets: {
    type: Number,
    min: [1, 'Sets must be at least 1'],
    default: 3
  },
  reps: {
    type: Number,
    min: [0, 'Reps cannot be negative'],
    default: 10
  },
  weight: {
    type: Number, // in kg
    min: [0, 'Weight cannot be negative'],
    default: 0
  },
  duration: {
    type: Number, // in minutes (for cardio/timed exercises)
    min: [0, 'Duration cannot be negative'],
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Workout title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    category: {
      type: String,
      enum: WORKOUT_CATEGORIES,
      default: 'Strength',
      index: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Workout duration is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    caloriesBurned: {
      type: Number,
      min: [0, 'Calories burned cannot be negative'],
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    exercises: [exerciseSetSchema],
    totalVolume: {
      type: Number, // computed: sum of sets * reps * weight
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Pre-save calculation for total volume and estimated calories if not supplied
workoutSchema.pre('save', function (next) {
  let volume = 0;
  if (this.exercises && this.exercises.length > 0) {
    this.exercises.forEach((ex) => {
      volume += (ex.sets || 0) * (ex.reps || 0) * (ex.weight || 0);
    });
  }
  this.totalVolume = volume;

  // Auto-estimate calories burned if 0 based on category & duration
  if (!this.caloriesBurned || this.caloriesBurned === 0) {
    const ratePerMinute = {
      Strength: 6.5,
      Cardio: 10.0,
      HIIT: 12.0,
      Flexibility: 3.5,
      Sports: 8.5,
      Other: 6.0
    };
    const rate = ratePerMinute[this.category] || 6.0;
    this.caloriesBurned = Math.round(this.duration * rate);
  }
  next();
});

module.exports = mongoose.model('Workout', workoutSchema);
