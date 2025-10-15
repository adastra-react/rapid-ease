// app/store/services/authService.js
import api from "./api";

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      if (response.data.status === "success") {
        // Store token and user data
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Signup user
  signup: async (name, email, password) => {
    try {
      const response = await api.post("/users/signup", {
        name,
        email,
        password,
      });

      if (response.data.status === "success") {
        // Store token and user data
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Signup failed" };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.get("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API response
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/me");
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get user data" };
    }
  },

  // Update current user
  updateMe: async (userData) => {
    try {
      const response = await api.patch("/users/updateMe", userData);

      // Update stored user data
      if (response.data.status === "success" && typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update profile" };
    }
  },

  // Update password
  updatePassword: async (passwordCurrent, password) => {
    try {
      const response = await api.patch("/users/updateMyPassword", {
        passwordCurrent,
        password,
      });

      // Update token
      if (response.data.status === "success" && typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update password" };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get stored token
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  // Get stored user
  getStoredUser: () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
