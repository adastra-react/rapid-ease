// app/store/slices/toursSlice.js

"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourService from "../services/tourService";

// Async thunks
export const fetchTours = createAsyncThunk(
  "tours/fetchTours",
  async (_, { getState, rejectWithValue }) => {
    const { tours } = getState();
    const { currentPage, filters } = tours;

    try {
      const response = await tourService.getAllTours({
        page: currentPage,
        ...filters,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTourById = createAsyncThunk(
  "tours/fetchTourById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await tourService.getTourById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleTour = createAsyncThunk(
  "tours/fetchSingleTour",
  async (id, { rejectWithValue }) => {
    try {
      const response = await tourService.getSingleTour(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTourStats = createAsyncThunk(
  "tours/fetchTourStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await tourService.getTourStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  tours: [],
  tour: null,
  stats: null,
  totalTours: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  filters: {
    minPrice: null,
    maxPrice: null,
    minDuration: null,
    maxDuration: null,
    location: "",
    sort: "-createdAt",
  },
};

// Create slice
const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tours = []; // Clear tours while fetching
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        state.tours = action.payload.data.tours;
        state.totalTours = action.payload.totalTours;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tours";
      })

      // Handle fetchTourById
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        state.tour = action.payload.data.tour;
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tour";
      })

      // Handle fetchSingleTourContent
      .addCase(fetchSingleTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tour = null; // Clear current tour
      })
      .addCase(fetchSingleTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tour = action.payload.data.tour || action.payload.data;
      })
      .addCase(fetchSingleTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch single tour";
      })

      // Handle fetchTourStats
      .addCase(fetchTourStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data.stats;
      })
      .addCase(fetchTourStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tour stats";
      });
  },
});

export const { setFilters, resetFilters, setCurrentPage } = toursSlice.actions;
export default toursSlice.reducer;
