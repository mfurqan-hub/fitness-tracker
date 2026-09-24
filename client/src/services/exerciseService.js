import api from './api';

export const exerciseService = {
  getExercises: async (params = {}) => {
    const res = await api.get('/exercises', { params });
    return res.data;
  },

  getExerciseById: async (id) => {
    const res = await api.get(`/exercises/${id}`);
    return res.data;
  },

  createExercise: async (exerciseData) => {
    const res = await api.post('/exercises', exerciseData);
    return res.data;
  },

  updateExercise: async (id, exerciseData) => {
    const res = await api.put(`/exercises/${id}`, exerciseData);
    return res.data;
  },

  deleteExercise: async (id) => {
    const res = await api.delete(`/exercises/${id}`);
    return res.data;
  }
};
