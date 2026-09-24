import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBo35eo9_WNRW1G1CPbQMXa4J5XjdsF08g',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'fitness-tracker-96679.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'fitness-tracker-96679',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'fitness-tracker-96679.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '174596753603',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:174596753603:web:b1b14333b6b35d65ec7a76'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your-firebase-api-key' &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId
);

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('[Firebase] Client initialization skipped:', err.message);
  }
}

export { auth, googleProvider };
export default app;
