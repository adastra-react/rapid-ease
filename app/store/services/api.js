// // app/store/services/api.js
// import axios from "axios";

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
// const API_URL = "http://localhost:5001/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000, // Add timeout for mobile networks
// });

// // Safe localStorage access
// const getAuthToken = () => {
//   if (typeof window !== "undefined") {
//     try {
//       return localStorage.getItem("token");
//     } catch (error) {
//       console.warn("localStorage access failed:", error);
//       return null;
//     }
//   }
//   return null;
// };

// // Add auth token interceptor with mobile-safe localStorage access
// api.interceptors.request.use(
//   (config) => {
//     const token = getAuthToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor for better error handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error);
//     if (error.response) {
//       // Server responded with error status
//       console.error("Response data:", error.response.data);
//       console.error("Response status:", error.response.status);
//     } else if (error.request) {
//       // Request was made but no response received
//       console.error("No response received:", error.request);
//     } else {
//       // Something else happened
//       console.error("Error message:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// app/store/services/api.js - NO AUTHENTICATION

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - REMOVED AUTHENTICATION
api.interceptors.request.use(
  (config) => {
    // Just log the request for debugging
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      // Handle specific error codes if needed
      switch (error.response.status) {
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Request failed:", error.response.data?.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// // store/services/api.js
// import axios from "axios";

// // Create axios instance with base configuration
// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 10000,
// });

// // Request interceptor - Add authentication token
// api.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const token = localStorage.getItem("token");

//     // Add token to headers if it exists
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Log the request for debugging
//     console.log(
//       `Making ${config.method?.toUpperCase()} request to: ${config.url}`
//     );

//     return config;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // Server responded with error status
//       console.error("Response error:", {
//         status: error.response.status,
//         data: error.response.data,
//         url: error.config?.url,
//       });

//       // Handle specific error codes
//       switch (error.response.status) {
//         case 401:
//           // Unauthorized - clear token and redirect to login
//           console.error("Unauthorized - Please login again");
//           localStorage.removeItem("token");
//           // You can dispatch a logout action here if needed
//           if (typeof window !== "undefined") {
//             window.location.href = "/login";
//           }
//           break;
//         case 403:
//           console.error("Forbidden - You don't have permission");
//           break;
//         case 404:
//           console.error("Resource not found");
//           break;
//         case 500:
//           console.error("Server error");
//           break;
//         default:
//           console.error("Request failed:", error.response.data?.message);
//       }
//     } else if (error.request) {
//       // Request was made but no response received
//       console.error("No response received:", error.request);
//     } else {
//       // Something else happened
//       console.error("Error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
