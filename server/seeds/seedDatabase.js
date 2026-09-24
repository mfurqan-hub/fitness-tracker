const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const Nutrition = require('../models/Nutrition');
const Progress = require('../models/Progress');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const Reminder = require('../models/Reminder');
const SupportTicket = require('../models/SupportTicket');
const SystemLog = require('../models/SystemLog');
const initialExercises = require('./initialExercises');
const logger = require('../utils/logger');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedAll = async () => {
  try {
    logger.info('Clearing old database collections...');
    await Promise.all([
      User.deleteMany({}),
      Workout.deleteMany({}),
      Exercise.deleteMany({}),
      Nutrition.deleteMany({}),
      Progress.deleteMany({}),
      Goal.deleteMany({}),
      Notification.deleteMany({}),
      Reminder.deleteMany({}),
      SupportTicket.deleteMany({}),
      SystemLog.deleteMany({})
    ]);

    logger.info('Creating demo & admin users...');
    const adminUser = await User.create({
      name: 'Admin Chief',
      username: 'admin',
      email: 'admin@fitnesstracker.com',
      password: 'Admin123!',
      role: 'admin',
      gender: 'male',
      age: 28,
      height: 180,
      weight: 78,
      bio: 'Fitness Tracker System Administrator & Head Coach.',
      fitnessGoal: 'muscle_gain',
      targetCalories: 2600,
      targetProtein: 180,
      targetCarbs: 280,
      targetFat: 75,
      preferences: {
        units: { weight: 'kg', height: 'cm', distance: 'km' },
        theme: 'dark'
      }
    });

    const demoUser = await User.create({
      name: 'Alex Johnson',
      username: 'alexj',
      email: 'demo@fitnesstracker.com',
      password: 'Password123!',
      role: 'user',
      gender: 'male',
      age: 24,
      height: 178,
      weight: 75.5,
      bio: 'Passionate about bodybuilding, HIIT cardio, and clean nutrition!',
      fitnessGoal: 'muscle_gain',
      targetCalories: 2400,
      targetProtein: 165,
      targetCarbs: 240,
      targetFat: 65,
      preferences: {
        units: { weight: 'kg', height: 'cm', distance: 'km' },
        theme: 'dark'
      }
    });

    logger.info('Inserting exercise library...');
    await Exercise.insertMany(initialExercises);

    logger.info('Generating sample realistic workouts...');
    const now = new Date();
    const workoutsData = [
      {
        user: demoUser._id,
        title: 'Upper Body Power & Hypertrophy',
        category: 'Strength',
        date: new Date(now.getTime() - 1 * 86400000),
        duration: 65,
        caloriesBurned: 480,
        notes: 'Crushed bench press sets! Felt energetic after healthy carb meal.',
        tags: ['Chest', 'Back', 'Strength', 'Push-Pull'],
        exercises: [
          { name: 'Barbell Bench Press', category: 'Strength', sets: 4, reps: 8, weight: 85, duration: 0, notes: 'Solid paused reps at chest' },
          { name: 'Incline Dumbbell Press', category: 'Strength', sets: 3, reps: 10, weight: 30, duration: 0, notes: 'Felt deep stretch' },
          { name: 'Barbell Bent-Over Row', category: 'Strength', sets: 4, reps: 8, weight: 75, duration: 0, notes: 'Strict form, no swinging' },
          { name: 'Tricep Rope Pushdown', category: 'Strength', sets: 3, reps: 12, weight: 35, duration: 0, notes: 'Squeeze at bottom' }
        ]
      },
      {
        user: demoUser._id,
        title: 'Leg Day & Core Conditioning',
        category: 'Strength',
        date: new Date(now.getTime() - 3 * 86400000),
        duration: 70,
        caloriesBurned: 520,
        notes: 'Heavy squat session followed by calf raises and planks.',
        tags: ['Legs', 'Squat', 'Core'],
        exercises: [
          { name: 'Barbell Back Squat', category: 'Strength', sets: 5, reps: 5, weight: 110, duration: 0, notes: 'Clean parallel depth' },
          { name: 'Romanian Deadlift (RDL)', category: 'Strength', sets: 4, reps: 8, weight: 90, duration: 0, notes: 'Hamstrings on fire' },
          { name: 'Leg Press', category: 'Strength', sets: 3, reps: 12, weight: 180, duration: 0, notes: 'Full range of motion' },
          { name: 'Plank', category: 'Bodyweight', sets: 3, reps: 1, weight: 0, duration: 2, notes: '60s hold per set' }
        ]
      },
      {
        user: demoUser._id,
        title: 'High-Intensity Cardio Blast',
        category: 'HIIT',
        date: new Date(now.getTime() - 5 * 86400000),
        duration: 45,
        caloriesBurned: 510,
        notes: 'Sprint intervals and kettlebell swings for maximum calorie expenditure.',
        tags: ['Cardio', 'HIIT', 'Sweat'],
        exercises: [
          { name: 'Treadmill Interval Running', category: 'HIIT', sets: 8, reps: 1, weight: 0, duration: 15, notes: 'Speed 16 km/h intervals' },
          { name: 'Kettlebell Swing', category: 'HIIT', sets: 4, reps: 20, weight: 24, duration: 0, notes: 'Explosive hip drive' },
          { name: 'Burpees', category: 'HIIT', sets: 4, reps: 15, weight: 0, duration: 0, notes: 'Fast pace' }
        ]
      },
      {
        user: demoUser._id,
        title: 'Full Body Endurance & Core',
        category: 'Sports',
        date: new Date(now.getTime() - 7 * 86400000),
        duration: 50,
        caloriesBurned: 420,
        notes: 'Rowing and bodyweight compound movements.',
        tags: ['FullBody', 'Rowing'],
        exercises: [
          { name: 'Rowing Machine (Ergometer)', category: 'Cardio', sets: 1, reps: 1, weight: 0, duration: 20, notes: '5000m row session' },
          { name: 'Push-Up', category: 'Bodyweight', sets: 4, reps: 25, weight: 0, duration: 0, notes: 'Bodyweight pump' },
          { name: 'Pull-Up', category: 'Bodyweight', sets: 4, reps: 10, weight: 0, duration: 0, notes: 'Controlled tempo' }
        ]
      }
    ];

    for (const w of workoutsData) {
      await Workout.create(w);
    }

    logger.info('Generating sample nutrition logs...');
    const today = new Date();
    const nutritionLogs = [
      {
        user: demoUser._id,
        date: today,
        mealType: 'Breakfast',
        foods: [
          { name: 'Oatmeal with Almond Milk & Berries', servingSize: '1 bowl', quantity: 1, calories: 380, protein: 12, carbs: 62, fat: 8 },
          { name: 'Scrambled Eggs with Spinach', servingSize: '3 eggs', quantity: 1, calories: 240, protein: 21, carbs: 3, fat: 16 },
          { name: 'Black Coffee with Honey', servingSize: '1 cup', quantity: 1, calories: 35, protein: 0, carbs: 9, fat: 0 }
        ],
        waterMl: 600,
        notes: 'Nutritious pre-workout breakfast.'
      },
      {
        user: demoUser._id,
        date: today,
        mealType: 'Lunch',
        foods: [
          { name: 'Grilled Chicken Breast', servingSize: '200g', quantity: 1, calories: 330, protein: 62, carbs: 0, fat: 7 },
          { name: 'Steamed Brown Rice', servingSize: '1.5 cups', quantity: 1, calories: 320, protein: 7, carbs: 68, fat: 2.5 },
          { name: 'Steamed Broccoli & Olive Oil', servingSize: '150g', quantity: 1, calories: 110, protein: 4, carbs: 10, fat: 6 }
        ],
        waterMl: 800,
        notes: 'High protein recovery lunch.'
      },
      {
        user: demoUser._id,
        date: today,
        mealType: 'Snacks',
        foods: [
          { name: 'Whey Protein Shake', servingSize: '1 scoop (30g)', quantity: 1, calories: 140, protein: 26, carbs: 3, fat: 2 },
          { name: 'Banana', servingSize: '1 medium', quantity: 1, calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
        ],
        waterMl: 500,
        notes: 'Post-workout fuel.'
      },
      {
        user: demoUser._id,
        date: today,
        mealType: 'Dinner',
        foods: [
          { name: 'Baked Salmon Fillet', servingSize: '180g', quantity: 1, calories: 380, protein: 39, carbs: 0, fat: 23 },
          { name: 'Sweet Potato Mashed', servingSize: '200g', quantity: 1, calories: 180, protein: 3, carbs: 41, fat: 0.4 },
          { name: 'Mixed Garden Salad', servingSize: '1 bowl', quantity: 1, calories: 95, protein: 2, carbs: 8, fat: 5 }
        ],
        waterMl: 600,
        notes: 'Delicious healthy fats and complex carbs.'
      }
    ];

    for (const n of nutritionLogs) {
      await Nutrition.create(n);
    }

    logger.info('Generating sample body progress tracking...');
    const progressHistory = [
      {
        user: demoUser._id,
        date: new Date(now.getTime() - 60 * 86400000),
        weight: 78.5,
        bodyFat: 17.5,
        muscleMass: 38.0,
        measurements: { chest: 102, waist: 86, hips: 98, arms: 36, thighs: 58, calves: 38, shoulders: 118 },
        performanceMetrics: { restingHeartRate: 64, benchPressMax: 80, squatMax: 100, deadliftMax: 130 },
        notes: 'Starting baseline measurement.'
      },
      {
        user: demoUser._id,
        date: new Date(now.getTime() - 30 * 86400000),
        weight: 77.0,
        bodyFat: 16.2,
        muscleMass: 38.5,
        measurements: { chest: 103, waist: 84, hips: 97, arms: 36.5, thighs: 58.5, calves: 38, shoulders: 119 },
        performanceMetrics: { restingHeartRate: 61, benchPressMax: 85, squatMax: 105, deadliftMax: 137.5 },
        notes: 'Noticing leaner waistline and strength increases.'
      },
      {
        user: demoUser._id,
        date: new Date(now.getTime() - 7 * 86400000),
        weight: 75.8,
        bodyFat: 15.0,
        muscleMass: 39.0,
        measurements: { chest: 104, waist: 82, hips: 96, arms: 37.2, thighs: 59, calves: 38.5, shoulders: 121 },
        performanceMetrics: { restingHeartRate: 58, benchPressMax: 90, squatMax: 115, deadliftMax: 145 },
        notes: 'Consistent nutrition and 4x weekly workouts paying off!'
      },
      {
        user: demoUser._id,
        date: new Date(),
        weight: 75.5,
        bodyFat: 14.6,
        muscleMass: 39.2,
        measurements: { chest: 104.5, waist: 81.5, hips: 95.5, arms: 37.5, thighs: 59.5, calves: 38.5, shoulders: 121.5 },
        performanceMetrics: { restingHeartRate: 56, benchPressMax: 92.5, squatMax: 117.5, deadliftMax: 150 },
        notes: 'Current state: Feeling strongest to date.'
      }
    ];

    for (const p of progressHistory) {
      await Progress.create(p);
    }

    logger.info('Generating sample goals...');
    await Goal.create([
      {
        user: demoUser._id,
        title: 'Reach 74.0 kg Body Weight',
        type: 'weight_loss',
        startingValue: 78.5,
        currentValue: 75.5,
        targetValue: 74.0,
        unit: 'kg',
        startDate: new Date(now.getTime() - 60 * 86400000),
        targetDate: new Date(now.getTime() + 30 * 86400000),
        status: 'active'
      },
      {
        user: demoUser._id,
        title: 'Bench Press 100 kg 1RM',
        type: 'strength',
        startingValue: 80,
        currentValue: 92.5,
        targetValue: 100,
        unit: 'kg',
        startDate: new Date(now.getTime() - 60 * 86400000),
        targetDate: new Date(now.getTime() + 45 * 86400000),
        status: 'active'
      },
      {
        user: demoUser._id,
        title: 'Complete 16 Workouts in a Month',
        type: 'workout_frequency',
        startingValue: 0,
        currentValue: 16,
        targetValue: 16,
        unit: 'workouts',
        startDate: new Date(now.getTime() - 35 * 86400000),
        targetDate: new Date(now.getTime() - 5 * 86400000),
        status: 'completed'
      }
    ]);

    logger.info('Generating sample notifications & reminders...');
    await Notification.create([
      {
        user: demoUser._id,
        title: 'Goal Completed!',
        message: 'Congratulations Alex! You successfully achieved your goal: "Complete 16 Workouts in a Month" 🎉',
        type: 'goal_achieved',
        isRead: false,
        actionUrl: '/goals'
      },
      {
        user: demoUser._id,
        title: 'Workout Logged',
        message: 'You crushed your Upper Body Power & Hypertrophy session burning 480 kcal!',
        type: 'workout',
        isRead: true,
        actionUrl: '/workouts'
      },
      {
        user: demoUser._id,
        title: 'Hydration Target',
        message: 'You are close to your 2500ml daily hydration goal today. Keep it up!',
        type: 'reminder',
        isRead: false,
        actionUrl: '/nutrition'
      }
    ]);

    await Reminder.create([
      {
        user: demoUser._id,
        title: 'Morning Push Workout Session',
        type: 'workout',
        time: '07:30',
        days: ['Mon', 'Wed', 'Fri'],
        isActive: true
      },
      {
        user: demoUser._id,
        title: 'Post-Workout Protein & Meal Log',
        type: 'meal',
        time: '13:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        isActive: true
      },
      {
        user: demoUser._id,
        title: 'Drink 500ml Water',
        type: 'water',
        time: '10:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isActive: true
      }
    ]);

    logger.info('Generating sample support tickets...');
    await SupportTicket.create({
      user: demoUser._id,
      subject: 'Inquiry regarding Apple Health / Google Fit sync feature',
      category: 'feature',
      priority: 'medium',
      status: 'in_progress',
      messages: [
        {
          sender: demoUser._id,
          senderName: demoUser.name,
          isStaff: false,
          message: 'Hi support team, I love the application! Is there an upcoming plan to sync live smartwatch steps directly?',
          createdAt: new Date(now.getTime() - 2 * 86400000)
        },
        {
          sender: adminUser._id,
          senderName: 'Admin Chief (Staff)',
          isStaff: true,
          message: 'Hello Alex! Thank you for the positive feedback. Yes, wearable Bluetooth / health API synchronization is scheduled in our upcoming Q3 roadmap release!',
          createdAt: new Date(now.getTime() - 1 * 86400000)
        }
      ]
    });

    logger.info('Generating initial system log...');
    await SystemLog.create({
      action: 'SYSTEM_INITIALIZATION',
      user: adminUser._id,
      userEmail: adminUser.email,
      ipAddress: '127.0.0.1',
      userAgent: 'SeedService/1.0',
      details: { message: 'Database initialized with demo content and exercise catalogue.' },
      severity: 'info'
    });

    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error during database seed:', error.message);
    throw error;
  }
};

if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  connectDB()
    .then(async () => {
      await seedAll();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedAll };
