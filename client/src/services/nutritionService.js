import api from './api';

export const nutritionService = {
  getNutritionLogs: async (params = {}) => {
    const res = await api.get('/nutrition', { params });
    return res.data;
  },

  addMealLog: async (mealData) => {
    const res = await api.post('/nutrition', mealData);
    return res.data;
  },

  updateMealLog: async (id, mealData) => {
    const res = await api.put(`/nutrition/${id}`, mealData);
    return res.data;
  },

  deleteMealLog: async (id) => {
    const res = await api.delete(`/nutrition/${id}`);
    return res.data;
  },

  logWater: async (waterData) => {
    const res = await api.post('/nutrition/water', waterData);
    return res.data;
  }
};
