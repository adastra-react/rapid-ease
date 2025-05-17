// app/store/services/tourService.js
import api from "./api";

export const tourService = {
  getAllTours: async (params = {}) => {
    try {
      const response = await api.get("/tours", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTourById: async (id) => {
    try {
      const response = await api.get(`/tours/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTourStats: async () => {
    try {
      const response = await api.get("/tours/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
