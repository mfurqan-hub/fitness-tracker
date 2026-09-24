const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'platform_config'
    },
    allowUserRegistration: {
      type: Boolean,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    maxDailyWorkouts: {
      type: Number,
      default: 10,
      min: 1,
      max: 50
    },
    rateLimitPerMinute: {
      type: Number,
      default: 100,
      min: 10,
      max: 1000
    },
    systemNotice: {
      type: String,
      trim: true,
      default: ''
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
