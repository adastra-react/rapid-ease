// app/store/slices/carRentalsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carRentals: [],
  loading: false,
  error: null,
  selectedCarRental: null,
  filters: {
    priceRange: [0, 1000],
    carTypes: [],
    availability: null,
  },
};

export const carRentalsSlice = createSlice({
  name: "carRentals",
  initialState,
  reducers: {
    fetchCarRentalsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCarRentalsSuccess: (state, action) => {
      state.carRentals = action.payload;
      state.loading = false;
    },
    fetchCarRentalsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectCarRental: (state, action) => {
      state.selectedCarRental = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  fetchCarRentalsStart,
  fetchCarRentalsSuccess,
  fetchCarRentalsFailure,
  selectCarRental,
  updateFilters,
} = carRentalsSlice.actions;
export default carRentalsSlice.reducer;
