const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB.
 *
 * Priority:
 *  1. MONGODB_URI environment variable (required in production)
 *  2. If MONGODB_USE_MEMORY_SERVER=true (dev/demo only), starts an in-memory
 *     MongoDB instance and seeds demo data — this must be an EXPLICIT opt-in,
 *     never a silent fallback.
 *
 * If MONGODB_URI is not set AND MONGODB_USE_MEMORY_SERVER is not true,
 * the server exits with a clear error message.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const useMemory = process.env.MONGODB_USE_MEMORY_SERVER === 'true';

  // === Production / standard development path ===
  if (uri) {
    try {
      logger.info(`Connecting to MongoDB at: ${uri.replace(/:\/\/[^@]+@/, '://***:***@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (error) {
      logger.error(`FATAL: Could not connect to MongoDB: ${error.message}`);
      logger.error('Ensure MongoDB is running and MONGODB_URI in server/.env is correct.');
      logger.error('  Example: MONGODB_URI=mongodb://127.0.0.1:27017/fitness_tracker');
      if (!useMemory) {
        process.exit(1);
      }
      logger.warn('MONGODB_USE_MEMORY_SERVER=true detected. Falling back to in-memory MongoDB for demo...');
    }
  }

  // === Explicit in-memory mode (dev/demo only, must be intentionally enabled) ===
  if (useMemory) {
    logger.warn('========================================================');
    logger.warn('  MONGODB_USE_MEMORY_SERVER=true');
    logger.warn('  Starting ephemeral in-memory MongoDB for development.');
    logger.warn('  ALL DATA IS LOST ON SERVER RESTART.');
    logger.warn('  Do NOT use this in production.');
    logger.warn('========================================================');

    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      logger.info(`In-Memory MongoDB Connected at: ${memUri}`);

      // Auto-seed demo data
      const { seedAll } = require('../seeds/seedDatabase');
      await seedAll();
      logger.info('Demo data seeded into in-memory database.');

      // Store reference for graceful shutdown
      global.__mongoMemoryServer = mongoMemoryServer;
      return conn;
    } catch (memErr) {
      logger.error('FATAL: Failed to initialize in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }

  // === Neither MONGODB_URI nor MONGODB_USE_MEMORY_SERVER set ===
  logger.error('FATAL: MONGODB_URI environment variable is not set.');
  logger.error('Options:');
  logger.error('  1. Install MongoDB and set MONGODB_URI=mongodb://127.0.0.1:27017/fitness_tracker in server/.env');
  logger.error('  2. Use MongoDB Atlas: set MONGODB_URI=<your-atlas-connection-string> in server/.env');
  logger.error('  3. For demo/dev only: set MONGODB_USE_MEMORY_SERVER=true in server/.env');
  process.exit(1);
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (global.__mongoMemoryServer) {
    await global.__mongoMemoryServer.stop();
    logger.info('In-memory MongoDB server stopped.');
  }
  logger.info('MongoDB connection closed.');
};

module.exports = { connectDB, disconnectDB };
