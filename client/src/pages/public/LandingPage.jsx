import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Activity,
  Flame,
  Apple,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  BarChart2,
  Calendar,
  Sparkles,
  Users,
  Target
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '5rem 1.5rem 6rem' }}>
        {/* Background glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px' }}>
          <div className="inline-flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
            <span className="badge badge-emerald" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
              <Sparkles size={14} /> Modern MERN Stack Fitness Intelligence
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.5rem'
            }}
          >
            Track Workouts. Master Nutrition.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Elevate Your Fitness.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '750px',
              margin: '0 auto 2.5rem'
            }}
          >
            The all-in-one athletic tracking dashboard. Build custom exercise routines, log daily macros, track body composition trends, and visualize performance with real-time MongoDB analytics.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap" style={{ marginBottom: '2rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ minWidth: '180px' }}>
              Sign In to FitPulse
            </Link>
          </div>
        </div>
      </section>

      {/* Live Dashboard Preview Feature Section */}
      <section style={{ padding: '2rem 1.5rem 5rem', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            className="card"
            style={{
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-secondary) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '2rem' }}>
              <div className="stat-widget">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <Flame size={24} />
                </div>
                <div>
                  <div className="stat-label">Daily Calories</div>
                  <div className="stat-value">2,450 <span style={{ fontSize: '0.85rem' }}>kcal</span></div>
                </div>
              </div>

              <div className="stat-widget">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                  <Dumbbell size={24} />
                </div>
                <div>
                  <div className="stat-label">Weekly Volume</div>
                  <div className="stat-value">18,400 <span style={{ fontSize: '0.85rem' }}>kg</span></div>
                </div>
              </div>

              <div className="stat-widget">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
                  <Activity size={24} />
                </div>
                <div>
                  <div className="stat-label">Body Weight</div>
                  <div className="stat-value">75.5 <span style={{ fontSize: '0.85rem' }}>kg</span></div>
                </div>
              </div>

              <div className="stat-widget">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  <Target size={24} />
                </div>
                <div>
                  <div className="stat-label">Active Goals</div>
                  <div className="stat-value">3 <span style={{ fontSize: '0.85rem' }}>milestones</span></div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Dynamic Real-Time UI</span>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Clean, Responsive Visual Analytics</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Every metric is backed by robust MongoDB queries, aggregate pipelines, and automated recalculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>Comprehensive Capabilities</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Everything You Need to Reach Peak Physique</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card card-interactive">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', marginBottom: '1.25rem' }}>
                <Dumbbell size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Dynamic Workout Logging</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Log exercises with dynamic sets, reps, weight, and rest durations. Auto-calculates total tonnage and estimated calorie expenditure.
              </p>
            </div>

            <div className="card card-interactive">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', marginBottom: '1.25rem' }}>
                <Apple size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nutrition & Macro Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Categorize meals across Breakfast, Lunch, Dinner, and Snacks. Instant breakdown of Protein, Carbohydrates, Fats, and daily hydration.
              </p>
            </div>

            <div className="card card-interactive">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', marginBottom: '1.25rem' }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Body Progress & Metrics</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Log weight, body fat %, and circumference measurements. Visualize changes over 1 week, 1 month, 3 months, or full year timelines.
              </p>
            </div>

            <div className="card card-interactive">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', marginBottom: '1.25rem' }}>
                <Target size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Smart Goal Milestones</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Set weight loss, strength 1RM, or workout frequency goals. Receive celebratory notifications when targets are conquered.
              </p>
            </div>

            <div className="card card-interactive">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', marginBottom: '1.25rem' }}>
                <BarChart2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>PDF & CSV Report Exports</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Export clean medical/coaching PDF summaries or raw CSV data spreadsheets for any custom date range at the click of a button.
              </p>
            </div>

            <div className="card card-interactive">
              <div className="stat-icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Role-Based Admin Panel</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Dedicated administration portal for managing users, exercise library catalog, support tickets, and system audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>
            Ready to Take Control of Your Health?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join FitPulse today and experience the next generation of personal fitness analytics.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
