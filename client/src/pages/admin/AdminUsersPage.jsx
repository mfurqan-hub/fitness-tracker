import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { adminService } from '../../services/extraServices';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

const AdminUsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        search: search.trim(),
        role: roleFilter,
        page,
        limit: 15
      });
      if (res.success) {
        setUsers(res.data || []);
        setMeta(res.meta);
      }
    } catch (err) {
      toast.error('Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    try {
      const res = await adminService.updateUserStatus(user._id, { isActive: !user.isActive });
      if (res.success) {
        toast.success(`User account ${!user.isActive ? 'activated' : 'suspended'}.`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Action failed.');
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await adminService.updateUserStatus(user._id, { role: newRole });
      if (res.success) {
        toast.success(`User role changed to ${newRole.toUpperCase()}.`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Action failed.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      setActionLoading(true);
      await adminService.deleteUser(deletingId);
      toast.success('User and associated data purged.');
      setIsDeleteOpen(false);
      setDeletingId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>User Management Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Control user permissions, toggle account suspension status, and purge records
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '260px' }}>
            <div className="form-input-wrapper">
              <Search size={18} className="form-input-icon" />
              <input
                type="text"
                className="form-input form-input-with-icon"
                placeholder="Search athletes by name, email, or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Role Filter:</span>
            {['All', 'user', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
                className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No users matched your query.
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User / Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td><code>@{u.username}</code></td>
                    <td>
                      <button
                        onClick={() => handleRoleToggle(u)}
                        className={`badge ${u.role === 'admin' ? 'badge-rose' : 'badge-emerald'}`}
                        title="Click to toggle role"
                        style={{ cursor: 'pointer' }}
                      >
                        {u.role?.toUpperCase()}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`badge ${u.isActive ? 'badge-cyan' : 'badge-gray'}`}
                        title="Click to toggle status"
                        style={{ cursor: 'pointer' }}
                      >
                        {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(u.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setDeletingId(u._id);
                            setIsDeleteOpen(true);
                          }}
                          className="btn btn-ghost btn-icon btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Purge User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Purge User Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteUser}
        title="Purge User Account"
        message="Are you sure you want to permanently delete this user account along with all their logged workouts, meals, and progress records?"
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUsersPage;
