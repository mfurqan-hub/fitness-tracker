# 🏋️ FitPulse — MERN Stack Fitness Tracker

A **production-grade, full-stack fitness tracking web application** built with the MERN stack (MongoDB, Express.js, React.js + Vite, Node.js). Designed for an academic eProject, this application reflects real-world SaaS architecture and modern UI/UX practices.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, React Router v6, Axios, Chart.js / react-chartjs-2, jsPDF |
| **Backend** | Node.js, Express.js, Mongoose ODM |
| **Database** | MongoDB (with auto-fallback to in-memory MongoDB for zero-config dev) |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Styling** | Vanilla CSS Design System (dark/light themes, glassmorphism, micro-animations) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
Fitness Tracker/
├── client/                         # React + Vite Frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── charts/             # Chart.js wrappers (Line, Bar, Doughnut)
│   │   │   ├── common/             # Modal, ConfirmDialog, StatCard, SkeletonLoader
│   │   │   └── layout/             # Navbar, Sidebar, Footer, DashboardLayout, AdminLayout
│   │   ├── context/                # AuthContext, ThemeContext, ToastContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── auth/               # LoginPage, RegisterPage
│   │   │   ├── dashboard/          # DashboardPage (KPIs, charts, quick actions)
│   │   │   ├── workouts/           # WorkoutsPage (CRUD, logging exercises)
│   │   │   ├── exercises/          # ExerciseLibraryPage (searchable + filterable)
│   │   │   ├── nutrition/          # NutritionPage (macro tracking, meal logging)
│   │   │   ├── progress/           # ProgressPage (body metrics history)
│   │   │   ├── analytics/          # AnalyticsPage (volume tonnage, category charts)
│   │   │   ├── goals/              # GoalsPage (create, track, complete goals)
│   │   │   ├── reports/            # ReportsPage (CSV/PDF export)
│   │   │   ├── settings/           # SettingsPage (profile, preferences, security)
│   │   │   ├── support/            # SupportPage (ticket system)
│   │   │   ├── admin/              # Admin Dashboard, Users, Exercises, Tickets, Logs
│   │   │   └── public/             # LandingPage, FeaturesPage, AboutPage, ContactPage
│   │   ├── routes/                 # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/               # api.js, authService, workoutService, etc.
│   │   └── utils/                  # formatters.js, calculations.js
│   └── vite.config.js              # Proxy: /api → localhost:5000
│
└── server/                         # Express.js Backend
    ├── config/                     # db.js (MongoDB + in-memory fallback), constants.js
    ├── controllers/                # 12 feature controllers
    ├── middleware/                 # auth, error, rate-limiter, upload middleware
    ├── models/                     # 10 Mongoose models
    ├── routes/                     # 12 route files
    ├── seeds/                      # seedDatabase.js + initialExercises.js
    ├── utils/                      # logger.js, apiResponse.js, tokenUtils.js
    └── server.js                   # Express app entry point
