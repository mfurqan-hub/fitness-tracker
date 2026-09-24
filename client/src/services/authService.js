import api from './api';

export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  firebaseLogin: async (idToken) => {
    const res = await api.post('/auth/firebase', { idToken });
    return res.data;
  },

  verifyEmail: async (token) => {
    const res = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
    return res.data;
  },

  resendVerification: async (email) => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  },

  sendOtp: async (email) => {
    const res = await api.post('/auth/send-otp', { email });
    return res.data;
  },

  verifyOtp: async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await api.post('/auth/reset-password', { token, password });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  updatePassword: async (passwords) => {
    const res = await api.put('/auth/update-password', passwords);
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    return res.data;
  },

  uploadAvatar: async (formData) => {
    const res = await api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  updatePreferences: async (preferences) => {
    const res = await api.put('/users/preferences', preferences);
    return res.data;
  }
};
