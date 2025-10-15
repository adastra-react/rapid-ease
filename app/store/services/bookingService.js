// // app/store/services/bookingService.js - WiPay Integration Removed
// class BookingService {
//   constructor() {
//     this.baseURL =
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
//   }

//   async createBooking(bookingData) {
//     try {
//       console.log("🇯🇲 Creating booking via API:", bookingData);

//       const response = await fetch(`${this.baseURL}/bookings`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to create booking");
//       }

//       console.log("✅ Booking created successfully:", data);
//       return data;
//     } catch (error) {
//       console.error("❌ Error creating booking:", error);
//       throw error;
//     }
//   }

//   async getBooking(bookingId) {
//     try {
//       const response = await fetch(`${this.baseURL}/bookings/${bookingId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to get booking");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Error getting booking:", error);
//       throw error;
//     }
//   }

//   async getBookingsByEmail(email) {
//     try {
//       const response = await fetch(
//         `${this.baseURL}/bookings/email/${encodeURIComponent(email)}`
//       );
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to get bookings");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Error getting bookings by email:", error);
//       throw error;
//     }
//   }

//   async getAllBookings(filters = {}) {
//     try {
//       const params = new URLSearchParams();

//       if (filters.email) params.append("email", filters.email);
//       if (filters.status) params.append("status", filters.status);
//       if (filters.page) params.append("page", filters.page);
//       if (filters.limit) params.append("limit", filters.limit);

//       const url = `${this.baseURL}/bookings${
//         params.toString() ? "?" + params.toString() : ""
//       }`;
//       const response = await fetch(url);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to get bookings");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Error getting all bookings:", error);
//       throw error;
//     }
//   }

//   async updateBooking(bookingId, updates) {
//     try {
//       const response = await fetch(`${this.baseURL}/bookings/${bookingId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updates),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to update booking");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Error updating booking:", error);
//       throw error;
//     }
//   }

//   async cancelBooking(bookingId) {
//     try {
//       const response = await fetch(
//         `${this.baseURL}/bookings/${bookingId}/cancel`,
//         {
//           method: "PATCH",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to cancel booking");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Error cancelling booking:", error);
//       throw error;
//     }
//   }

//   async deleteBooking(bookingId) {
//     try {
//       const response = await fetch(`${this.baseURL}/bookings/${bookingId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || "Failed to delete booking");
//       }

//       return { status: "success" };
//     } catch (error) {
//       console.error("❌ Error deleting booking:", error);
//       throw error;
//     }
//   }

//   async getBookingStats() {
//     try {
//       const response = await fetch(`${this.baseURL}/bookings/stats/monthly`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to get booking stats");
//       }

//       return data;
//     } catch (error) {
//       console.error("❌ Error getting booking stats:", error);
//       throw error;
//     }
//   }

//   // Helper method to format Jamaica phone numbers
//   formatJamaicaPhone(phone) {
//     const cleanPhone = phone.replace(/\D/g, "");

//     if (cleanPhone.startsWith("876") && cleanPhone.length === 10) {
//       return cleanPhone;
//     } else if (cleanPhone.startsWith("1876") && cleanPhone.length === 11) {
//       return cleanPhone.substring(1);
//     } else if (cleanPhone.length === 7) {
//       return "876" + cleanPhone;
//     }

//     return cleanPhone;
//   }

//   // Helper method to validate booking data
//   validateBookingData(bookingData) {
//     const errors = [];

//     // Required fields
//     if (!bookingData.tour) errors.push("Tour ID is required");
//     if (!bookingData.startDate) errors.push("Start date is required");
//     if (!bookingData.customerInfo) {
//       errors.push("Customer information is required");
//     } else {
//       if (!bookingData.customerInfo.firstName)
//         errors.push("First name is required");
//       if (!bookingData.customerInfo.lastName)
//         errors.push("Last name is required");
//       if (!bookingData.customerInfo.email) errors.push("Email is required");
//       if (!bookingData.customerInfo.phone)
//         errors.push("Phone number is required");
//     }

//     // Guest count validation
//     const totalGuests =
//       (bookingData.adults || 0) +
//       (bookingData.youth || 0) +
//       (bookingData.children || 0);
//     if (totalGuests === 0) {
//       errors.push("At least one guest is required");
//     }

//     // Jamaica phone validation
//     if (bookingData.customerInfo?.phone) {
//       const cleanPhone = this.formatJamaicaPhone(
//         bookingData.customerInfo.phone
//       );
//       if (!cleanPhone.startsWith("876") || cleanPhone.length !== 10) {
//         errors.push("Please provide a valid Jamaica phone number (876XXXXXXX)");
//       }
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//     };
//   }

