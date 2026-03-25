// app/store/slices/toursSlice.js

"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { allTour } from "@/data/tours";
import tourService from "../services/tourService";

const DAY_IN_HOURS = 24;

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getCurrentPrice = (tour) => {
  const candidates = [tour?.price, tour?.pricing?.basePrice, tour?.fromPrice];
  const numericPrice = candidates.find(
    (value) => Number.isFinite(Number(value)) && Number(value) > 0
  );

  return Number(numericPrice || 0);
};

const getDurationHours = (duration) => {
  const value = normalizeText(duration);

  if (!value) {
    return null;
  }

  const dayMatch = value.match(/(\d+)\s*day/);
  if (dayMatch) {
    return Number(dayMatch[1]) * DAY_IN_HOURS;
  }

  const hourMatch = value.match(/(\d+)\s*hour/);
  if (hourMatch) {
    return Number(hourMatch[1]);
  }

  return null;
};

const inferTourTypes = (tour) => {
  const source = normalizeText(
    [tour?.feature, tour?.category, tour?.title, tour?.description, tour?.overview].join(" ")
  );
  const mappedTypes = [];

  if (/(nature|waterfall|lagoon|mountain|garden|falls|river)/.test(source)) {
    mappedTypes.push("Nature Tours");
  }

  if (/(adventure|climb|zipline|hike|cruise|marine|excursion)/.test(source)) {
    mappedTypes.push("Adventure Tours");
  }

  if (/(museum|history|historic|heritage|reggae|cultural|gallery|house)/.test(source)) {
    mappedTypes.push("Cultural Tours");
  }

  if (/(food|coffee|restaurant|taste|culinary|devon house)/.test(source)) {
    mappedTypes.push("Food Tours");
  }

  if (/(city|kingston|town|park|downtown)/.test(source)) {
    mappedTypes.push("City Tours");
  }

  if (/(cruise|boat|lagoon|coastal|beach|marine)/.test(source)) {
    mappedTypes.push("Cruises Tours");
  }

  return mappedTypes;
};

const filterFallbackTours = (tours, filters) =>
  tours.filter((tour) => {
    const price = getCurrentPrice(tour);
    const durationHours = getDurationHours(tour?.duration);
    const location = normalizeText(tour?.location);
    const selectedLocation = normalizeText(filters.location);
    const selectedTourTypes = filters.tourTypes || [];
    const availableTourTypes = inferTourTypes(tour);
    const rating = Number(tour?.rating);

    if (Number.isFinite(filters.minPrice) && price < filters.minPrice) {
      return false;
    }

    if (Number.isFinite(filters.maxPrice) && filters.maxPrice > 0 && price > filters.maxPrice) {
      return false;
    }

    if (selectedLocation && !location.includes(selectedLocation)) {
      return false;
    }

    if (
      selectedTourTypes.length > 0 &&
      !selectedTourTypes.some((type) => availableTourTypes.includes(type))
    ) {
      return false;
    }

    if (filters.minDuration !== null && durationHours !== null && durationHours < filters.minDuration) {
      return false;
    }

    if (filters.maxDuration !== null && durationHours !== null && durationHours > filters.maxDuration) {
      return false;
    }

    if (filters.minRating !== null && Number.isFinite(rating) && rating < filters.minRating) {
      return false;
    }

    if (filters.maxRating !== null && Number.isFinite(rating) && rating >= filters.maxRating) {
      return false;
    }

    return true;
  });

const sortFallbackTours = (tours, sort) => {
  const sortedTours = [...tours];

  switch (sort) {
    case "price":
      return sortedTours.sort((a, b) => getCurrentPrice(a) - getCurrentPrice(b));
    case "-price":
      return sortedTours.sort((a, b) => getCurrentPrice(b) - getCurrentPrice(a));
    case "-ratingCount":
      return sortedTours.sort((a, b) => Number(b?.ratingCount || 0) - Number(a?.ratingCount || 0));
    case "-rating":
      return sortedTours.sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0));
    case "-createdAt":
    default:
      return sortedTours;
  }
};

const buildFallbackToursResponse = (params = {}) => {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.max(Number(params.limit) || 10, 1);
  const filteredTours = filterFallbackTours(allTour, params);
  const sortedTours = sortFallbackTours(filteredTours, params.sort);
  const totalTours = sortedTours.length;
  const totalPages = Math.max(Math.ceil(totalTours / limit), 1);
  const startIndex = (page - 1) * limit;
  const paginatedTours = sortedTours.slice(startIndex, startIndex + limit);

  return {
    data: {
      tours: paginatedTours,
    },
    totalTours,
    totalPages,
    currentPage: Math.min(page, totalPages),
    isFallback: true,
  };
};

// Async thunks
export const fetchTours = createAsyncThunk(
  "tours/fetchTours",
  async (params = {}, { getState, rejectWithValue }) => {
    const { tours } = getState();
    const { currentPage, filters } = tours;

    try {
      const requestParams = {
        page: currentPage,
        ...filters,
        ...params,
      };

      const normalizedParams = Object.fromEntries(
        Object.entries(requestParams).flatMap(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === "" ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return [];
          }

          if (Array.isArray(value)) {
            return [[key, value.join(",")]];
          }

          return [[key, value]];
        })
      );

      const response = await tourService.getAllTours({
        ...normalizedParams,
      });
      return response;
    } catch (error) {
      console.warn("Falling back to local tours after API fetch failure:", error);
      return buildFallbackToursResponse({
        page: currentPage,
        limit: 10,
        ...filters,
        ...params,
      });
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

export const defaultTourFilters = {
  minPrice: 0,
  maxPrice: 100000,
  minDuration: null,
  maxDuration: null,
  minRating: null,
  maxRating: null,
  location: "",
  tourTypes: [],
  sort: "-createdAt",
};

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
  filters: defaultTourFilters,
};

// Create slice
const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
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
        state.error = null;
        state.tours = action.payload.data.tours;
        state.totalTours = action.payload.totalTours;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage || state.currentPage;
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
