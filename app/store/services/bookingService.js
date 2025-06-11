// app/store/services/bookingService.js - Updated for WiPay Integration
class BookingService {
  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
  }

  async createBooking(bookingData) {
    try {
      console.log("🇯🇲 Creating booking via API:", bookingData);

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

  async createWiPayPayment(paymentData) {
    try {
      console.log("💳 Creating WiPay payment:", paymentData);

      const response = await fetch(`${this.baseURL}/payments/wipay/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create WiPay payment");
      }

      console.log("✅ WiPay payment URL created:", data);
      return data;
    } catch (error) {
      console.error("❌ Error creating WiPay payment:", error);
      throw error;
    }
  }

  async verifyWiPayPayment(bookingId) {
    try {
      console.log("🔍 Verifying WiPay payment for booking:", bookingId);

      const response = await fetch(
        `${this.baseURL}/bookings/${bookingId}/verify-payment`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify payment");
      }

      console.log("✅ Payment verification result:", data);
      return data;
    } catch (error) {
      console.error("❌ Error verifying WiPay payment:", error);
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
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

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
      const response = await fetch(`${this.baseURL}/bookings/stats/monthly`);
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

  // Helper method to validate booking data
  validateBookingData(bookingData) {
    const errors = [];

    // Required fields
    if (!bookingData.tour) errors.push("Tour ID is required");
    if (!bookingData.startDate) errors.push("Start date is required");
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

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Calculate total amount based on tour and guest details
  calculateTotalAmount(tour, guestDetails) {
    const adults = guestDetails.adults || 0;
    const youth = guestDetails.youth || 0;
    const children = guestDetails.children || 0;
    const additionalServices = guestDetails.additionalServices || false;

    const basePrice = tour.price || tour.basePrice || 15000;
    const adultPrice = tour.pricing?.adultPrice || basePrice;
    const youthPrice = tour.pricing?.youthPrice || basePrice * 0.8;
    const childrenPrice = tour.pricing?.childrenPrice || basePrice * 0.5;
    const servicePrice = additionalServices
      ? tour.pricing?.servicePrice || 2000
      : 0;

    const totalAmount =
      adults * adultPrice +
      youth * youthPrice +
      children * childrenPrice +
      servicePrice;

    return {
      breakdown: {
        adults: {
          count: adults,
          price: adultPrice,
          total: adults * adultPrice,
        },
        youth: { count: youth, price: youthPrice, total: youth * youthPrice },
        children: {
          count: children,
          price: childrenPrice,
          total: children * childrenPrice,
        },
        services: { price: servicePrice },
      },
      totalAmount,
      currency: "JMD",
    };
  }

  // Create booking and return WiPay payment URL (all-in-one method)
  async createBookingWithPayment(bookingData) {
    try {
      console.log("🚀 Starting booking and payment process...");

      // Validate booking data
      const validation = this.validateBookingData(bookingData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Format phone number
      bookingData.customerInfo.phone = this.formatJamaicaPhone(
        bookingData.customerInfo.phone
      );

      // Create booking via your existing backend endpoint
      // This will create the booking AND return the WiPay payment URL
      const result = await this.createBooking(bookingData);

      console.log("✅ Booking and payment URL created:", result);

      return result;
    } catch (error) {
      console.error("❌ Error in booking and payment process:", error);
      throw error;
    }
  }

  // Handle payment completion (called from modal when WiPay returns)
  async handlePaymentCompletion(paymentData) {
    try {
      console.log("🎯 Handling payment completion:", paymentData);

      const { order_id: bookingId } = paymentData;

      if (!bookingId) {
        throw new Error("No booking ID found in payment data");
      }

      // Verify the payment status with your backend
      const verificationResult = await this.verifyWiPayPayment(bookingId);

      console.log("✅ Payment verification completed:", verificationResult);

      return {
        success: verificationResult.data.paymentStatus === "completed",
        booking: verificationResult.data.booking,
        paymentStatus: verificationResult.data.paymentStatus,
        bookingStatus: verificationResult.data.bookingStatus,
      };
    } catch (error) {
      console.error("❌ Error handling payment completion:", error);
      throw error;
    }
  }

  // Utility method to check if WiPay is available (for testing)
  isWiPayAvailable() {
    return process.env.WIPAY_ENVIRONMENT !== "mock";
  }

  // Get WiPay environment info
  getWiPayInfo() {
    return {
      environment: process.env.WIPAY_ENVIRONMENT || "live",
      developerId: process.env.NEXT_PUBLIC_WIPAY_DEVELOPER_ID,
      isLive: process.env.WIPAY_ENVIRONMENT === "live",
    };
  }
}

// Create and export singleton instance
const bookingService = new BookingService();
export default bookingService;
