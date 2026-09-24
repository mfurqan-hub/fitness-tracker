const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const crypto = require('crypto');
const app = require('../server');
const User = require('../models/User');
const initialExercises = require('../seeds/initialExercises');
const Exercise = require('../models/Exercise');
const SystemSetting = require('../models/SystemSetting');

let mongoServer;
let userToken;
let adminToken;
let userId;
let registeredUserEmail = 'athlete.prime@example.com';
let userVerificationToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);

  // Seed exercises
  await Exercise.insertMany(initialExercises);

  // Configure test mock for verifyFirebaseIdToken
  global.__MOCK_FIREBASE_VERIFY__ = async (idToken) => {
    if (idToken === 'valid-google-token-new') {
      return {
        uid: 'firebase-google-uid-123',
        email: 'google.athlete@example.com',
        name: 'Google Athlete',
        picture: 'https://example.com/avatar.jpg',
        email_verified: true,
        firebase: { sign_in_provider: 'google.com' }
      };
    }
    if (idToken === 'valid-google-token-existing') {
      return {
        uid: 'firebase-google-uid-123',
        email: 'google.athlete@example.com',
        name: 'Google Athlete Updated',
        picture: 'https://example.com/avatar.jpg',
        email_verified: true,
        firebase: { sign_in_provider: 'google.com' }
      };
    }
    if (idToken === 'valid-facebook-token-new') {
      return {
        uid: 'firebase-fb-uid-456',
        email: 'fb.athlete@example.com',
        name: 'Facebook Athlete',
        picture: 'https://example.com/fb-avatar.jpg',
        email_verified: true,
        firebase: { sign_in_provider: 'facebook.com' }
      };
    }
    if (idToken === 'valid-token-matching-local-user') {
      return {
        uid: 'firebase-fake-attacker-uid',
        email: registeredUserEmail, // matches local user
        name: 'Attacker Attempting Hijack',
        email_verified: true,
        firebase: { sign_in_provider: 'google.com' }
      };
    }
    if (idToken === 'valid-token-escalate-admin-attempt') {
      return {
        uid: 'firebase-uid-hacker',
        email: 'hacker@example.com',
        name: 'Hacker Attempt',
        role: 'admin', // claim escalation attempt
        email_verified: true,
        firebase: { sign_in_provider: 'google.com' }
      };
    }
    if (idToken === 'valid-token-blocked-gov') {
      return {
        uid: 'firebase-uid-blocked',
        email: 'blocked.social@example.com',
        name: 'Blocked Social User',
        email_verified: true,
        firebase: { sign_in_provider: 'google.com' }
      };
    }
    throw new Error('Firebase ID token has expired or is invalid.');
  };
});

