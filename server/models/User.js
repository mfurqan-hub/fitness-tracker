const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    username: {
      type: String,
      required: [true, 'Please provide a unique username'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [
        function () {
          return this.authProvider === 'local';
        },
        'Please provide a password'
      ],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    firebaseUid: {
      type: String,
      default: null,
      sparse: true,
      index: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false
    },
    emailOtp: {
      type: String,
      default: null,
      select: false
    },
    emailOtpExpires: {
      type: Date,
      default: null,
      select: false
    },
    emailOtpAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    passwordResetTokenHash: {
      type: String,
      default: null,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'other', 'prefer-not-to-say'],
      default: 'prefer-not-to-say'
    },
    age: {
      type: Number,
      min: [10, 'Age must be at least 10'],
      max: [120, 'Age cannot exceed 120'],
      default: null
    },
    height: {
      type: Number, // Stored in cm
      min: [50, 'Height must be at least 50 cm'],
      max: [280, 'Height cannot exceed 280 cm'],
      default: null
    },
    weight: {
      type: Number, // Stored in kg
      min: [20, 'Weight must be at least 20 kg'],
      max: [400, 'Weight cannot exceed 400 kg'],
      default: null
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: ''
    },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'endurance', 'maintenance', 'flexibility', 'overall_health'],
      default: 'overall_health'
    },
    targetCalories: {
      type: Number,
      default: 2000
    },
    targetProtein: {
      type: Number,
      default: 150
    },
    targetCarbs: {
      type: Number,
      default: 200
    },
    targetFat: {
      type: Number,
      default: 65
    },
    targetWater: {
      type: Number, // in ml
      default: 2500
    },
    preferences: {
      units: {
        weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
        height: { type: String, enum: ['cm', 'ft'], default: 'cm' },
        distance: { type: String, enum: ['km', 'miles'], default: 'km' }
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'dark'
      },
      notifications: {
        workoutReminders: { type: Boolean, default: true },
        mealReminders: { type: Boolean, default: true },
        goalCelebrations: { type: Boolean, default: true },
        systemAnnouncements: { type: Boolean, default: true }
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
