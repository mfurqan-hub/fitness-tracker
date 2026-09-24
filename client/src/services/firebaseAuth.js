import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';

export const firebaseAuthService = {
  /**
   * Signs in with Google popup, falling back to redirect if popup is blocked.
   */
  signInWithGoogle: async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return {
        success: false,
        error: 'Firebase is not configured in client environment variables.'
      };
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      return { success: true, idToken, user: result.user };
    } catch (error) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return { success: false, redirecting: true, message: 'Redirecting to Google login...' };
        } catch (redirErr) {
          return { success: false, error: redirErr.message };
        }
      }
      let message = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Google sign-in popup was closed before completing.';
      }
      return { success: false, error: message, code: error.code };
    }
  },

  /**
   * Handles returning from Google redirect sign-in.
   */
  checkRedirectResult: async () => {
    if (!isFirebaseConfigured || !auth) return null;
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const idToken = await result.user.getIdToken();
        return { success: true, idToken, user: result.user };
      }
      return null;
    } catch (error) {
      return { success: false, error: error.message };
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
