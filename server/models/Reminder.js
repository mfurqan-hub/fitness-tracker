const mongoose = require('mongoose');
const { REMINDER_TYPES } = require('../config/constants');

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: REMINDER_TYPES,
      default: 'workout'
    },
    time: {
      type: String, // e.g. "07:30" (24hr)
      required: [true, 'Reminder time is required']
    },
    days: [
      {
        type: String,
        enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        default: ['Mon', 'Wed', 'Fri']
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);
