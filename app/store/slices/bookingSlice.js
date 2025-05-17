// app/store/slices/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error("Failed to create booking");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentBooking: null,
  bookingHistory: [],
  loading: false,
  error: null,
  step: "select-date", // Steps: select-date, participants, payment, confirmation
  paymentInfo: {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false,
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingStep: (state, action) => {
      state.step = action.payload;
    },
    updateCurrentBooking: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload,
      };
    },
    updatePaymentInfo: (state, action) => {
      state.paymentInfo = {
        ...state.paymentInfo,
        ...action.payload,
      };
    },
    resetBooking: (state) => {
      state.currentBooking = null;
      state.step = "select-date";
      state.paymentInfo = initialState.paymentInfo;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingHistory.push(action.payload);
        state.currentBooking = action.payload;
        state.step = "confirmation";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setBookingStep,
  updateCurrentBooking,
  updatePaymentInfo,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
