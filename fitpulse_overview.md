# 🏋️ FitPulse — Complete Project Overview

> **Stack:** React (Vite) + Node.js (Express) + MongoDB | Auth: JWT + Firebase Google + Email OTP

---

## 🌐 Public Pages (Koi bhi dekh sakta hai — No Login Required)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Hero section, app ka intro, CTA buttons |
| `/features` | Features Page | Platform ki features ka showcase |
| `/about` | About Page | Project ke baare mein |
| `/contact` | Contact Page | Contact form |
| `*` | 404 Not Found | Invalid routes |

---

## 🔐 Authentication Pages (Public — Login ke bahar)

| Route | Page | Kya hota hai |
|-------|------|-------------|
| `/register` | Register Page | Account banao → **OTP email pe aata hai** → 6-digit verify karo |
| `/login` | Login Page | Email/Password **ya** Google se login |
| `/forgot-password` | Forgot Password | Email dalo → reset link milega |
| `/reset-password` | Reset Password | Naya password set karo (token se) |
| `/verify-email` | Verify Email | Legacy link-based verify (purani compatibility) |

### 🔑 Auth Flow (Naya System)
```
Register → OTP (6-digit) email pe → Verify → Dashboard
Google Sign-In → Direct Dashboard (auto-verified)
Login → Dashboard / Admin Panel
```

---

## 👤 USER Panel (Login Required — `/dashboard` layout)

### 1️⃣ Dashboard `/dashboard`
- **Today's Summary** — calories, workouts, water, steps ka overview
- **Recent Workouts** listing
- **Macro Progress** bars (protein, carbs, fat)
- **Quick Add** shortcuts (log workout, meal, water)
- **Goals Progress** visual cards
- **Motivational Stats** & streaks

### 2️⃣ Workouts `/workouts`
| Feature | Detail |
|---------|--------|
| Workout List | Apne saare logged workouts dekho |
| Log New Workout | Exercise add karo, sets/reps/weight |
| Edit/Delete | Koi bhi workout update ya delete karo |
| Workout Stats | Total duration, calories burned summary |
| Filter | Date range aur type ke hisaab se filter |

### 3️⃣ Exercise Library `/exercises`
| Feature | Detail |
|---------|--------|
| Browse Exercises | Puri library — 100+ exercises |
| Search & Filter | Muscle group, equipment, difficulty se filter |
| Exercise Detail | Description, how-to, muscles worked |
| Custom Exercise | Apna exercise banao (protected) |
| Edit/Delete | Apne custom exercises manage karo |

### 4️⃣ Nutrition `/nutrition`
| Feature | Detail |
|---------|--------|
| Meal Log | Breakfast, Lunch, Dinner, Snacks log karo |
| Macro Tracking | Calories, Protein, Carbs, Fat daily targets |
| Water Tracker | Daily water intake log karo (ml) |
| Food History | Previous meals dekho |
| Daily Summary | Pie charts aur progress bars |
| Edit/Delete Meals | Koi bhi entry update ya hataao |

### 5️⃣ Progress `/progress`
| Feature | Detail |
|---------|--------|
| Weight Log | Date-wise weight entries |
| Progress History | Table aur list view mein sab records |
| Add/Edit/Delete | Entries manage karo |
| Visual Charts | Weight trend graph |
| Body Measurements | (if logged) |

### 6️⃣ Analytics `/analytics`
| Feature | Detail |
|---------|--------|
| Workout Analytics | Weekly/Monthly workout frequency |
| Calorie Trends | Nutrition intake ka graph |
| Progress Charts | Weight change over time |
| Performance Stats | Personal bests, averages |

### 7️⃣ Goals `/goals`
| Feature | Detail |
|---------|--------|
| Create Goal | Weight loss, muscle gain, endurance etc. |
| Goal Progress | % complete indicator |
| Update/Delete | Goals manage karo |
| Goal Types | Fitness goal categories |

### 8️⃣ Reports `/reports`
| Feature | Detail |
|---------|--------|
| Report Preview | Date range select karo — summary dekho |
| Export CSV | Data CSV mein download karo |
| Export PDF | PDF report download karo |
| Filter Options | Workout, nutrition, progress by date |

### 9️⃣ Settings `/settings`
| Feature | Detail |
|---------|--------|
| Profile Edit | Name, username, bio, age, height, weight update |
| Avatar Upload | Profile picture upload karo |
| Password Change | Current → new password |
| Unit Preferences | kg/lbs, cm/ft, km/miles |
| Theme | Light / Dark / System |
| Notification Prefs | Workout, meal, goal reminders toggle |
| Fitness Goal | Primary goal update karo |

### 🔟 Support `/support`
| Feature | Detail |
|---------|--------|
| Create Ticket | Issue/complaint submit karo |
| View Tickets | Apne saare tickets dekho |
| Ticket Detail | Status, messages thread |
| Reply | Ticket pe reply karo |
| Status | Open / In Progress / Resolved |

### 🔔 Notifications (Sidebar/Header)
- Workout, meal, goal reminders
- Mark as read (single/all)
- Delete notifications

---

## 👑 ADMIN Panel (Admin Role Required — `/admin` layout)

