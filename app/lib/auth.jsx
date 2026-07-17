// app/lib/auth.js
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://rapid-ease-server.vercel.app/api"
    : "http://localhost:5000/api");

const TOKEN_KEYS = ["token", "authToken"];

const getStoredToken = () => {
  if (typeof window === "undefined") return null;

  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) {
      TOKEN_KEYS.forEach((targetKey) => {
        if (!localStorage.getItem(targetKey)) {
          localStorage.setItem(targetKey, value);
        }
      });
      return value;
    }
  }

  return null;
};

const getAlternateToken = (currentToken) => {
  if (typeof window === "undefined") return null;

  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value && value !== currentToken) {
      return value;
    }
  }

  return null;
};

const persistToken = (token) => {
  if (typeof window === "undefined") return;

  TOKEN_KEYS.forEach((key) => {
    localStorage.setItem(key, token);
  });
};

const clearStoredTokens = () => {
  if (typeof window === "undefined") return;

  TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
};

// Check if user is logged in
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!getStoredToken();
};

// Get current token
export const getToken = () => {
  return getStoredToken();
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
    persistToken(token);
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
  clearStoredTokens();
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
  const makeRequest = async (token) =>
    axios({
      url: `${API_URL}${endpoint}`,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

  const token = getToken();

  try {
    const response = await makeRequest(token);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      const alternateToken = getAlternateToken(token);

      if (alternateToken) {
        persistToken(alternateToken);
        const retryResponse = await makeRequest(alternateToken);
        return retryResponse.data;
      }
    }

    throw error;
  }
};
