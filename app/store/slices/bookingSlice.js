// // app/store/slices/bookingSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const createBooking = createAsyncThunk(
//   "booking/createBooking",
//   async (bookingData, { rejectWithValue }) => {
//     try {
//       const response = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (!response.ok) throw new Error("Failed to create booking");
//       return await response.json();
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   currentBooking: null,
//   bookingHistory: [],
//   loading: false,
//   error: null,
//   step: "select-date", // Steps: select-date, participants, payment, confirmation
//   paymentInfo: {
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     nameOnCard: "",
//     saveCard: false,
//   },
// };

// const bookingSlice = createSlice({
//   name: "booking",
//   initialState,
//   reducers: {
//     setBookingStep: (state, action) => {
//       state.step = action.payload;
//     },
//     updateCurrentBooking: (state, action) => {
//       state.currentBooking = {
//         ...state.currentBooking,
//         ...action.payload,
//       };
//     },
//     updatePaymentInfo: (state, action) => {
//       state.paymentInfo = {
//         ...state.paymentInfo,
//         ...action.payload,
//       };
//     },
//     resetBooking: (state) => {
//       state.currentBooking = null;
//       state.step = "select-date";
//       state.paymentInfo = initialState.paymentInfo;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createBooking.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createBooking.fulfilled, (state, action) => {
//         state.loading = false;
//         state.bookingHistory.push(action.payload);
//         state.currentBooking = action.payload;
//         state.step = "confirmation";
//       })
//       .addCase(createBooking.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   setBookingStep,
//   updateCurrentBooking,
//   updatePaymentInfo,
//   resetBooking,
// } = bookingSlice.actions;

// export default bookingSlice.reducer;

// app/store/slices/bookingSlice.js - Updated with Round Trip and Group Pricing Support
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../services/bookingService";

