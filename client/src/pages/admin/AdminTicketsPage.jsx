import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  CheckCircle,
  Filter,
  Trash2
} from 'lucide-react';
import { supportService } from '../../services/extraServices';
import Modal from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const AdminTicketsPage = () => {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('in_progress');
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleOpenTicket = (t) => {
    setSelectedTicket(t);
    setStatusUpdate(t.status);
    setIsDetailOpen(true);
  };

  const handleStaffReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setActionLoading(true);
      const res = await supportService.replyTicket(selectedTicket._id, { message: replyText.trim() });
      if (res.success) {
        toast.success('Staff reply sent.');
        setReplyText('');
        setSelectedTicket(res.data);
        fetchTickets();
      }
    } catch (err) {
      toast.error('Failed to send staff reply.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await supportService.updateTicketStatus(selectedTicket._id, { status: newStatus });
      if (res.success) {
        toast.success(`Ticket status marked as ${newStatus}.`);
        setSelectedTicket(res.data);
        fetchTickets();
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Support Ticket Dispatch Desk</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Triage user inquiries, send official coach responses, and update resolution statuses
        </p>
      </div>

      <div className="card">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No support tickets in queue.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket ID / Subject</th>
                  <th>User</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{t.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{t._id.slice(-6)}</div>
                    </td>
                    <td>
                      <div>{t.user?.name || 'User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.user?.email || 'N/A'}</div>
                    </td>
                    <td><span className="badge badge-purple">{t.category}</span></td>
                    <td><span className="badge badge-amber">{t.priority}</span></td>
                    <td>
                      <span className={`badge ${t.status === 'resolved' ? 'badge-emerald' : t.status === 'in_progress' ? 'badge-cyan' : 'badge-amber'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(t.updatedAt)}</td>
                    <td>
                      <button onClick={() => handleOpenTicket(t)} className="btn btn-primary btn-sm">
                        Open Thread
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Details & Reply Modal */}
      {selectedTicket && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Support Dispatch - ${selectedTicket.subject}`}
          maxWidth="750px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-emerald">{selectedTicket.status}</span>
                <span className="badge badge-purple">{selectedTicket.category}</span>
                <span className="badge badge-amber">{selectedTicket.priority}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('in_progress')}
                  className="btn btn-secondary btn-sm"
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('resolved')}
                  className="btn btn-primary btn-sm"
                >
                  Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('closed')}
                  className="btn btn-ghost btn-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Conversation Log */}
            <div
              style={{
                maxHeight: '350px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                padding: '0.85rem',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {selectedTicket.messages?.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: msg.isStaff ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: msg.isStaff ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    alignSelf: msg.isStaff ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div className="flex items-center justify-between gap-4" style={{ marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: msg.isStaff ? '#10b981' : 'var(--text-primary)' }}>
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
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleStaffReply} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type official staff reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                <Send size={16} /> Send Reply
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminTicketsPage;
