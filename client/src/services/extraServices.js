import api from './api';

export const progressService = {
  getProgressHistory: async (params = {}) => {
    const res = await api.get('/progress', { params });
    return res.data;
  },

  addProgress: async (progressData) => {
    const res = await api.post('/progress', progressData);
    return res.data;
  },

  updateProgress: async (id, progressData) => {
    const res = await api.put(`/progress/${id}`, progressData);
    return res.data;
  },

  deleteProgress: async (id) => {
    const res = await api.delete(`/progress/${id}`);
    return res.data;
  }
};

export const goalService = {
  getGoals: async (params = {}) => {
    const res = await api.get('/goals', { params });
    return res.data;
  },

  createGoal: async (goalData) => {
    const res = await api.post('/goals', goalData);
    return res.data;
  },

  updateGoal: async (id, goalData) => {
    const res = await api.put(`/goals/${id}`, goalData);
    return res.data;
  },

  deleteGoal: async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
  }
};

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }
};

export const reminderService = {
  getReminders: async () => {
    const res = await api.get('/reminders');
    return res.data;
  },

  createReminder: async (reminderData) => {
    const res = await api.post('/reminders', reminderData);
    return res.data;
  },

  updateReminder: async (id, reminderData) => {
    const res = await api.put(`/reminders/${id}`, reminderData);
    return res.data;
  },

  deleteReminder: async (id) => {
    const res = await api.delete(`/reminders/${id}`);
    return res.data;
  }
};

export const reportService = {
  getReportPreview: async (params = {}) => {
    const res = await api.get('/reports/preview', { params });
    return res.data;
  },

  getCSVDownloadUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `/api/reports/export/csv?${query}`;
  },

  getPDFDownloadUrl: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return `/api/reports/export/pdf?${query}`;
  }
};

export const supportService = {
  getTickets: async () => {
    const res = await api.get('/support/tickets');
    return res.data;
  },

  getTicketById: async (id) => {
    const res = await api.get(`/support/tickets/${id}`);
    return res.data;
  },

  createTicket: async (ticketData) => {
    const res = await api.post('/support/tickets', ticketData);
    return res.data;
  },

  replyTicket: async (id, messageData) => {
    const res = await api.post(`/support/tickets/${id}/messages`, messageData);
    return res.data;
  },

  updateTicketStatus: async (id, statusData) => {
    const res = await api.put(`/support/tickets/${id}/status`, statusData);
    return res.data;
  }
};

export const adminService = {
  getOverview: async () => {
    const res = await api.get('/admin/overview');
    return res.data;
  },

  getUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  updateUserStatus: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  getSystemLogs: async (params = {}) => {
    const res = await api.get('/admin/logs', { params });
    return res.data;
  },

  getSettings: async () => {
    const res = await api.get('/admin/settings');
    return res.data;
  },

  updateSettings: async (settingsData) => {
    const res = await api.put('/admin/settings', settingsData);
    return res.data;
  }
};
