import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

export const firebaseAuthService = {
  /**
   * Signs in with Google popup and returns the Firebase ID token.
   */
  signInWithGoogle: async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return {
        success: false,
        error: 'Firebase is not configured in client environment variables. Please add VITE_FIREBASE_API_KEY and related vars to client/.env to enable Google sign-in.'
      };
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      return { success: true, idToken, user: result.user };
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Google sign-in popup was closed before completing.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Only one popup request allowed at a time.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
      }
      return { success: false, error: message, code: error.code };
    }
  },

  /**
   * Signs out from Firebase browser session.
   */
  signOut: async () => {
    if (!auth) return { success: true };
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
