# MERN Stack Fitness Tracker - Architecture & Implementation Plan

## 1. Current Project Assessment
- **Workspace State**: Empty directory (`c:\Users\furqa\OneDrive\Desktop\Fitness Tracker`).
- **Environment**: Windows OS, Node.js `v24.19.0`, npm `11.17.0` (invoked via `npm.cmd`/`npx.cmd`).
- **Requirement Target**: Full-stack MERN production-grade Fitness SaaS web application for academic eProject.
- **Design Standard**: Premium dark/light UI, responsive dashboard, glassmorphism accents, Lucide/Hero icons, Chart.js / Recharts data visualizations, toast notifications, PDF/CSV reports, and role-based access control (User/Admin).
- **Database Strategy**: Mongoose ODM with robust connection handling (connecting to configured `MONGODB_URI` with transparent in-memory fallback support via `mongodb-memory-server` if local MongoDB daemon is not running, ensuring immediate zero-config plug-and-play).

---

## 2. Proposed System Architecture

### Monorepo / Split Structure
```
Fitness Tracker/
├── client/                     # Vite + React 18 Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Brand logos, illustrations, default avatars
│   │   ├── components/         # Reusable UI components (Modals, Tables, Cards, Badges, Charts, Skeletons)
│   │   │   ├── common/         # Button, Input, Dropdown, Toast, ConfirmModal, Loader, ThemeToggle
│   │   │   ├── layout/         # Navbar, Sidebar, Footer, DashboardLayout, AdminLayout, AuthLayout
│   │   │   ├── charts/         # AreaChart, BarChart, DonutChart, ProgressChart
│   │   │   ├── workouts/       # WorkoutCard, WorkoutModal, ExerciseSetRow
│   │   │   ├── nutrition/      # MealCard, MacroTracker, FoodModal
│   │   │   ├── progress/       # MeasurementForm, WeightChart, PhotoLog
│   │   │   ├── goals/          # GoalCard, GoalProgressBar, GoalModal
│   │   │   └── admin/          # StatsCard, UserTable, TicketRow
│   │   ├── context/            # AuthContext, ThemeContext, NotificationContext, FitnessContext
│   │   ├── hooks/              # useAuth, useTheme, useNotifications, useFetch, useDebounce
│   │   ├── pages/              # Public & Protected pages
│   │   │   ├── public/         # LandingPage, AboutPage, FeaturesPage, ContactPage, NotFoundPage
│   │   │   ├── auth/           # LoginPage, RegisterPage, ForgotPasswordPage
│   │   │   ├── dashboard/      # DashboardPage (Overview)
│   │   │   ├── workouts/       # WorkoutsPage, WorkoutDetailPage, CreateWorkoutPage
│   │   │   ├── exercises/      # ExerciseLibraryPage
│   │   │   ├── nutrition/      # NutritionPage, MealLogPage
│   │   │   ├── progress/       # ProgressPage, MeasurementPage
│   │   │   ├── analytics/      # AnalyticsPage (Advanced aggregations)
│   │   │   ├── goals/          # GoalsPage
│   │   │   ├── reports/        # ReportsPage (Export PDF / CSV)
│   │   │   ├── settings/       # SettingsPage (Appearance, Units, Security, Profile)
│   │   │   ├── support/        # SupportPage (Tickets, FAQ)
│   │   │   └── admin/          # AdminDashboard, AdminUsers, AdminExercises, AdminTickets, AdminLogs
│   │   ├── services/           # Axios API client & endpoints (authApi, workoutApi, nutritionApi, adminApi, etc.)
│   │   ├── utils/              # formatters, validators, calculations (BMI, TDEE, Macros, 1RM), exportPdfCsv
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute, PublicRoute
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Premium styling system, CSS variables (dark/light), animations
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── server/                     # Node.js + Express REST API
│   ├── config/                 # db.js, jwt.js, multer.js, constants.js
│   ├── controllers/            # authController, userController, workoutController, exerciseController,
│   │                           # nutritionController, progressController, goalController,
│   │                           # notificationController, reminderController, reportController,
│   │                           # supportController, adminController
│   ├── middleware/             # authMiddleware, roleMiddleware, errorMiddleware, validationMiddleware,
│   │                           # rateLimiter, loggerMiddleware, uploadMiddleware
│   ├── models/                 # User.js, Workout.js, Exercise.js, Nutrition.js, Progress.js,
│   │                           # Goal.js, Notification.js, Reminder.js, SupportTicket.js, SystemLog.js
│   ├── routes/                 # authRoutes, userRoutes, workoutRoutes, exerciseRoutes, nutritionRoutes,
│   │                           # progressRoutes, goalRoutes, notificationRoutes, reminderRoutes,
│   │                           # reportRoutes, supportRoutes, adminRoutes
│   ├── services/               # statsService, reportService, notificationService, seedService
│   ├── utils/                  # apiResponse.js, tokenUtils.js, logger.js, exportHelpers.js
│   ├── validators/             # authValidator, workoutValidator, nutritionValidator, progressValidator
│   ├── seeds/                  # initialExercises.js, seedDatabase.js (Demo user, admin, sample workouts)
│   ├── tests/                  # api.test.js (Auth, Workout CRUD, Nutrition, Admin authorization tests)
│   ├── package.json
│   ├── server.js               # Express application entry point
│   └── .env.example
│
├── .gitignore
├── .env.example
├── package.json                # Root concurrently runner (npm run dev, npm run install:all)
└── README.md                   # Comprehensive academic eProject documentation
```

