import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Database,
  Layers,
  ShieldCheck,
  Server,
  Cpu,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const AboutPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
            <GraduationCap size={14} /> Academic eProject Portfolio
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem' }}>
            About the FitPulse Architecture
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
            FitPulse is a modern full-stack web application demonstrating production-grade software engineering, responsive UI/UX, and robust REST APIs using the MERN ecosystem.
          </p>
        </div>

        {/* Tech Stack Highlights */}
        <div className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={22} color="#10b981" /> The MERN Technology Stack
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: '#10b981', fontWeight: 700 }}>
                <Database size={18} /> MongoDB & Mongoose
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Schema-driven NoSQL database with indexing, validation, automated pre-save aggregations, and resilient connection failover.
              </p>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: '#06b6d4', fontWeight: 700 }}>
                <Server size={18} /> Express.js & Node.js
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Modular RESTful API with route-level rate limiting, centralized error handling, custom logging, and PDFKit report compilation.
              </p>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: '#3b82f6', fontWeight: 700 }}>
                <Layers size={18} /> React 18 & Vite
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Lightning-fast single page application with React Context state management, React Router v6 navigation, and dynamic Chart.js canvas renderers.
              </p>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: '#a78bfa', fontWeight: 700 }}>
                <ShieldCheck size={18} /> Security & Auth
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Bcrypt password hashing, JSON Web Tokens (JWT), role-based middleware access control, CORS enforcement, and Helmet protection.
              </p>
            </div>
          </div>
        </div>

        {/* Project Objectives */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={22} color="#06b6d4" /> Design Philosophy
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
            Unlike standard student CRUD demos that display static or fake mock data, FitPulse is engineered to be a living, breathing fitness tracker. Every exercise added modifies your volume progression, every meal logged recalibrates your macro charts in real time, and goal achievements trigger instant system feedback.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
