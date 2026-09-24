import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitpulse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standard error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token invalid or 401, handle clean logout
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('fitpulse_token');
        localStorage.removeItem('fitpulse_user');
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(', ') ||
      error.message ||
      'An unexpected network error occurred.';

    return Promise.reject({ ...error, message });
  }
);

export default api;
