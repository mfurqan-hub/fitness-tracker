const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    userEmail: {
      type: String,
      default: ''
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error'],
      default: 'info',
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SystemLog', systemLogSchema);