### 1️⃣ Admin Dashboard `/admin/dashboard`
| Stats | Description |
|-------|-------------|
| Total Users | Platform pe registered users |
| Active Today | Aaj login karne wale |
| Total Workouts | Platform-wide workout count |
| Total Tickets | Open support tickets |
| Recent Registrations | Nayi signups |
| Platform Overview Cards | Graphs aur metrics |

### 2️⃣ User Management `/admin/users`
| Feature | Detail |
|---------|--------|
| All Users List | Naam, email, role, status, join date |
| Search & Filter | Email/name se search, role filter |
| Activate/Deactivate | User account on/off karo |
| Delete User | Account permanently delete |
| View User Info | Auth provider, email verified status |
| Pagination | Large user lists manage karo |

### 3️⃣ Exercise Management `/admin/exercises`
| Feature | Detail |
|---------|--------|
| Browse All Exercises | Platform ki puri exercise library |
| Add Exercise | Nayi exercise create karo (global) |
| Edit Exercise | Name, description, muscles, difficulty update |
| Delete Exercise | Library se hataao |
| Search & Filter | Category, muscle group, equipment |

### 4️⃣ Support Tickets `/admin/tickets`
| Feature | Detail |
|---------|--------|
| All Tickets | Platform ke saare tickets |
| Ticket Detail | User ka message thread dekho |
| Reply to User | Admin ki taraf se respond karo |
| Update Status | Open → In Progress → Resolved |
| Filter | Status ke hisaab se filter |

### 5️⃣ System Logs `/admin/logs`
| Feature | Detail |
|---------|--------|
| Activity Log | USER_REGISTER, USER_LOGIN, EMAIL_VERIFIED, PASSWORD_RESET etc. |
| Filter by Severity | Info, Warning, Error |
| Filter by Action | Action type se filter |
| Timestamp | Exact date/time |
| User Info | Konse user ne kya kiya |
| IP Address | Request IP |

### 6️⃣ Reports `/admin/reports`
| Feature | Detail |
|---------|--------|
| Platform Analytics | Overall usage stats |
| User Growth Graph | Month-wise signups |
| Workout Stats | Platform-wide activity |
| Export Options | Data download |

### 7️⃣ System Settings `/admin/settings`
| Feature | Detail |
|---------|--------|
| User Registration Toggle | Nayi registrations allow/block |
| Platform Config | Global settings manage karo |
| Maintenance Mode | (if applicable) |

---

## 🏗️ Backend API Summary

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Kya karta hai |
|--------|----------|--------------|
| POST | `/register` | Account banao + OTP bhejo |
| POST | `/send-otp` | OTP resend karo |
| POST | `/verify-otp` | OTP verify karo |
| POST | `/login` | Email/password login |
| POST | `/firebase` | Google sign-in |
| POST | `/forgot-password` | Reset link bhejo |
| POST | `/reset-password` | Password reset |
| GET | `/me` | Current user info |
| PUT | `/update-password` | Password change |

### User Endpoints (`/api/users`) — Protected
| Method | Endpoint | Kya karta hai |
|--------|----------|--------------|
| PUT | `/profile` | Profile update |
| POST | `/avatar` | Photo upload |
| PUT | `/preferences` | Settings update |

### Data Endpoints — All Protected
| Module | Base Route | CRUD |
|--------|-----------|------|
| Workouts | `/api/workouts` | Full CRUD + Stats |
| Nutrition | `/api/nutrition` | Full CRUD + Water log |
| Progress | `/api/progress` | Full CRUD |
| Goals | `/api/goals` | Full CRUD |
| Exercises | `/api/exercises` | Browse (public) + CRUD (auth) |
| Reports | `/api/reports` | Preview + CSV + PDF export |
| Support | `/api/support/tickets` | CRUD + messages |
| Notifications | `/api/notifications` | Get + Read + Delete |

### Admin Endpoints (`/api/admin`) — Admin Only
| Method | Endpoint | Kya karta hai |
|--------|----------|--------------|
| GET | `/overview` | Platform stats |
| GET | `/users` | All users |
| PUT | `/users/:id` | User status update |
| DELETE | `/users/:id` | User delete |
| GET | `/logs` | System logs |
| GET | `/settings` | Platform settings |
| PUT | `/settings` | Settings update |

---

## 🔒 Security Architecture

| Feature | Detail |
|---------|--------|
| Auth | JWT (30 days expiry) |
| Social Auth | Firebase Google only |
| Email Verify | 6-digit OTP (10 min expiry, max 5 resends) |
| Password Reset | Crypto token (1 hour expiry) |
| Rate Limiting | Auth endpoints pe limited requests |
| Role Guard | `protect` middleware + `authorize(ROLES.ADMIN)` |
| Password Hashing | bcryptjs (salt 10) |

---

## 📁 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Vanilla CSS (custom design system) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + Firebase Admin SDK |
| **Email** | Nodemailer (SMTP) |
| **File Upload** | Multer (avatar) |
| **Logging** | Custom logger |
| **Dev DB** | MongoDB Memory Server (dev mode) |

---

> **Note:** SMTP configure karo server `.env` mein real emails ke liye. Development mein OTP server console logs mein print hota hai.