// Create booking with enhanced data structure
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      // Use the booking service for consistent API calls
      const response = await bookingService.createBooking(bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create booking from sidebar and modal components
export const createBookingFromComponents = createAsyncThunk(
  "booking/createBookingFromComponents",
  async (
    { sidebarData, modalData, tourData, paymentData },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookingService.createBookingFromComponents(
        sidebarData,
        modalData,
        tourData,
        paymentData
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get booking by ID
export const fetchBooking = createAsyncThunk(
  "booking/fetchBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBooking(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get bookings by email
export const fetchBookingsByEmail = createAsyncThunk(
  "booking/fetchBookingsByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookingsByEmail(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update booking
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ bookingId, updates }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBooking(bookingId, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await bookingService.cancelBooking(bookingId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get available pickup times
export const fetchAvailablePickupTimes = createAsyncThunk(
  "booking/fetchAvailablePickupTimes",
  async ({ tourId, date }, { rejectWithValue }) => {
    try {
      const response = await bookingService.getAvailablePickupTimes(
        tourId,
        date
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get available return times
export const fetchAvailableReturnTimes = createAsyncThunk(
  "booking/fetchAvailableReturnTimes",
  async ({ tourId, date }, { rejectWithValue }) => {
    try {
      const response = await bookingService.getAvailableReturnTimes(
        tourId,
        date
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check pickup time availability
export const checkPickupTimeAvailability = createAsyncThunk(
  "booking/checkPickupTimeAvailability",
  async ({ tourId, date, time }, { rejectWithValue }) => {
    try {
      const response = await bookingService.checkPickupTimeAvailability(
        tourId,
        date,
        time
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Current booking state
  currentBooking: null,
  bookingHistory: [],

  // Loading states
  loading: false,
  error: null,

  // Booking flow steps
  step: "select-date", // Steps: select-date, trip-type, participants, payment, confirmation

  // Trip configuration
  tripConfiguration: {
    tripType: "one-way", // "one-way" or "round-trip"
    pickupDate: null,
    pickupTime: null,
    returnDate: null,
    returnTime: null,
  },

  // Guest information
  guestDetails: {
    adults: 0,
    youth: 0,
    children: 0,
  },

  // Pricing information
  pricingDetails: {
    groupBasePrice: 85,
    perPersonRate: 25,
    pricingType: "group", // "group" or "mixed"
    totalAmount: 0,
    breakdown: null,
  },

  // Additional services
  additionalServices: {
    isExtraService: false,
    isServicePerPerson: false,
    extraServiceCost: 0,
    servicePerPersonCost: 0,
  },

  // Customer information
  customerInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  },

  // Payment information
  paymentInfo: {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false,
    transactionId: null,
    paymentStatus: "pending",
  },

  // Available time slots
  availableTimeSlots: {
    pickupTimes: [],
    returnTimes: [],
    loading: false,
    error: null,
  },

  // Validation state
  validation: {
    errors: [],
    isValid: true,
  },
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Booking flow control
    setBookingStep: (state, action) => {
      state.step = action.payload;
    },

    nextStep: (state) => {
      const steps = [
        "select-date",
        "trip-type",
        "participants",
        "payment",
        "confirmation",
      ];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex < steps.length - 1) {
        state.step = steps[currentIndex + 1];
      }
    },

    previousStep: (state) => {
      const steps = [
        "select-date",
        "trip-type",
        "participants",
        "payment",
        "confirmation",
      ];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex > 0) {
        state.step = steps[currentIndex - 1];
      }
    },

    // Trip configuration
    updateTripConfiguration: (state, action) => {
      state.tripConfiguration = {
        ...state.tripConfiguration,
        ...action.payload,
      };

      // Clear return details if switching to one-way
      if (action.payload.tripType === "one-way") {
        state.tripConfiguration.returnDate = null;
        state.tripConfiguration.returnTime = null;
      }
    },

    setTripType: (state, action) => {
      state.tripConfiguration.tripType = action.payload;
      if (action.payload === "one-way") {
        state.tripConfiguration.returnDate = null;
        state.tripConfiguration.returnTime = null;
      }
    },

    setPickupDateTime: (state, action) => {
      const { date, time } = action.payload;
      state.tripConfiguration.pickupDate = date;
      state.tripConfiguration.pickupTime = time;
    },

    setReturnDateTime: (state, action) => {
      const { date, time } = action.payload;
      state.tripConfiguration.returnDate = date;
      state.tripConfiguration.returnTime = time;
    },

    // Guest details
    updateGuestDetails: (state, action) => {
      state.guestDetails = {
        ...state.guestDetails,
        ...action.payload,
      };

      // Recalculate pricing when guest count changes
      const totalGuests =
        state.guestDetails.adults +
        state.guestDetails.youth +
        state.guestDetails.children;
      if (totalGuests <= 4) {
        state.pricingDetails.pricingType = "group";
      } else {
        state.pricingDetails.pricingType = "mixed";
      }
    },

    setGuestCount: (state, action) => {
      const { type, count } = action.payload;
      state.guestDetails[type] = Math.max(0, count);
    },

    incrementGuest: (state, action) => {
      const type = action.payload;
      state.guestDetails[type] += 1;
    },

    decrementGuest: (state, action) => {
      const type = action.payload;
      if (state.guestDetails[type] > 0) {
        state.guestDetails[type] -= 1;
      }
    },

    // Pricing details
    updatePricingDetails: (state, action) => {
      state.pricingDetails = {
        ...state.pricingDetails,
        ...action.payload,
      };
    },

    calculateTotalAmount: (state) => {
      const { adults, youth, children } = state.guestDetails;
      const totalGuests = adults + youth + children;
      const { groupBasePrice, perPersonRate } = state.pricingDetails;
      const { tripType } = state.tripConfiguration;
      const { isExtraService, isServicePerPerson } = state.additionalServices;

      // Group pricing logic
      let baseCost = 0;
      if (totalGuests <= 4) {
        baseCost = groupBasePrice;
        state.pricingDetails.pricingType = "group";
      } else {
        baseCost = groupBasePrice + (totalGuests - 4) * perPersonRate;
        state.pricingDetails.pricingType = "mixed";
      }

      // Apply round trip multiplier
      if (tripType === "round-trip") {
        baseCost *= 2;
      }

      // Add additional services
      let additionalCost = 0;
      if (isExtraService) {
        additionalCost += 40;
      }
      if (isServicePerPerson) {
        additionalCost += totalGuests * 40;
      }

      state.pricingDetails.totalAmount = baseCost + additionalCost;
    },

    // Additional services
    updateAdditionalServices: (state, action) => {
      state.additionalServices = {
        ...state.additionalServices,
        ...action.payload,
      };
    },

    toggleExtraService: (state) => {
      state.additionalServices.isExtraService =
        !state.additionalServices.isExtraService;
    },

    toggleServicePerPerson: (state) => {
      state.additionalServices.isServicePerPerson =
        !state.additionalServices.isServicePerPerson;
    },

    // Customer information
    updateCustomerInfo: (state, action) => {
      state.customerInfo = {
        ...state.customerInfo,
        ...action.payload,
      };
    },

    // Payment information
    updatePaymentInfo: (state, action) => {
      state.paymentInfo = {
        ...state.paymentInfo,
        ...action.payload,
      };
    },

    setPaymentStatus: (state, action) => {
      state.paymentInfo.paymentStatus = action.payload;
    },

    setTransactionId: (state, action) => {
      state.paymentInfo.transactionId = action.payload;
    },

    // Current booking
    updateCurrentBooking: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload,
      };
    },

    // Validation
    setValidationErrors: (state, action) => {
      state.validation.errors = action.payload;
      state.validation.isValid = action.payload.length === 0;
    },

    clearValidationErrors: (state) => {
      state.validation.errors = [];
      state.validation.isValid = true;
    },

    // Reset functions
    resetBooking: (state) => {
      return {
        ...initialState,
        bookingHistory: state.bookingHistory, // Preserve history
      };
    },

    resetTripConfiguration: (state) => {
      state.tripConfiguration = initialState.tripConfiguration;
    },

    resetGuestDetails: (state) => {
      state.guestDetails = initialState.guestDetails;
    },

    resetCustomerInfo: (state) => {
      state.customerInfo = initialState.customerInfo;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.availableTimeSlots.error = null;
    },

    // Prepare booking data for submission
    prepareBookingData: (state) => {
      const bookingData = {
        // Trip details
        tripType: state.tripConfiguration.tripType,
        startDate: state.tripConfiguration.pickupDate,
        startTime: state.tripConfiguration.pickupTime,
        returnDate: state.tripConfiguration.returnDate,
        returnTime: state.tripConfiguration.returnTime,

        // Legacy support
        selectedDate: state.tripConfiguration.pickupDate,
        selectedTime: state.tripConfiguration.pickupTime,

        // Guest details
        adults: state.guestDetails.adults,
        youth: state.guestDetails.youth,
        children: state.guestDetails.children,

        // Pricing
        groupBasePrice: state.pricingDetails.groupBasePrice,
        perPersonRate: state.pricingDetails.perPersonRate,
        pricingType: state.pricingDetails.pricingType,
        totalAmount: state.pricingDetails.totalAmount,

        // Additional services
        isExtraService: state.additionalServices.isExtraService,
        isServicePerPerson: state.additionalServices.isServicePerPerson,
        additionalServices:
          state.additionalServices.isExtraService ||
          state.additionalServices.isServicePerPerson,

        // Customer information
        customerInfo: state.customerInfo,

        // Currency
        currency: "USD",
      };

      state.currentBooking = bookingData;
      return bookingData;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingHistory.push(action.payload);
        state.currentBooking = action.payload;
        state.step = "confirmation";
        state.paymentInfo.paymentStatus =
          action.payload.data?.paymentInfo?.status || "completed";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create booking from components
      .addCase(createBookingFromComponents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingFromComponents.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingHistory.push(action.payload);
        state.currentBooking = action.payload;
        state.step = "confirmation";
        state.paymentInfo.paymentStatus =
          action.payload.data?.paymentInfo?.status || "completed";
      })
      .addCase(createBookingFromComponents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch booking
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch bookings by email
      .addCase(fetchBookingsByEmail.fulfilled, (state, action) => {
        state.bookingHistory = action.payload.data.bookings || [];
      })

      // Update booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        // Update in history if exists
        const index = state.bookingHistory.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.bookingHistory[index] = action.payload;
        }
      })

      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        if (
          state.currentBooking &&
          state.currentBooking.id === action.payload.id
        ) {
          state.currentBooking = action.payload;
        }
        // Update in history
        const index = state.bookingHistory.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.bookingHistory[index] = action.payload;
        }
      })

      // Available pickup times
      .addCase(fetchAvailablePickupTimes.pending, (state) => {
        state.availableTimeSlots.loading = true;
        state.availableTimeSlots.error = null;
      })
      .addCase(fetchAvailablePickupTimes.fulfilled, (state, action) => {
        state.availableTimeSlots.loading = false;
        state.availableTimeSlots.pickupTimes =
          action.payload.data.availablePickupSlots || [];
      })
      .addCase(fetchAvailablePickupTimes.rejected, (state, action) => {
        state.availableTimeSlots.loading = false;
        state.availableTimeSlots.error = action.payload;
      })

      // Available return times
      .addCase(fetchAvailableReturnTimes.pending, (state) => {
        state.availableTimeSlots.loading = true;
        state.availableTimeSlots.error = null;
      })
      .addCase(fetchAvailableReturnTimes.fulfilled, (state, action) => {
        state.availableTimeSlots.loading = false;
        state.availableTimeSlots.returnTimes =
          action.payload.data.availableReturnSlots || [];
      })
      .addCase(fetchAvailableReturnTimes.rejected, (state, action) => {
        state.availableTimeSlots.loading = false;
        state.availableTimeSlots.error = action.payload;
      })

      // Check pickup time availability
      .addCase(checkPickupTimeAvailability.fulfilled, (state, action) => {
        // Could be used to update UI with availability status
        state.availableTimeSlots.lastChecked = {
          time: action.meta.arg.time,
          available: action.payload.data.available,
        };
      });
  },
});

export const {
  // Flow control
  setBookingStep,
  nextStep,
  previousStep,

  // Trip configuration
  updateTripConfiguration,
  setTripType,
  setPickupDateTime,
  setReturnDateTime,

  // Guest details
  updateGuestDetails,
  setGuestCount,
  incrementGuest,
  decrementGuest,

  // Pricing
  updatePricingDetails,
  calculateTotalAmount,

  // Additional services
  updateAdditionalServices,
  toggleExtraService,
  toggleServicePerPerson,

  // Customer and payment
  updateCustomerInfo,
  updatePaymentInfo,
  setPaymentStatus,
  setTransactionId,

  // Current booking
  updateCurrentBooking,

  // Validation
  setValidationErrors,
  clearValidationErrors,

  // Reset functions
  resetBooking,
  resetTripConfiguration,
  resetGuestDetails,
  resetCustomerInfo,

  // Utilities
  clearError,
  prepareBookingData,
} = bookingSlice.actions;

export default bookingSlice.reducer;
