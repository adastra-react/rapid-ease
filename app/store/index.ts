// app/store/index.js
"use client";

import { configureStore } from "@reduxjs/toolkit";
import toursReducer from "./slices/toursSlice";
import bookingReducer from "./slices/bookingSlice";
import carRentalsReducer from "./slices/carRentalsSlice";

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    bookings: bookingReducer,
    carRentals: carRentalsReducer,
    // Add other reducers as needed
  },
});

// These types are optional but helpful if using TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