---

## 3. Database Schema Models Design

1. **`User`**:
   - `name`, `username`, `email` (unique, lowercase), `password` (bcrypt hashed), `role` (`'user'` | `'admin'`), `avatar` (URL/base64), `gender`, `age`, `height`, `weight`, `bio`, `fitnessGoal` (weight-loss, muscle-gain, endurance, maintain, etc.), `preferences` (units: `{ weight: 'kg'|'lbs', height: 'cm'|'ft' }`, theme: `'light'|'dark'|'system'`, emailNotifications: `boolean`), `isActive`: `boolean`, `createdAt`, `updatedAt`.

2. **`Workout`**:
   - `user` (ObjectId ref User), `title`, `category` (Strength, Cardio, HIIT, Flexibility, Sports, Other), `date`, `duration` (minutes), `notes`, `tags` ([String]), `exercises`: `[{ name, category, sets: Number, reps: Number, weight: Number, duration: Number, notes: String }]`, `totalVolume` (computed sets * reps * weight), `caloriesBurned`: Number, `timestamps`.

3. **`Exercise`** (Global Library & Custom):
   - `name`, `category`, `muscleGroup` (Chest, Back, Legs, Shoulders, Arms, Core, Full Body, Cardio), `instructions` ([String]), `equipment` (Barbell, Dumbbell, Machine, Bodyweight, Cable, Kettlebell, None), `difficulty` (Beginner, Intermediate, Advanced), `isCustom`: Boolean, `createdBy` (User ref, optional for system exercises), `timestamps`.

4. **`Nutrition`**:
   - `user` (ObjectId ref User), `date`, `mealType` (Breakfast, Lunch, Dinner, Snacks), `foods`: `[{ name, quantity: String/Number, unit: String, calories: Number, protein: Number, carbs: Number, fat: Number }]`, `totalCalories`, `totalProtein`, `totalCarbs`, `totalFat`, `timestamps`.

5. **`Progress`**:
   - `user` (ObjectId ref User), `date`, `weight` (Number), `bodyFat` (Number), `measurements`: `{ chest: Number, waist: Number, hips: Number, arms: Number, thighs: Number, calves: Number }`, `performanceMetrics`: `{ restingHeartRate: Number, vo2Max: Number, benchPressMax: Number, squatMax: Number, deadliftMax: Number }`, `notes`: String, `photos`: [String], `timestamps`.

