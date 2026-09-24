import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { firebaseAuthService } from '../services/firebaseAuth';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fitpulse_token'));
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('fitpulse_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        localStorage.setItem('fitpulse_token', jwtToken);
        localStorage.setItem('fitpulse_user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message };
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return { success: false, message: err.message };
    }
  };

  const loginWithFirebase = async (idToken) => {
    try {
      const res = await authService.firebaseLogin(idToken);
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        localStorage.setItem('fitpulse_token', jwtToken);
        localStorage.setItem('fitpulse_user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message };
    } catch (err) {
      toast.error(err.message || 'Social authentication failed.');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        const { token: jwtToken, ...userInfo } = res.data;
        localStorage.setItem('fitpulse_token', jwtToken);
        localStorage.setItem('fitpulse_user', JSON.stringify(userInfo));
        setToken(jwtToken);
        setUser(userInfo);
        toast.success('Registration successful! Please check your email to verify your account.');
        return { success: true, user: userInfo };
      }
      return { success: false, message: res.message };
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fitpulse_token');
    localStorage.removeItem('fitpulse_user');
    setToken(null);
    setUser(null);
    firebaseAuthService.signOut().catch(() => {});
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    const saved = localStorage.getItem('fitpulse_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        localStorage.setItem('fitpulse_user', JSON.stringify({ ...parsed, ...updatedData }));
      } catch (e) {}
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithFirebase,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
