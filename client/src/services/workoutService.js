import api from './api';

export const workoutService = {
  getWorkouts: async (params = {}) => {
    const res = await api.get('/workouts', { params });
    return res.data;
  },

  getWorkoutById: async (id) => {
    const res = await api.get(`/workouts/${id}`);
    return res.data;
  },

  createWorkout: async (workoutData) => {
    const res = await api.post('/workouts', workoutData);
    return res.data;
  },

  updateWorkout: async (id, workoutData) => {
    const res = await api.put(`/workouts/${id}`, workoutData);
    return res.data;
  },

  deleteWorkout: async (id) => {
    const res = await api.delete(`/workouts/${id}`);
    return res.data;
  },

  getWorkoutStats: async () => {
    const res = await api.get('/workouts/stats/summary');
    return res.data;
  }
};