6. **`Goal`**:
   - `user` (ObjectId ref User), `title`, `type` (`weight_loss`, `weight_gain`, `strength`, `workout_frequency`, `distance`, `calories`, `custom`), `startingValue`: Number, `currentValue`: Number, `targetValue`: Number, `unit`: String, `startDate`: Date, `targetDate`: Date, `status` (`active`, `completed`, `failed`), `timestamps`.

7. **`Notification`**:
   - `user` (ObjectId ref User), `title`, `message`, `type` (`workout`, `goal_achieved`, `reminder`, `system`, `support`), `isRead`: Boolean, `actionUrl`: String, `timestamps`.

8. **`Reminder`**:
   - `user` (ObjectId ref User), `title`, `type` (`workout`, `meal`, `water`, `goal`), `time`: String, `days`: [String], `isActive`: Boolean, `timestamps`.

9. **`SupportTicket`**:
   - `user` (ObjectId ref User), `subject`, `category` (`bug`, `feature`, `account`, `billing`, `other`), `priority` (`low`, `medium`, `high`, `urgent`), `status` (`open`, `in_progress`, `resolved`, `closed`), `messages`: `[{ sender: User ref, message: String, isStaff: Boolean, createdAt: Date }]`, `timestamps`.

10. **`SystemLog`**:
    - `action`, `user` (User ref, optional), `ipAddress`, `userAgent`, `details`: Object, `severity` (`info`, `warning`, `error`), `timestamp`.

---

## 4. Step-by-Step Implementation Roadmap

### Phase 1: Foundation & Backend Architecture
1. Root configuration: `package.json` for orchestration (`concurrently`), `.gitignore`, root `.env.example`.
2. Backend directory structure with Express, Mongoose, JWT, bcryptjs, cors, helmet, express-rate-limit, multer, pdfkit, json2csv.
3. Database connection with resilient failover & seed script for immediate testing (creates default demo user `demo@fitnesstracker.com / Password123!` and admin `admin@fitnesstracker.com / Admin123!`).
4. Centralized API response helper, error handling middleware, logger, and request validators.
5. Implementation of all 10 Mongoose schemas with proper indexes and hooks.

### Phase 2: REST API Endpoints & Business Logic
1. Auth API (`/api/auth`): Register, login, current user, password reset, token refresh.
2. User Profile API (`/api/users`): Profile update, avatar upload, preference updates.
3. Workout API (`/api/workouts`): CRUD, search, filter by date/category, stats aggregation.
4. Exercise Library API (`/api/exercises`): Full seeded library (50+ exercises), category search, admin manage.
5. Nutrition API (`/api/nutrition`): Meal logging, food items, daily macro calculations, macro target comparison.
6. Progress Tracking API (`/api/progress`): Weight/measurements logging, trend calculation, body composition stats.
7. Goals API (`/api/goals`): Goal management, automatic progress calculation, trigger notifications upon goal completion.
8. Notifications & Reminders API (`/api/notifications`, `/api/reminders`): Read/delete/mark-all, reminder scheduler triggers.
9. Reports & Export API (`/api/reports`): Aggregate user data over custom date ranges, stream CSV and formatted PDF reports.
10. Support Tickets API (`/api/support`): Ticket submission, message threads, status progression.
11. Admin Panel API (`/api/admin`): System metrics, user management (activate/suspend/delete), exercise manager, support ticket dispatch, system audit logs.

### Phase 3: Frontend Setup & Design System
1. Vite + React 18 frontend scaffolding with React Router v6, Axios, Lucide React icons, Chart.js / react-chartjs-2, canvas-confetti, and custom modern CSS design system.
2. Global Design System (`index.css`): Modern CSS variables, HSL color tokens, dark/light themes, sleek card glassmorphism, responsive utilities, custom scrollbars, and keyframe animations.
3. State & Context Providers: `AuthContext`, `ThemeContext`, `NotificationContext`, `ToastContext`.
4. Reusable UI Components: Modal, Table, Skeleton, Badge, StatCard, Dropdown, ConfirmDialog, Tabs, SearchInput, Pagination, DatePicker.

