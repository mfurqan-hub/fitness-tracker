import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// User Dashboard Modules
import DashboardPage from '../pages/dashboard/DashboardPage';
import WorkoutsPage from '../pages/workouts/WorkoutsPage';
import ExerciseLibraryPage from '../pages/exercises/ExerciseLibraryPage';
import NutritionPage from '../pages/nutrition/NutritionPage';
import ProgressPage from '../pages/progress/ProgressPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import GoalsPage from '../pages/goals/GoalsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import SupportPage from '../pages/support/SupportPage';

// Admin Modules
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminExercisesPage from '../pages/admin/AdminExercisesPage';
import AdminTicketsPage from '../pages/admin/AdminTicketsPage';
import AdminLogsPage from '../pages/admin/AdminLogsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth & Account Recovery Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Protected User Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/exercises" element={<ExerciseLibraryPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/exercises" element={<AdminExercisesPage />} />
        <Route path="/admin/tickets" element={<AdminTicketsPage />} />
        <Route path="/admin/logs" element={<AdminLogsPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
