// app/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import toursReducer from "./slices/toursSlice";
import bookingReducer from "./slices/bookingSlice";
import userReducer from "./slices/userSlice"; // You might want to add this later

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    booking: bookingReducer,
    user: userReducer, // For user authentication, wishlist, etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: if you have non-serializable values
    }),
});

// Optional: Export typed hooks if you add TypeScript later
export const RootState = store.getState;
export const AppDispatch = store.dispatch;
