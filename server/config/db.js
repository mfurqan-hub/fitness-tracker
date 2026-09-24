const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  const uri = process.env.MONGODB_URI;
  const useMemory = process.env.MONGODB_USE_MEMORY_SERVER === 'true';
  const isServerless = !!process.env.VERCEL;

  if (uri && (!isServerless || (uri.includes('mongodb+srv://') || !uri.includes('127.0.0.1')))) {
    try {
      logger.info(`Connecting to MongoDB at: ${uri.replace(/:\/\/[^@]+@/, '://***:***@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      isConnecting = false;
      return conn;
    } catch (error) {
      logger.error(`Could not connect to MongoDB: ${error.message}`);
      isConnecting = false;
      if (isServerless) {
        logger.warn('Serverless environment detected. Continuing request handling...');
        return;
      }
    }
  }

  if (useMemory && !isServerless) {
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

      global.__mongoMemoryServer = mongoMemoryServer;
      isConnecting = false;
      return conn;
    } catch (memErr) {
      logger.error('Failed to initialize in-memory MongoDB:', memErr.message);
      isConnecting = false;
    }
  }

  isConnecting = false;
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