afterAll(async () => {
  delete global.__MOCK_FIREBASE_VERIFY__;
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('FitPulse MERN Stack Comprehensive Integration Tests', () => {
  describe('Authentication & Email Verification Endpoints (/api/auth)', () => {
    it('should register a new user successfully and create verification token hash', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Athlete Prime',
          username: 'athleteprime',
          email: registeredUserEmail,
          password: 'Password123!',
          confirmPassword: 'Password123!',
          gender: 'male',
          weight: 75,
          height: 175
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.email).toBe(registeredUserEmail);
      expect(res.body.data.emailVerified).toBe(false);
      userToken = res.body.data.token;
      userId = res.body.data._id;

      // Extract generated verification token hash from DB to test verification flow
      const createdUser = await User.findById(userId).select('+emailVerificationTokenHash +emailVerificationExpires');
      expect(createdUser.emailVerificationTokenHash).toBeDefined();
      expect(createdUser.emailVerificationExpires).toBeDefined();
    });

    it('should prevent duplicate registration with same email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Athlete',
          username: 'duplicate1',
          email: registeredUserEmail,
          password: 'Password123!'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should log in with valid credentials and return JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredUserEmail,
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredUserEmail,
          password: 'WrongPassword999'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should access /api/auth/me with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(registeredUserEmail);
    });

    it('should reject protected route without Bearer token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('Email Verification & Resend Verification Suite', () => {
    let testRawToken = 'raw-test-verification-token-32-chars-long';

    beforeAll(async () => {
      // Set a known token hash on user to test GET /api/auth/verify-email
      const tokenHash = crypto.createHash('sha256').update(testRawToken).digest('hex');
      await User.findByIdAndUpdate(userId, {
        emailVerificationTokenHash: tokenHash,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        emailVerified: false
      });
    });

    it('should reject email verification with missing token', async () => {
      const res = await request(app).get('/api/auth/verify-email');
      expect(res.status).toBe(400);
    });

    it('should reject invalid verification token', async () => {
      const res = await request(app).get('/api/auth/verify-email?token=invalid-fake-token');
      expect(res.status).toBe(400);
    });

    it('should reject expired verification token', async () => {
      const expiredRawToken = 'expired-raw-token-12345';
      const expiredHash = crypto.createHash('sha256').update(expiredRawToken).digest('hex');
      
      await User.create({
        name: 'Expired User',
        username: 'expireduser',
        email: 'expired@example.com',
        password: 'Password123!',
        emailVerified: false,
        emailVerificationTokenHash: expiredHash,
        emailVerificationExpires: new Date(Date.now() - 1000) // already expired
      });

      const res = await request(app).get(`/api/auth/verify-email?token=${expiredRawToken}`);
      expect(res.status).toBe(400);
    });

    it('should successfully verify email with valid token and invalidate token single-use', async () => {
      const res = await request(app).get(`/api/auth/verify-email?token=${testRawToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const user = await User.findById(userId).select('+emailVerificationTokenHash');
      expect(user.emailVerified).toBe(true);
      expect(user.emailVerificationTokenHash).toBeFalsy();

      // Verify token cannot be reused
      const secondAttempt = await request(app).get(`/api/auth/verify-email?token=${testRawToken}`);
      expect(secondAttempt.status).toBe(400);
    });

    it('should handle resend verification request for already-verified user', async () => {
      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: registeredUserEmail });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('already been verified');
    });

    it('should handle resend verification request for unverified user', async () => {
      const unverifiedUser = await User.create({
        name: 'Unverified Athlete',
        username: 'unverifiedathlete',
        email: 'unverified@example.com',
        password: 'Password123!',
        emailVerified: false
      });

      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'unverified@example.com' });

      expect(res.status).toBe(200);

      const updated = await User.findById(unverifiedUser._id).select('+emailVerificationTokenHash +emailVerificationExpires');
      expect(updated.emailVerificationTokenHash).toBeDefined();
      expect(updated.emailVerificationExpires).toBeDefined();
    });
  });

  describe('Password Reset Recovery Flow (/api/auth/forgot-password & /api/auth/reset-password)', () => {
    let resetUserEmail = 'password.reset.user@example.com';
    let rawResetToken = 'raw-password-reset-token-32-chars';

    beforeAll(async () => {
      await User.create({
        name: 'Reset Test User',
        username: 'resettestuser',
        email: resetUserEmail,
        password: 'OriginalPassword123!',
        authProvider: 'local',
        emailVerified: true
      });
    });

    it('should return generic safe response on forgot-password for existing email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: resetUserEmail });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('instructions have been sent');

      const user = await User.findOne({ email: resetUserEmail }).select('+passwordResetTokenHash +passwordResetExpires');
      expect(user.passwordResetTokenHash).toBeDefined();
      expect(user.passwordResetExpires).toBeDefined();
    });

    it('should return identical generic safe response on forgot-password for non-existing email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent.user9999@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('instructions have been sent');
    });

    it('should reject reset-password with invalid or expired token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-nonexistent-token',
          password: 'BrandNewPassword123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject reset-password with password less than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'some-token',
          password: '123'
        });

      expect(res.status).toBe(400);
    });

    it('should successfully reset password with valid token and hash with bcrypt', async () => {
      // Set a known reset token on the user
      const resetHash = crypto.createHash('sha256').update(rawResetToken).digest('hex');
      await User.findOneAndUpdate(
        { email: resetUserEmail },
        {
          passwordResetTokenHash: resetHash,
          passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000)
        }
      );

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: rawResetToken,
          password: 'NewlyUpdatedPassword123!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify reset token was invalidated single-use
      const user = await User.findOne({ email: resetUserEmail }).select('+passwordResetTokenHash');
      expect(user.passwordResetTokenHash).toBeFalsy();

      // Verify login with old password fails
      const oldLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: resetUserEmail,
          password: 'OriginalPassword123!'
        });
      expect(oldLogin.status).toBe(401);

      // Verify login with new password succeeds
      const newLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: resetUserEmail,
          password: 'NewlyUpdatedPassword123!'
        });
      expect(newLogin.status).toBe(200);
      expect(newLogin.body.data).toHaveProperty('token');
    });
  });

  describe('Firebase Social Authentication (/api/auth/firebase)', () => {
    it('should reject request without ID token', async () => {
      const res = await request(app).post('/api/auth/firebase').send({});
      expect(res.status).toBe(400);
    });

    it('should reject invalid Firebase ID token', async () => {
      const res = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'invalid-fake-firebase-token' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should create and authenticate a new Google social user', async () => {
      const res = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'valid-google-token-new' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('google.athlete@example.com');
      expect(res.body.data.authProvider).toBe('google');
      expect(res.body.data.role).toBe('user');
      expect(res.body.data.emailVerified).toBe(true);
      expect(res.body.data).toHaveProperty('token');

      const userInDb = await User.findOne({ email: 'google.athlete@example.com' });
      expect(userInDb).toBeDefined();
      expect(userInDb.firebaseUid).toBe('firebase-google-uid-123');
    });

    it('should authenticate an existing Google social user on subsequent logins', async () => {
      const res = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'valid-google-token-existing' });

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('google.athlete@example.com');
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject non-Google social login provider (e.g. Facebook)', async () => {
      const res = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'valid-facebook-token-new' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Only Google sign-in is supported');
    });

    it('should prevent social login hijack of an existing local password user without explicit link', async () => {
      const res = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'valid-token-matching-local-user' });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already exists using password authentication');
    });

    it('should NEVER allow social login to assign admin role from client or Firebase payload', async () => {
      const res = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'valid-token-escalate-admin-attempt' });

      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('user'); // must be 'user', not 'admin'

      const userInDb = await User.findOne({ email: 'hacker@example.com' });
      expect(userInDb.role).toBe('user');
    });
  });

  describe('Registration Governance (allowUserRegistration Server Setting)', () => {
    it('should block local registration when allowUserRegistration is false', async () => {
      // 1. Disable registration via SystemSetting
      await SystemSetting.findOneAndUpdate(
        { key: 'platform_config' },
        { allowUserRegistration: false },
        { upsert: true }
      );

      // 2. Local registration should be rejected with 403
      const localRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Blocked User',
          username: 'blockedlocal',
          email: 'blocked.local@example.com',
          password: 'Password123!'
        });
      expect(localRes.status).toBe(403);

      // 3. New social registration should also be rejected with 403
      const socialRes = await request(app)
        .post('/api/auth/firebase')
        .send({ idToken: 'valid-token-blocked-gov' });
      expect(socialRes.status).toBe(403);

      // 4. Existing users must still be able to log in normally
      const existingLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredUserEmail,
          password: 'Password123!'
        });
      expect(existingLogin.status).toBe(200);

      // 5. Restore allowUserRegistration
      await SystemSetting.findOneAndUpdate(
        { key: 'platform_config' },
        { allowUserRegistration: true }
      );
    });
  });

  describe('Workouts & Nutrition Endpoints', () => {
    let createdWorkoutId;

    it('should create a new workout with exercises and compute total volume', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Morning Chest Blast',
          category: 'Strength',
          duration: 45,
          exercises: [
            { name: 'Barbell Bench Press', sets: 3, reps: 10, weight: 80 }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Morning Chest Blast');
      expect(res.body.data.totalVolume).toBe(2400); // 3 * 10 * 80
      createdWorkoutId = res.body.data._id;
    });

    it('should retrieve logged workouts for authenticated user', async () => {
      const res = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should log a nutrition entry and calculate totals', async () => {
      const res = await request(app)
        .post('/api/nutrition')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          mealType: 'Breakfast',
          foods: [
            { name: 'Eggs & Oats', quantity: 1, calories: 500, protein: 30, carbs: 55, fat: 12 }
          ]
        });

      expect(res.status).toBe(201);
      expect(res.body.data.totalCalories).toBe(500);
      expect(res.body.data.totalProtein).toBe(30);
    });
  });

  describe('Exercise Library & Admin Authorization', () => {
    beforeAll(async () => {
      // Create admin user
      await User.create({
        name: 'System Admin',
        username: 'sysadmin',
        email: 'sysadmin@example.com',
        password: 'AdminPassword123!',
        role: 'admin'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'sysadmin@example.com',
          password: 'AdminPassword123!'
        });

      adminToken = res.body.data.token;
    });

    it('should allow public/user query of exercise library', async () => {
      const res = await request(app).get('/api/exercises?muscleGroup=Chest');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should deny non-admin users from accessing /api/admin/overview (403)', async () => {
      const res = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should deny non-admin users from accessing /api/admin/users (403)', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should deny non-admin users from accessing /api/admin/settings (403)', async () => {
      const res = await request(app)
        .get('/api/admin/settings')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow admin user to access /api/admin/overview', async () => {
      const res = await request(app)
        .get('/api/admin/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('stats');
      expect(res.body.data.stats.totalUsers).toBeGreaterThan(0);
    });

    it('should allow admin user to get and persist /api/admin/settings', async () => {
      const getRes = await request(app)
        .get('/api/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.allowUserRegistration).toBe(true);

      const putRes = await request(app)
        .put('/api/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          allowUserRegistration: true,
          systemNotice: 'Maintenance upcoming'
        });

      expect(putRes.status).toBe(200);
    });
  });

  describe('Cross-User Data Isolation (Multi-User Privacy)', () => {
    let userBToken;
    let userBWorkoutId;
    let userBProgressId;
    let userBGoalId;

    beforeAll(async () => {
      const resB = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User B',
          username: 'userb',
          email: 'userb@example.com',
          password: 'Password123!'
        });
      userBToken = resB.body.data.token;

      const workoutRes = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          title: 'User B Private Workout',
          category: 'Cardio',
          duration: 30
        });
      userBWorkoutId = workoutRes.body.data._id;

      const progressRes = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          weight: 78.5,
          bodyFat: 14
        });
      userBProgressId = progressRes.body.data._id;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);
      const goalRes = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          title: 'Run 10k',
          type: 'distance',
          startingValue: 0,
          currentValue: 2,
          targetValue: 10,
          unit: 'km',
          targetDate: targetDate.toISOString()
        });
      userBGoalId = goalRes.body.data._id;
    });

    it('should NOT allow User A to read User B workout (404, not 403)', async () => {
      const res = await request(app)
        .get(`/api/workouts/${userBWorkoutId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });

    it('should NOT allow User A to delete User B workout', async () => {
      const res = await request(app)
        .delete(`/api/workouts/${userBWorkoutId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });

    it('should NOT allow User A to update User B progress', async () => {
      const res = await request(app)
        .put(`/api/progress/${userBProgressId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ weight: 99 });
      expect(res.status).toBe(404);
    });

    it('should NOT allow User A to delete User B goal', async () => {
      const res = await request(app)
        .delete(`/api/goals/${userBGoalId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });

    it('should confirm User B can still access their own workout', async () => {
      const res = await request(app)
        .get(`/api/workouts/${userBWorkoutId}`)
        .set('Authorization', `Bearer ${userBToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(userBWorkoutId);
    });
  });
});
