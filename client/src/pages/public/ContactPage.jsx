import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Phone } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useToast } from '../../context/ToastContext';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your message has been received.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
            <MessageSquare size={14} /> Get in Touch
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '1rem' }}>
            Contact the FitPulse Engineering Team
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Have questions regarding this academic MERN application, feature requests, or bug reports? We would love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Contact Information</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="flex items-start gap-3">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', width: '2.75rem', height: '2.75rem' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Project Email</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>support@fitpulse-tracker.com</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', width: '2.75rem', height: '2.75rem' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Academic Institution</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Computer Science Department</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', width: '2.75rem', height: '2.75rem' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>API Endpoint Support</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Available 24/7 via In-App Support Tickets</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card" style={{ padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Message Transmitted!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Your inquiry has been successfully queued for our team.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Project Inquiry / Feedback"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} /> Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
