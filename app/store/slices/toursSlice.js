// app/store/slices/toursSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching a single tour
export const fetchTourById = createAsyncThunk(
  "tours/fetchTourById",
  async (tourId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tours/${tourId}`);
      if (!response.ok) throw new Error("Failed to fetch tour");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state structure based on your tour data
const initialState = {
  tours: [],
  selectedTour: null,
  loading: false,
  error: null,
  filters: {
    location: "",
    duration: "",
    priceRange: [0, 5000],
    rating: 0,
    category: "",
  },
  bookingInfo: {
    selectedDate: null,
    selectedTime: null,
    adultCount: 0,
    youthCount: 0,
    childrenCount: 0,
    addedServices: [],
    totalPrice: 0,
  },
};

const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    // Update filters
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Update booking info
    updateBookingInfo: (state, action) => {
      state.bookingInfo = { ...state.bookingInfo, ...action.payload };
    },
    // Calculate total price based on counts and prices
    calculateTotalPrice: (state) => {
      if (!state.selectedTour) return;

      const { adultPrice, youthPrice, childrenPrice } =
        state.selectedTour.pricing;
      const { adultCount, youthCount, childrenCount, addedServices } =
        state.bookingInfo;

      let total =
        adultPrice * adultCount +
        youthPrice * youthCount +
        childrenPrice * childrenCount;

      // Add any additional services
      addedServices.forEach((service) => {
        total += service.price;
      });

      state.bookingInfo.totalPrice = total;
    },
    // Toggle wishlist status for a tour
    toggleWishlist: (state, action) => {
      const tourId = action.payload;
      const tour = state.tours.find((t) => t.id === tourId);
      if (tour) {
        tour.isWishlisted = !tour.isWishlisted;
      }
      if (state.selectedTour && state.selectedTour.id === tourId) {
        state.selectedTour.isWishlisted = !state.selectedTour.isWishlisted;
      }
    },
    // Add a review for a tour
    addReview: (state, action) => {
      const { tourId, review } = action.payload;
      if (state.selectedTour && state.selectedTour.id === tourId) {
        state.selectedTour.reviews.push(review);
        // Recalculate average rating
        const totalRating = state.selectedTour.reviews.reduce(
          (sum, r) => sum + r.rating,
          0
        );
        state.selectedTour.rating =
          totalRating / state.selectedTour.reviews.length;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tours cases
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.selectedTour = action.payload;
        state.loading = false;
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateFilters,
  updateBookingInfo,
  calculateTotalPrice,
  toggleWishlist,
  addReview,
} = toursSlice.actions;

export default toursSlice.reducer;
