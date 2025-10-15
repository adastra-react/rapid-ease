// app/lib/auth.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Check if user is logged in
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
};

// Get current token
export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });

    const { token, data } = response.data;

    // Save to localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/";
};

// Get current user
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// API call with auth token
export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await axios({
    url: `${API_URL}${endpoint}`,
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  return response.data;
};