```

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based register/login with bcrypt password hashing
- Role-based access control: **User** and **Admin** roles
- Protected routes on both frontend and backend
- Session persistence via localStorage

### 📊 User Dashboard
- KPI cards: total workouts, calories burned, active time, streak
- Weekly volume trend (Line chart) and daily duration (Bar chart)
- Today's macros ring, active goals panel, and upcoming reminders
- Recent workout log with quick-add buttons

### 💪 Workouts Module
- Full CRUD for workout sessions with nested exercise sets
- Fields: title, category, duration, calories, notes, tags, exercises (name, sets, reps, weight)
- Filter by date/category, search, and sorting

### 📚 Exercise Library
- 40+ pre-seeded exercises across categories: Strength, Cardio, HIIT, Flexibility
- Search, filter by muscle group, category, and difficulty
- Admin can add/edit/delete exercises

### 🥗 Nutrition & Macros
- Daily meal logging with calories, protein, carbs, fat tracking
- Macro target doughnut chart vs. today's intake
- Historical log for past meals by date

### 📈 Body Progress
- Log body weight, body fat %, muscle mass, measurements
- Strength performance metrics: bench press, squat, deadlift
- Timeline chart for weight/fat progression

### 🎯 Goals
- Create fitness goals with target date, current vs. target values
- Status: Active → Completed → Abandoned
- Visual progress bar for each goal

### 📉 Analytics
- Workout category distribution (Doughnut chart)
- Weekly duration trend (Bar chart)
- Volume tonnage progression (Line chart)
- Big 3 compound lift strength progression

### 📋 Reports & Export
- Report preview with date range filtering
- **PDF export** using jsPDF
- **CSV export** via backend route

### ⚙️ Settings
- Edit profile: name, username, email, avatar URL, bio, age, gender, height, weight
- Fitness preferences: goals, calorie/macro targets, units (kg/lbs)
- Notification preferences
- Password change

### 🎧 Support System
- Submit support tickets with title, category, priority, and description
- View ticket history with status tracking (Open / In Progress / Closed)

### 🛡️ Admin Panel
- **Admin Dashboard**: Platform-wide stats (total users, workouts, active users)
- **User Management**: View, activate/deactivate, delete users
- **Exercise Management**: Add/edit/delete exercises from library
- **Support Tickets**: View all tickets, update statuses
- **System Logs**: Audit trail of admin actions

### 🎨 UI/UX
- **Dark/Light theme** toggle (CSS variables)
- Glassmorphism cards, smooth transitions, micro-animations
- Fully responsive layout (mobile sidebar collapse, breakpoints)
- Toast notifications for all actions
- Skeleton loaders for async data states

---

## 🏃 Getting Started

### Prerequisites
- **Node.js** v18+ (v24+ recommended)
- **npm** v9+
- **MongoDB** (optional — app auto-falls back to in-memory MongoDB)

### Installation

```bash
# 1. Install all dependencies (root, server, client)
cd "Fitness Tracker"
npm run install:all

# 2. Start both servers concurrently (from root)
npm run dev
```

Or start separately:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

### Environment Setup (Optional)

The `server/.env` is pre-configured for local development:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/fitness_tracker
JWT_SECRET=super_secret_fitness_tracker_jwt_key_2026_academic_project
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

If MongoDB is not installed, the app **automatically starts an in-memory MongoDB** and seeds demo data.

---

## 🧑‍💻 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@fitnesstracker.com` | `Admin123!` |
| **User** | `demo@fitnesstracker.com` | `Password123!` |

---

## 🔌 API Endpoints

| Module | Base Route | Methods |
|--------|-----------|---------|
| Auth | `/api/auth` | POST /register, POST /login, GET /me |
| Users | `/api/users` | GET /profile, PUT /profile, PUT /password |
| Workouts | `/api/workouts` | Full CRUD + GET /stats |
| Exercises | `/api/exercises` | Full CRUD |
| Nutrition | `/api/nutrition` | Full CRUD + GET /today |
| Progress | `/api/progress` | Full CRUD |
| Goals | `/api/goals` | Full CRUD |
| Notifications | `/api/notifications` | GET, PUT /read-all |
| Reminders | `/api/reminders` | Full CRUD |
| Reports | `/api/reports` | GET /preview, GET /export/csv, GET /export/pdf |
| Support | `/api/support/tickets` | Full CRUD + POST /:id/messages |
| Admin | `/api/admin` | GET /overview, GET /users, PUT /users/:id, DELETE /users/:id, GET /logs |

---

## 📦 Key Dependencies

### Backend
- `express`, `mongoose`, `dotenv`, `bcryptjs`, `jsonwebtoken`
- `cors`, `helmet`, `morgan`, `express-rate-limit`, `multer`
- `mongodb-memory-server` (zero-config fallback)
- `jspdf`, `jspdf-autotable` (PDF reports)

### Frontend
- `react`, `react-dom`, `react-router-dom`
- `axios` (HTTP client)
- `chart.js`, `react-chartjs-2` (charts)
- `lucide-react` (icons)
- `jspdf`, `jspdf-autotable` (client-side PDF)
- `canvas-confetti` (goal completion celebrations)

---

## 🎓 Academic Notes

This project demonstrates:
- **MVC Architecture** with clear separation of concerns
- **RESTful API Design** with consistent response patterns
- **JWT Authentication** with role-based authorization
- **Mongoose ODM** with schema validation and pre-save hooks
- **React Context API** for global state management (Auth, Theme, Toast, Notifications)
- **Custom React Hooks** and service abstraction layers
- **Error Handling** with custom middleware and graceful fallbacks
- **Security Middleware**: Helmet, CORS, Rate Limiting
- **Responsive Design** with CSS custom properties (design tokens)
- **Data Visualization** with Chart.js

---

*Built with ❤️ as a MERN eProject — FitPulse Fitness Tracker*
