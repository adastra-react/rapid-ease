// app/store/index.js
// REMOVE "use client" - Redux store should work on both server and client

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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if you're using redux-persist or similar
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// These types are optional but helpful if using TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
