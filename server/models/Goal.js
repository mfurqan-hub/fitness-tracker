const mongoose = require('mongoose');
const { GOAL_TYPES, GOAL_STATUSES } = require('../config/constants');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    type: {
      type: String,
      enum: GOAL_TYPES,
      default: 'weight_loss'
    },
    startingValue: {
      type: Number,
      required: [true, 'Starting value is required']
    },
    currentValue: {
      type: Number,
      required: [true, 'Current value is required']
    },
    targetValue: {
      type: Number,
      required: [true, 'Target value is required']
    },
    unit: {
      type: String,
      default: 'kg'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required']
    },
    status: {
      type: String,
      enum: GOAL_STATUSES,
      default: 'active',
      index: true
    },
    progressPercent: {
      type: Number,
      default: 0
    },
    isCompletedNotified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

goalSchema.pre('save', function (next) {
  if (this.startingValue !== undefined && this.targetValue !== undefined && this.currentValue !== undefined) {
    const totalDiff = Math.abs(this.targetValue - this.startingValue);
    if (totalDiff === 0) {
      this.progressPercent = 100;
    } else {
      const currentDiff = Math.abs(this.currentValue - this.startingValue);
      let pct = (currentDiff / totalDiff) * 100;
      this.progressPercent = Math.min(100, Math.max(0, Math.round(pct)));
    }

    if (this.progressPercent >= 100) {
      this.status = 'completed';
    } else if (new Date() > new Date(this.targetDate) && this.status === 'active') {
      this.status = 'failed';
    }
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
