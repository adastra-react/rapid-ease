// // app/store/services/tourService.js

// import api from "./api";

// const tourService = {
//   getAllTours: async (params = {}) => {
//     try {
//       const response = await api.get("/tours", { params });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching tours:", error);
//       throw error;
//     }
//   },

//   getTourById: async (id) => {
//     try {
//       const response = await api.get(`/tours/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching tour details:", error);
//       throw error;
//     }
//   },

//   getSingleTour: async (id) => {
//     try {
//       // Based on your Postman request, the endpoint is /api/tours/single/:id
//       const response = await api.get(`/tours/single/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching single tour:", error);
//       throw error;
//     }
//   },

//   getTourStats: async () => {
//     try {
//       const response = await api.get("/tours/stats");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching tour stats:", error);
//       throw error;
//     }
//   },

//   getToursWithin: async (distance, latlng, unit) => {
//     try {
//       const response = await api.get(
//         `/tours/within/${distance}/center/${latlng}/unit/${unit}`
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching nearby tours:", error);
//       throw error;
//     }
//   },

//   // NEW: Delete tour
//   deleteTour: async (id) => {
//     try {
//       const response = await api.delete(`/tours/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting tour:", error);
//       throw error;
//     }
//   },
// };

// export default tourService;

// app/store/services/tourService.js

import api from "./api";

const tourService = {
  getAllTours: async (params = {}) => {
    try {
      const response = await api.get("/tours", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw error;
    }
  },

  getTourById: async (id) => {
    try {
      const response = await api.get(`/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tour details:", error);
      throw error;
    }
  },

  getSingleTour: async (id) => {
    try {
      const response = await api.get(`/tours/single/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching single tour:", error);
      throw error;
    }
  },

  getTourStats: async () => {
    try {
      const response = await api.get("/tours/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching tour stats:", error);
      throw error;
    }
  },

  getToursWithin: async (distance, latlng, unit) => {
    try {
      const response = await api.get(
        `/tours/within/${distance}/center/${latlng}/unit/${unit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching nearby tours:", error);
      throw error;
    }
  },

  // Update tour
  updateTour: async (id, tourData) => {
    try {
      const response = await api.patch(`/tours/${id}`, tourData);
      return response.data;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw error;
    }
  },

  // Delete tour
  deleteTour: async (id) => {
    try {
      const response = await api.delete(`/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw error;
    }
  },
};

export default tourService;
