const logger = require('../utils/logger');

let isInitialized = false;

const initFirebaseAdmin = () => {
  if (isInitialized) return true;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Handle escaped newlines from environment variable strings
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    try {
      const { initializeApp, cert, getApps } = require('firebase-admin/app');
      if (getApps().length === 0) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey
          })
        });
      }
      isInitialized = true;
      logger.info('Firebase Admin SDK initialized successfully.');
    } catch (err) {
      logger.error('Failed to initialize Firebase Admin SDK:', err.message);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Firebase Admin configuration error in production: ${err.message}`);
      }
    }
  } else {
    if (process.env.NODE_ENV === 'production') {
      logger.error('Firebase Admin credentials missing in production environment.');
    } else {
      logger.warn('Firebase Admin credentials missing. Social authentication requires valid FIREBASE_* environment variables.');
    }
  }

  return isInitialized;
};

// Initialize on module load
initFirebaseAdmin();

/**
 * Verifies a Firebase ID Token.
 * Throws explicit errors if token is invalid or Firebase Admin is unconfigured.
 */
const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Missing or invalid Firebase ID token.');
  }

  if (process.env.NODE_ENV === 'test' && global.__MOCK_FIREBASE_VERIFY__) {
    return global.__MOCK_FIREBASE_VERIFY__(idToken);
  }

  const { getApps } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');

  if (!isInitialized && getApps().length === 0) {
    throw new Error('Firebase Admin is not configured on the server. Please verify FIREBASE_* environment variables.');
  }

  return await getAuth().verifyIdToken(idToken);
};

module.exports = {
  initFirebaseAdmin,
  verifyFirebaseIdToken
};