//   // Calculate total amount based on tour and guest details
//   calculateTotalAmount(tour, guestDetails) {
//     const adults = guestDetails.adults || 0;
//     const youth = guestDetails.youth || 0;
//     const children = guestDetails.children || 0;
//     const additionalServices = guestDetails.additionalServices || false;

//     const basePrice = tour.price || tour.basePrice || 15000;
//     const adultPrice = tour.pricing?.adultPrice || basePrice;
//     const youthPrice = tour.pricing?.youthPrice || basePrice * 0.8;
//     const childrenPrice = tour.pricing?.childrenPrice || basePrice * 0.5;
//     const servicePrice = additionalServices
//       ? tour.pricing?.servicePrice || 2000
//       : 0;

//     const totalAmount =
//       adults * adultPrice +
//       youth * youthPrice +
//       children * childrenPrice +
//       servicePrice;

//     return {
//       breakdown: {
//         adults: {
//           count: adults,
//           price: adultPrice,
//           total: adults * adultPrice,
//         },
//         youth: { count: youth, price: youthPrice, total: youth * youthPrice },
//         children: {
//           count: children,
//           price: childrenPrice,
//           total: children * childrenPrice,
//         },
//         services: { price: servicePrice },
//       },
//       totalAmount,
//       currency: "JMD",
//     };
//   }
// }

// // Create and export singleton instance
// const bookingService = new BookingService();
// export default bookingService;

