import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Target,
  FileText,
  ShieldAlert,
  BellRing,
  BarChart,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const FeaturesPage = () => {
  const featuresList = [
    {
      icon: Dumbbell,
      color: 'emerald',
      title: 'Workout Tracker & Exercise Builder',
      desc: 'Create detailed workout logs with multiple categories (Strength, Cardio, HIIT, Flexibility). Add exercises dynamically with target sets, reps, weight (kg/lbs), and duration. Instant volume tonnage calculations.'
    },
    {
      icon: Layers,
      color: 'cyan',
      title: 'Curated Exercise Library',
      desc: 'Browse over 50 standard compound and isolation exercises categorized by muscle groups (Chest, Back, Legs, Shoulders, Arms, Core) with step-by-step coaching cues, equipment tags, and difficulty ratings.'
    },
    {
      icon: Apple,
      color: 'blue',
      title: 'Macro & Nutrition Ledger',
      desc: 'Log meals for Breakfast, Lunch, Dinner, and Snacks. Auto-computes total Calories, Protein, Carbohydrates, and Fats with visual progress towards your personalized daily calorie and macro goals.'
    },
    {
      icon: TrendingUp,
      color: 'purple',
      title: 'Body Composition & Circumferences',
      desc: 'Track weight, body fat %, muscle mass, and measurements for chest, waist, arms, and thighs. View historical graphs across 1-week, 1-month, 3-months, and 1-year timelines.'
    },
    {
      icon: Target,
      color: 'amber',
      title: 'Target Goal Management',
      desc: 'Set goals for weight loss, strength 1RM progression, or workout consistency. Watch progress bars advance automatically as you log workouts and measurements.'
    },
    {
      icon: FileText,
      color: 'rose',
      title: 'PDF & CSV Export Engine',
      desc: 'Filter user history by date ranges and export detailed coaching PDF reports or structured CSV spreadsheets for offline analysis and trainer consultations.'
    },
    {
      icon: BellRing,
      color: 'emerald',
      title: 'Smart In-App Reminders',
      desc: 'Schedule recurring daily reminders for morning workouts, meal logging, and water intake. Get real-time notifications whenever a milestone is conquered.'
    },
    {
      icon: ShieldAlert,
      color: 'rose',
      title: 'Elevated Admin Console',
      desc: 'Role-based access control allowing system administrators to monitor platform metrics, manage user accounts, oversee the exercise database, and reply to support tickets.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Full Feature Matrix
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem' }}>
            Engineered for Serious Fitness Enthusiasts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Discover all the specialized tools built into FitPulse to help you plan, log, analyze, and conquer your athletic objectives.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '4rem' }}>
          {featuresList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="card card-interactive" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div
                  className="stat-icon-wrapper"
                  style={{
                    background: f.color === 'emerald' ? 'rgba(16, 185, 129, 0.15)' :
                                f.color === 'cyan' ? 'rgba(6, 182, 212, 0.15)' :
                                f.color === 'blue' ? 'rgba(59, 130, 246, 0.15)' :
                                f.color === 'purple' ? 'rgba(139, 92, 246, 0.15)' :
                                f.color === 'amber' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: f.color === 'emerald' ? '#10b981' :
                           f.color === 'cyan' ? '#06b6d4' :
                           f.color === 'blue' ? '#3b82f6' :
                           f.color === 'purple' ? '#a78bfa' :
                           f.color === 'amber' ? '#fbbf24' : '#fb7185'
                  }}
                >
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Experience the FitPulse Difference</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Get started right away and take full command of your fitness journey.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Your Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
