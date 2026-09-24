const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
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
    weight: {
      type: Number, // kg
      required: [true, 'Weight is required'],
      min: [20, 'Weight must be at least 20 kg'],
      max: [400, 'Weight cannot exceed 400 kg']
    },
    bodyFat: {
      type: Number, // percentage
      min: [1, 'Body fat percentage must be at least 1%'],
      max: [70, 'Body fat percentage cannot exceed 70%'],
      default: null
    },
    muscleMass: {
      type: Number, // kg
      default: null
    },
    measurements: {
      chest: { type: Number, default: null }, // cm
      waist: { type: Number, default: null },
      hips: { type: Number, default: null },
      arms: { type: Number, default: null },
      thighs: { type: Number, default: null },
      calves: { type: Number, default: null },
      shoulders: { type: Number, default: null },
      neck: { type: Number, default: null }
    },
    performanceMetrics: {
      restingHeartRate: { type: Number, default: null }, // bpm
      vo2Max: { type: Number, default: null },
      benchPressMax: { type: Number, default: null }, // kg
      squatMax: { type: Number, default: null },
      deadliftMax: { type: Number, default: null },
      fiveKmRunTimeMin: { type: Number, default: null }
    },
    photos: [
      {
        url: String,
        label: { type: String, enum: ['front', 'side', 'back', 'other'], default: 'front' }
      }
    ],
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

// Keep latest progress updated on the user profile
progressSchema.post('save', async function () {
  try {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.user, { weight: this.weight });
  } catch (err) {
    // Ignore non-fatal update
  }
});

module.exports = mongoose.model('Progress', progressSchema);