### Phase 4: Frontend Pages & User Experience
1. **Public Marketing Website**:
   - Modern Landing Page with hero, live preview mockups, interactive feature showcases, workout/nutrition/analytics highlight sections, testimonials, FAQ, and footer.
   - `/about`, `/features`, `/contact` pages.
2. **Authentication Pages**:
   - `/login`, `/register`, demo account quick-login buttons, form validations.
3. **App Dashboard Layout**:
   - Sidebar with active indicator, collapsible mobile drawer, top navigation with notifications dropdown, theme toggle, quick add button, and user profile menu.
4. **Dashboard Overview**:
   - Real-time dynamic KPI metrics (today's calories & burn, weekly workout count, active goals), interactive weight trend chart, weekly workout volume bar chart, recent activities, today's meals summary.
5. **Workout Tracking Module**:
   - List/Grid view with search and filter by category/date, dynamic workout builder modal (adding/removing exercise sets with weight & reps), workout details modal with volume calculations.
6. **Exercise Library**:
   - Searchable exercise directory, muscle-group filters, difficulty badges, detailed instructions modal, admin create/edit controls.
7. **Nutrition & Meal Tracker**:
   - Daily calorie/macro target rings (Calories, Protein, Carbs, Fats), grouped meals (Breakfast, Lunch, Dinner, Snacks), add food modal with instant macro computation, historical date selector.
8. **Progress & Body Measurement Log**:
   - Weight logging, body circumference measurements (chest, waist, arms, thighs), 1-week/1-month/3-month/1-year visual interactive charts, BMI & Body Fat estimators.
9. **Analytics Center**:
   - In-depth charts: Workout frequency over time, category distribution donut, total volume lifted progression, calorie intake vs burn comparison, macronutrient breakdown.
10. **Fitness Goals**:
    - Goal cards with animated progress meters, target dates, goal completion confetti celebration, modal for new goals.
11. **Reports & Exports**:
    - Select custom date ranges & report type (Workout, Nutrition, Progress, Comprehensive), live preview, one-click PDF generation & CSV export.
12. **Settings & Profile**:
    - Tabbed settings: Profile info & avatar, Preferences (KG/LBS, CM/FT), Appearance (Light/Dark/System), Security (Password change), Notifications, Account deactivation.
13. **Support & Feedback**:
    - Ticket submission form, status tracker badge, interactive chat thread with admin response simulation, expandable FAQ accordion.
14. **Admin Dashboard**:
    - Administrative metrics (total users, workouts logged, active tickets), user table with search, role toggle, account freeze/delete, exercise manager, ticket resolver.

### Phase 5: Verification, Testing & QA
1. Automated backend integration tests testing auth, protected routes, workout CRUD, nutrition logging, admin authorization.
2. End-to-end manual verification in the browser covering complete user lifecycle and admin workflows.
3. Production README.md and .env.example with thorough setup and academic eProject notes.

---

## 5. Verification Plan

### Automated Tests
- Running backend test suite with Jest / Supertest (`npm.cmd test` in server directory) testing:
  - Auth registration, login, JWT validation, role checks.
  - Workout & Nutrition CRUD API operations.
  - Protected route security (preventing cross-user data leakage).
  - Admin access restrictions.

### Manual Verification
- Browser testing with live backend & frontend dev servers:
  - Complete user registration and login flow.
  - Creating, editing, and filtering workouts with dynamic exercise sets.
  - Logging meals with auto-calculated macros and verifying progress meters.
  - Adding body measurements and verifying Chart.js graphs across time ranges.
  - Setting goals, viewing notifications, generating and downloading PDF/CSV reports.
  - Switching themes (Light/Dark) and checking mobile responsiveness.
  - Logging in as Admin to manage users and resolve support tickets.