// app/store/services/bookingService.js - Updated with Round Trip and Group Pricing Support
class BookingService {
  constructor() {
    // this.baseURL =
    //   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  }

  async createBooking(bookingData) {
    try {
      console.log("🇯🇲 Creating booking via API:", bookingData);
      console.log("🔍 Round trip data being sent:", {
        tripType: bookingData.tripType,
        returnDate: bookingData.returnDate,
        returnTime: bookingData.returnTime,
      });

      const response = await fetch(`${this.baseURL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      console.log("✅ Booking created successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      throw error;
    }
  }

  async getBooking(bookingId) {
    try {
      const response = await fetch(`${this.baseURL}/bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get booking");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting booking:", error);
      throw error;
    }
  }

  async getBookingsByEmail(email) {
    try {
      const response = await fetch(
        `${this.baseURL}/bookings/email/${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get bookings");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting bookings by email:", error);
      throw error;
    }
  }

  async getAllBookings(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.email) params.append("email", filters.email);
      if (filters.status) params.append("status", filters.status);
      if (filters.tripType) params.append("tripType", filters.tripType);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      const url = `${this.baseURL}/bookings${
        params.toString() ? "?" + params.toString() : ""
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get bookings");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting all bookings:", error);
      throw error;
    }
  }

  async updateBooking(bookingId, updates) {
    try {
      const response = await fetch(`${this.baseURL}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      return data;
    } catch (error) {
      console.error("❌ Error updating booking:", error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const response = await fetch(
        `${this.baseURL}/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      return data;
    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      throw error;
    }
  }

  async deleteBooking(bookingId) {
    try {
      const response = await fetch(`${this.baseURL}/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete booking");
      }

      return { status: "success" };
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
      throw error;
    }
  }

  async getBookingStats() {
    try {
      const response = await fetch(`${this.baseURL}/bookings/stats/overview`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get booking stats");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting booking stats:", error);
      throw error;
    }
  }

  // NEW: Get round trip statistics
  async getRoundTripStats() {
    try {
      const response = await fetch(`${this.baseURL}/bookings/stats/round-trip`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get round trip stats");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting round trip stats:", error);
      throw error;
    }
  }

  // NEW: Get available pickup times for a specific tour and date
  async getAvailablePickupTimes(tourId, date) {
    try {
      const response = await fetch(
        `${this.baseURL}/bookings/tour/${tourId}/date/${date}/available-pickup-times`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get available pickup times");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting available pickup times:", error);
      throw error;
    }
  }

  // NEW: Get available return times for a specific tour and date
  async getAvailableReturnTimes(tourId, date) {
    try {
      const response = await fetch(
        `${this.baseURL}/bookings/tour/${tourId}/date/${date}/available-return-times`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get available return times");
      }

      return data;
    } catch (error) {
      console.error("❌ Error getting available return times:", error);
      throw error;
    }
  }

  // NEW: Check if a pickup time slot is available
  async checkPickupTimeAvailability(tourId, date, time) {
    try {
      const response = await fetch(
        `${this.baseURL}/bookings/tour/${tourId}/date/${date}/time/${time}/check-pickup-availability`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check time availability");
      }

      return data;
    } catch (error) {
      console.error("❌ Error checking time availability:", error);
      throw error;
    }
  }

  // Helper method to format Jamaica phone numbers
  formatJamaicaPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.startsWith("876") && cleanPhone.length === 10) {
      return cleanPhone;
    } else if (cleanPhone.startsWith("1876") && cleanPhone.length === 11) {
      return cleanPhone.substring(1);
    } else if (cleanPhone.length === 7) {
      return "876" + cleanPhone;
    }

    return cleanPhone;
  }

  // UPDATED: Validate booking data with round trip support
  validateBookingData(bookingData) {
    const errors = [];

    // Required fields
    if (!bookingData.tour) errors.push("Tour ID is required");
    if (!bookingData.startDate && !bookingData.selectedDate) {
      errors.push("Pick up date is required");
    }
    if (!bookingData.startTime && !bookingData.selectedTime) {
      errors.push("Pick up time is required");
    }

    // Trip type validation
    if (
      bookingData.tripType &&
      !["one-way", "round-trip"].includes(bookingData.tripType)
    ) {
      errors.push("Invalid trip type. Must be 'one-way' or 'round-trip'");
    }

    // Round trip validation
    if (bookingData.tripType === "round-trip") {
      if (!bookingData.returnDate) {
        errors.push("Return date is required for round trips");
      }
      if (!bookingData.returnTime) {
        errors.push("Return time is required for round trips");
      }

      // Validate return date is not before pickup date
      const pickupDate = new Date(
        bookingData.selectedDate || bookingData.startDate
      );
      const returnDate = new Date(bookingData.returnDate);
      if (returnDate < pickupDate) {
        errors.push("Return date cannot be before pick up date");
      }
    }

    // Customer info validation
    if (!bookingData.customerInfo) {
      errors.push("Customer information is required");
    } else {
      if (!bookingData.customerInfo.firstName)
        errors.push("First name is required");
      if (!bookingData.customerInfo.lastName)
        errors.push("Last name is required");
      if (!bookingData.customerInfo.email) errors.push("Email is required");
      if (!bookingData.customerInfo.phone)
        errors.push("Phone number is required");
    }

    // Guest count validation
    const totalGuests =
      (bookingData.adults || 0) +
      (bookingData.youth || 0) +
      (bookingData.children || 0);
    if (totalGuests === 0) {
      errors.push("At least one guest is required");
    }

    // Jamaica phone validation
    if (bookingData.customerInfo?.phone) {
      const cleanPhone = this.formatJamaicaPhone(
        bookingData.customerInfo.phone
      );
      if (!cleanPhone.startsWith("876") || cleanPhone.length !== 10) {
        errors.push("Please provide a valid Jamaica phone number (876XXXXXXX)");
      }
    }

    // Time format validation
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const pickupTime = bookingData.selectedTime || bookingData.startTime;
    if (pickupTime && !timeRegex.test(pickupTime)) {
      errors.push("Invalid pickup time format. Use HH:MM format");
    }

    if (bookingData.returnTime && !timeRegex.test(bookingData.returnTime)) {
      errors.push("Invalid return time format. Use HH:MM format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // UPDATED: Calculate total amount with group pricing and round trip support
  calculateTotalAmount(tourData, bookingDetails) {
    const {
      adults = 0,
      youth = 0,
      children = 0,
      tripType = "one-way",
      isExtraService = false,
      isServicePerPerson = false,
      groupBasePrice = 85,
      perPersonRate = 25,
    } = bookingDetails;

    const totalGuests = adults + youth + children;
    let baseTourCost = 0;
    let pricingStructure = {
      type: "group",
      groupBasePrice: groupBasePrice,
      perPersonRate: perPersonRate,
      extraPeople: 0,
    };

    // Group pricing logic: 1-4 people = group rate, 5+ = group + per person
    if (totalGuests <= 4) {
      baseTourCost = groupBasePrice;
      pricingStructure.type = "group";
    } else {
      baseTourCost = groupBasePrice + (totalGuests - 4) * perPersonRate;
      pricingStructure.type = "mixed";
      pricingStructure.extraPeople = totalGuests - 4;
    }

    // Apply round trip multiplier
    let roundTripMultiplier = 1;
    if (tripType === "round-trip") {
      roundTripMultiplier = 2;
      baseTourCost *= 2;
    }

    // Calculate additional services
    let additionalServicesCost = 0;
    if (isExtraService) {
      additionalServicesCost += 40;
    }
    if (isServicePerPerson) {
      additionalServicesCost += totalGuests * 40;
    }

    const totalAmount = baseTourCost + additionalServicesCost;

    return {
      breakdown: {
        baseGroup: {
          people: Math.min(totalGuests, 4),
          rate: groupBasePrice,
          total: groupBasePrice,
          roundTrip: tripType === "round-trip",
        },
        extraPeople:
          totalGuests > 4
            ? {
                count: totalGuests - 4,
                rate: perPersonRate,
                total: (totalGuests - 4) * perPersonRate,
                roundTrip: tripType === "round-trip",
              }
            : null,
        roundTripMultiplier: roundTripMultiplier,
        additionalServices: {
          extraService: isExtraService ? 40 : 0,
          servicePerPerson: isServicePerPerson ? totalGuests * 40 : 0,
          total: additionalServicesCost,
        },
      },
      pricingStructure: pricingStructure,
      totalAmount: totalAmount,
      currency: "USD",
    };
  }

  // NEW: Prepare booking payload from sidebar/modal data
  prepareBookingPayload(sidebarData, modalData, tourData, paymentData = null) {
    // Merge data from sidebar and modal
    const bookingData = {
      // Tour information
      tour: tourData.id || tourData.tourId,

      // Trip details
      tripType: sidebarData.tripType || "one-way",
      startDate: sidebarData.selectedDate,
      startTime: sidebarData.selectedTime,
      returnDate: sidebarData.returnDate || null,
      returnTime: sidebarData.returnTime || null,

      // Legacy support
      selectedDate: sidebarData.selectedDate,
      selectedTime: sidebarData.selectedTime,

      // Guest counts
      adults: sidebarData.adults || 0,
      youth: sidebarData.youth || 0,
      children: sidebarData.children || 0,

      // Group pricing information
      groupBasePrice: sidebarData.groupBasePrice || 85,
      perPersonRate: sidebarData.perPersonRate || 25,
      pricingType: sidebarData.pricingType || "group",

      // Additional services
      additionalServices:
        sidebarData.isExtraService || sidebarData.isServicePerPerson,
      isExtraService: sidebarData.isExtraService || false,
      isServicePerPerson: sidebarData.isServicePerPerson || false,

      // Customer information from modal
      customerInfo: {
        firstName: modalData.firstName || "",
        lastName: modalData.lastName || "",
        email: modalData.email || "",
        phone: this.formatJamaicaPhone(modalData.phone || ""),
        specialRequests: modalData.specialRequests || "",
      },

      // Pricing
      totalAmount: sidebarData.totalAmount,
      currency: "USD",

      // Payment data (if available)
      paymentData: paymentData,
    };

    return bookingData;
  }

  // NEW: Create booking from sidebar and modal data
  async createBookingFromComponents(
    sidebarData,
    modalData,
    tourData,
    paymentData = null
  ) {
    try {
      // Prepare the booking payload
      const bookingPayload = this.prepareBookingPayload(
        sidebarData,
        modalData,
        tourData,
        paymentData
      );

      // Validate the booking data
      const validation = this.validateBookingData(bookingPayload);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Create the booking
      return await this.createBooking(bookingPayload);
    } catch (error) {
      console.error("❌ Error creating booking from components:", error);
      throw error;
    }
  }

  // NEW: Helper to format booking data for display
  formatBookingForDisplay(booking) {
    return {
      id: booking._id,
      bookingReference: booking.bookingReference,
      tour: booking.tourTitle || "Unknown Tour",
      customer: `${booking.customerInfo.firstName} ${booking.customerInfo.lastName}`,
      tripType: booking.tripType,

      // Pickup details
      pickupDate: booking.formattedPickupDate || booking.startDate,
      pickupTime: booking.startTime || booking.selectedTime,

      // Return details (if applicable)
      returnDate: booking.formattedReturnDate || booking.returnDate,
      returnTime: booking.returnTime,

      // Guest information
      guests: {
        adults: booking.adults,
        youth: booking.youth,
        children: booking.children,
        total:
          booking.totalGuests ||
          booking.adults + booking.youth + booking.children,
      },

      // Pricing
      pricingStructure: booking.pricingStructure,
      totalAmount: booking.totalAmount,
      currency: booking.paymentInfo?.currency || "USD",

      // Status
      status: booking.status,
      paymentStatus: booking.paymentInfo?.status,

      // Metadata
      createdAt: booking.createdAt,
      paidAt: booking.paidAt,
    };
  }
}

// Create and export singleton instance
const bookingService = new BookingService();
export default bookingService;
