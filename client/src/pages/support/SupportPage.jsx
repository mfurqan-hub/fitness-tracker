import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supportService } from '../../services/extraServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const SupportPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New Ticket Form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'feature',
    priority: 'medium',
    message: ''
  });

  // FAQ Expanded index state
  const [expandedFaq, setExpandedFaq] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await supportService.getTickets();
      if (res.success) {
        setTickets(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load support tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Subject and message are required.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await supportService.createTicket(newTicket);
      if (res.success) {
        toast.success('Support ticket submitted successfully!');
        setIsCreateOpen(false);
        setNewTicket({ subject: '', category: 'feature', priority: 'medium', message: '' });
        fetchTickets();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit ticket.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReplyMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setActionLoading(true);
      const res = await supportService.replyTicket(selectedTicket._id, { message: replyText.trim() });
      if (res.success) {
        toast.success('Reply transmitted.');
        setReplyText('');
        setSelectedTicket(res.data);
        fetchTickets();
      }
    } catch (err) {
      toast.error('Failed to send reply.');
    } finally {
      setActionLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How does FitPulse calculate estimated calories burned?',
      a: 'Calories burned are calculated from metabolic equivalent (MET) multipliers specific to your selected category (Strength, Cardio, HIIT) combined with duration and your profile body weight.'
    },
    {
      q: 'How are daily macronutrient recommendations derived?',
      a: 'Target macros use the Mifflin-St Jeor metabolic formula matched to your chosen primary objective (Muscle Gain: 30% Protein / 50% Carbs / 20% Fat; Weight Loss: 35% Protein / 35% Carbs / 30% Fat).'
    },
    {
      q: 'Can I export my fitness logs as PDF reports?',
      a: 'Yes! Navigate to the "Reports & Export" tab to generate and download comprehensive coaching summaries or raw CSV spreadsheets.'
    },
    {
      q: 'Is my biometric data private?',
      a: 'Yes. All records are isolated per user on MongoDB with strict authorization checks preventing unauthorized cross-user queries.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Help & Support Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Submit technical inquiries, report issues, or browse our knowledge base
          </p>
        </div>

        <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
          <Plus size={18} /> New Support Ticket
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left 2 Cols: User's Tickets */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <MessageSquare size={18} color="#10b981" /> My Support Inquiries ({tickets.length})
              </h3>
            </div>

            {loading ? (
              <CardSkeleton count={2} />
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <LifeBuoy size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem' }}>You have no open support tickets.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tickets.map((t) => {
                  const statusColors = {
                    open: 'badge-amber',
                    in_progress: 'badge-cyan',
                    resolved: 'badge-emerald',
                    closed: 'badge-gray'
                  };

                  return (
                    <div
                      key={t._id}
                      onClick={() => {
                        setSelectedTicket(t);
                        setIsDetailOpen(true);
                      }}
                      className="card card-interactive"
                      style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div className="flex items-center gap-2" style={{ marginBottom: '0.35rem' }}>
                          <span className={`badge ${statusColors[t.status] || 'badge-cyan'}`}>
                            {t.status?.replace('_', ' ')}
                          </span>
                          <span className="badge badge-purple">{t.category}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Updated {formatDate(t.updatedAt)}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{t.subject}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                          {t.messages?.length || 0} messages in thread
                        </div>
                      </div>

                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        View Conversation →
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: FAQ Accordion */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <HelpCircle size={18} color="#06b6d4" /> Frequently Asked Questions
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                    >
                      <span>{faq.q}</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0.75rem 1rem 1rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Conversation Detail Modal */}
      {selectedTicket && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Ticket #${selectedTicket._id.slice(-6)} - ${selectedTicket.subject}`}
          maxWidth="700px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald">{selectedTicket.status}</span>
              <span className="badge badge-purple">{selectedTicket.category}</span>
              <span className="badge badge-amber">{selectedTicket.priority} Priority</span>
            </div>

            {/* Chat Thread */}
            <div
              style={{
                maxHeight: '360px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {selectedTicket.messages?.map((msg, i) => {
                const isStaff = msg.isStaff;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: isStaff ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: isStaff ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                      alignSelf: isStaff ? 'flex-start' : 'flex-end',
                      maxWidth: '85%'
                    }}
                  >
                    <div className="flex items-center justify-between gap-3" style={{ marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.8rem', color: isStaff ? '#10b981' : 'var(--text-primary)' }}>
                        {msg.senderName}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {formatDateTime(msg.createdAt)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {msg.message}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleReplyMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type your message reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </Modal>
      )}

      {/* New Ticket Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Submit Support Request"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateTicket}>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sync error or Question on macro calculations"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
              >
                <option value="bug">Bug / Glitch Report</option>
                <option value="feature">Feature Request</option>
                <option value="account">Account & Profile</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Explain the issue or feedback in detail..."
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? 'Transmitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportPage;
