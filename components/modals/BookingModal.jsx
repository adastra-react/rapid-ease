"use client";

import React, { useState, useEffect } from "react";
import bookingService from "@/app/store/services/bookingService";

export default function BookingModal({
  isOpen,
  onClose,
  tour,
  bookingData,
  onBookingSuccess,
}) {
  const [step, setStep] = useState("booking"); // 'booking', 'payment', 'processing', 'success', 'failed'
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState({});
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const tourData = {
    id: tour?.id || tour?.tourId || 39,
    title: tour?.title || "Tour Booking",
    basePrice: tour?.price || tour?.basePrice || 15000,
    duration: tour?.duration || "4 hours",
  };

  // Calculate pricing using GROUP PRICING LOGIC to match sidebar
  const calculatePricing = () => {
    const totalPeople =
      (bookingData.adults || 0) +
      (bookingData.youth || 0) +
      (bookingData.children || 0);

    // Use the pricing from bookingData if available, otherwise use tour data
    const groupBasePrice =
      bookingData.groupBasePrice || tour?.pricing?.basePrice || 85;
    const perPersonRate =
      bookingData.perPersonRate || tour?.pricing?.perPersonRate || 25;

    let totalAmount = 0;
    let priceBreakdown = [];

    // GROUP PRICING LOGIC: 1-4 people = group rate, 5+ = group + per person
    if (totalPeople <= 4 && totalPeople > 0) {
      // Group rate for 1-4 people
      totalAmount = groupBasePrice;
      priceBreakdown.push({
        description: `Base group (${totalPeople} ${
          totalPeople === 1 ? "person" : "people"
        })`,
        quantity: 1,
        rate: groupBasePrice,
        amount: groupBasePrice,
      });
    } else if (totalPeople > 4) {
      // Group rate for first 4 + per person rate for additional
      const baseCost = groupBasePrice;
      const extraPeople = totalPeople - 4;
      const extraCost = extraPeople * perPersonRate;

      totalAmount = baseCost + extraCost;

      priceBreakdown.push({
        description: "Base group (4 people)",
        quantity: 1,
        rate: baseCost,
        amount: baseCost,
      });

      priceBreakdown.push({
        description: `Additional ${extraPeople} ${
          extraPeople === 1 ? "person" : "people"
        }`,
        quantity: extraPeople,
        rate: perPersonRate,
        amount: extraCost,
      });
    }

    // Apply round trip multiplier
    if (bookingData.tripType === "round-trip") {
      totalAmount *= 2;
      priceBreakdown = priceBreakdown.map((item) => ({
        ...item,
        amount: item.amount * 2,
        description: item.description + " (Round Trip)",
      }));
    }

    // Add additional services
    let additionalServices = 0;
    if (bookingData.isExtraService) {
      additionalServices += 40;
      priceBreakdown.push({
        description: "Extra Service",
        quantity: 1,
        rate: 40,
        amount: 40,
      });
    }

    if (bookingData.isServicePerPerson) {
      const serviceAmount = totalPeople * 40;
      additionalServices += serviceAmount;
      priceBreakdown.push({
        description: "Per Person Service",
        quantity: totalPeople,
        rate: 40,
        amount: serviceAmount,
      });
    }

    totalAmount += additionalServices;

    return {
      totalAmount,
      priceBreakdown,
      totalPeople,
      groupBasePrice,
      perPersonRate,
    };
  };

  // Load PayPal SDK
  // useEffect(() => {
  //   if (typeof window !== "undefined" && !window.paypal && !paypalLoaded) {
  //     const script = document.createElement("script");
  //     script.src = `https://www/paypal.com/sdk/js?client-id=${
  //       process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"
  //     }&currency=USD&components=buttons`;
  //     script.async = true;
  //     script.onload = () => setPaypalLoaded(true);
  //     document.body.appendChild(script);
  //   } else if (typeof window !== "undefined" && window.paypal) {
  //     setPaypalLoaded(true);
  //   }
  // }, [paypalLoaded]);

  // Load PayPal SDK - IMPROVED
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.paypal) {
      setPaypalLoaded(true);
      return;
    }

    // Check if already loading
    if (document.querySelector('script[src*="paypal.com/sdk"]')) {
      const checkPayPal = setInterval(() => {
        if (window.paypal) {
          setPaypalLoaded(true);
          clearInterval(checkPayPal);
        }
      }, 100);
      return () => clearInterval(checkPayPal);
    }

    // Load PayPal SDK
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId || clientId === "test") {
      console.error("PayPal Client ID not configured!");
      setError("Payment system not configured. Please contact support.");
      return;
    }

    console.log("Loading PayPal SDK...");

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;
    script.async = true;

    script.onload = () => {
      console.log("PayPal SDK loaded successfully");
      setPaypalLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      setError("Failed to load payment system. Please refresh the page.");
    };

    document.body.appendChild(script);
  }, []);

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateBooking = () => {
    const newErrors = {};

    if (!customerInfo.firstName.trim())
      newErrors.firstName = "First name required";
    if (!customerInfo.lastName.trim())
      newErrors.lastName = "Last name required";
    if (
      !customerInfo.email.trim() ||
      !/\S+@\S+\.\S+/.test(customerInfo.email)
    ) {
      newErrors.email = "Valid email required";
    }
    if (!customerInfo.phone.trim()) newErrors.phone = "Phone required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatJamaicaPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("876") && cleanPhone.length === 10) {
      return cleanPhone;
    } else if (cleanPhone.startsWith("1876") && cleanPhone.length === 11) {
      return cleanPhone.substring(1);
    } else if (cleanPhone.length === 7) {
      return "876" + cleanPhone;
    }
    return cleanPhone;
  };

  // const createBooking = async (paymentData) => {

  // In BookingModal.jsx, replace the createBooking function: // Adjust path as needed

  const createBooking = async (paymentData) => {
    try {
      const bookingPayload = {
        tour: tourData.id,
        customerInfo: {
          ...customerInfo,
          phone: formatJamaicaPhone(customerInfo.phone),
        },

        // Use the simple structure that works
        tripType: bookingData.tripType,
        startDate: bookingData.selectedDate,
        startTime: bookingData.selectedTime,
        returnDate:
          bookingData.tripType === "round-trip"
            ? bookingData.returnDate
            : undefined,
        returnTime:
          bookingData.tripType === "round-trip"
            ? bookingData.returnTime
            : undefined,

        // Remove these legacy fields or your backend might be using them instead:
        // selectedDate: bookingData.selectedDate,
        // selectedTime: bookingData.selectedTime,

        adults: bookingData.adults || 1,
        youth: bookingData.youth || 0,
        children: bookingData.children || 0,
        groupBasePrice: bookingData.groupBasePrice,
        perPersonRate: bookingData.perPersonRate,
        pricingType: bookingData.pricingType,
        isExtraService: bookingData.isExtraService || false,
        isServicePerPerson: bookingData.isServicePerPerson || false,
        totalAmount: pricing.totalAmount,
        currency: "USD",
        paymentData: {
          method: "paypal",
          transactionId: paymentData.transactionId,
          status: "completed",
          amount: paymentData.amount,
          currency: paymentData.currency,
          payerEmail: paymentData.payerEmail,
          payerName: paymentData.payerName,
        },
      };

      const result = await bookingService.createBooking(bookingPayload);
      return result;
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      throw error;
    }
  };

  const handleContinueToPayment = () => {
    if (!validateBooking()) return;
    setStep("payment");
  };

  const handleClose = () => {
    setStep("booking");
    setLoading(false);
    setCustomerInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    });
    setErrors({});
    onClose();
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not selected";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Ensure hooks run unconditionally; only guard rendering here
  if (!isOpen || !bookingData) return null;

  const palette = {
    navy: "#1f2557",
    navySoft: "#445065",
    red: "#ea3c3c",
    redDark: "#cf3434",
    redSoft: "rgba(234, 60, 60, 0.08)",
    border: "#e7ebf3",
    borderStrong: "#dbe3ee",
    surface: "#ffffff",
    surfaceSoft: "#f8fafc",
    textMuted: "#7b8497",
    success: "#2f7d4a",
    warningBg: "#fff7e1",
    warningBorder: "#f6deb1",
    warningText: "#9a6a00",
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.52) 0%, rgba(15, 23, 42, 0.64) 100%)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      zIndex: 1000,
    },
    modal: {
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,251,255,0.98) 100%)",
      borderRadius: "28px",
      maxWidth: "760px",
      width: "100%",
      maxHeight: "90vh",
      overflow: "auto",
      position: "relative",
      padding: "32px",
      border: `1px solid ${palette.border}`,
      boxShadow:
        "0 28px 80px rgba(15, 23, 42, 0.18), 0 10px 24px rgba(15, 23, 42, 0.08)",
    },
    closeButton: {
      position: "absolute",
      top: "18px",
      right: "18px",
      width: "40px",
      height: "40px",
      borderRadius: "999px",
      border: `1px solid ${palette.border}`,
      backgroundColor: "#ffffff",
      color: palette.navy,
      fontSize: "22px",
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
    },
    heading: {
      color: palette.navy,
      marginBottom: "8px",
      textAlign: "center",
      fontSize: "34px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    subheading: {
      textAlign: "center",
      color: palette.textMuted,
      fontSize: "15px",
      marginBottom: "26px",
    },
    summaryCard: {
      background:
        "linear-gradient(135deg, rgba(31, 37, 87, 0.03) 0%, rgba(234, 60, 60, 0.06) 100%)",
      borderRadius: "22px",
      padding: "22px",
      marginBottom: "28px",
      border: `1px solid ${palette.border}`,
      boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
    },
    summaryTitle: {
      fontSize: "26px",
      fontWeight: 800,
      lineHeight: 1.15,
      color: palette.navy,
      marginBottom: "16px",
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px 18px",
      marginBottom: "18px",
    },
    summaryItem: {
      padding: "10px 12px",
      borderRadius: "14px",
      backgroundColor: "rgba(255,255,255,0.75)",
      border: `1px solid ${palette.border}`,
    },
    summaryLabel: {
      display: "block",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: palette.textMuted,
      marginBottom: "5px",
    },
    summaryValue: {
      fontSize: "14px",
      fontWeight: 600,
      color: palette.navy,
      lineHeight: 1.45,
    },
    callout: {
      backgroundColor: palette.warningBg,
      border: `1px solid ${palette.warningBorder}`,
      borderRadius: "14px",
      padding: "12px 14px",
      marginBottom: "14px",
      fontSize: "13px",
      color: palette.warningText,
      fontWeight: 600,
    },
    breakdownWrap: {
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.72)",
      border: `1px solid ${palette.border}`,
      overflow: "hidden",
    },
    breakdownRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      padding: "12px 14px",
      fontSize: "14px",
      color: palette.navySoft,
      borderBottom: `1px solid ${palette.border}`,
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px",
      fontWeight: 800,
      color: palette.navy,
      background:
        "linear-gradient(135deg, rgba(234, 60, 60, 0.06) 0%, rgba(31, 37, 87, 0.04) 100%)",
    },
    sectionTitle: {
      marginBottom: "16px",
      color: palette.navy,
      fontSize: "26px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "7px",
      fontSize: "13px",
      fontWeight: 700,
      color: palette.navy,
    },
    footerActions: {
      display: "flex",
      justifyContent: "space-between",
      gap: "14px",
      marginTop: "28px",
    },
    loadingBox: {
      textAlign: "center",
      padding: "28px 12px",
    },
    stateTitle: {
      color: palette.navy,
      marginBottom: "12px",
      fontSize: "30px",
      fontWeight: 800,
    },
    stateText: {
      color: palette.textMuted,
      marginBottom: "20px",
      fontSize: "15px",
    },
    spinner: {
      width: "42px",
      height: "42px",
      border: "4px solid #f1f5f9",
      borderTop: `4px solid ${palette.red}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto",
    },
  };

  const inputStyle = (error) => ({
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    color: palette.navy,
    backgroundColor: "#ffffff",
    border: error
      ? `1px solid ${palette.red}`
      : `1px solid ${palette.borderStrong}`,
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.03)",
  });

  const buttonStyle = (primary = false, disabled = false) => ({
    padding: "13px 22px",
    borderRadius: "14px",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled
      ? "#d5dbe5"
      : primary
      ? `linear-gradient(135deg, ${palette.red} 0%, ${palette.redDark} 100%)`
      : "#ffffff",
    color: primary ? "white" : palette.navy,
    border: primary ? "none" : `1px solid ${palette.borderStrong}`,
    fontWeight: 700,
    minWidth: "140px",
    boxShadow: primary
      ? "0 14px 28px rgba(234, 60, 60, 0.22)"
      : "0 8px 18px rgba(15, 23, 42, 0.05)",
  });

  const pricing = calculatePricing();

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Close Button */}
        <button onClick={handleClose} style={styles.closeButton}>
          ×
        </button>

        {/* Processing State */}
        {step === "processing" && (
          <div style={styles.loadingBox}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <h3 style={styles.stateTitle}>Processing Your Booking...</h3>
            <p style={styles.stateText}>
              Please wait while we confirm your payment and create your booking.
            </p>
            <div style={styles.spinner}></div>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div style={styles.loadingBox}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎉</div>
            <h3 style={styles.stateTitle}>Booking Confirmed!</h3>
            <p style={styles.stateText}>
              Your Jamaica tour has been successfully booked and paid for.
            </p>
            <div style={{ ...styles.summaryCard, textAlign: "left" }}>
              <h4>Booking Details</h4>
              <p>
                <strong>Tour:</strong> {tourData.title}
              </p>
              <p>
                <strong>Trip Type:</strong>{" "}
                {bookingData.tripType === "round-trip"
                  ? "Round Trip"
                  : "One Way"}
              </p>
              <p>
                <strong>Pick Up:</strong>{" "}
                {formatDateForDisplay(bookingData.selectedDate)}
              </p>
              {bookingData.tripType === "round-trip" &&
                bookingData.returnDate && (
                  <p>
                    <strong>Return:</strong>{" "}
                    {formatDateForDisplay(bookingData.returnDate)}
                  </p>
                )}
              <p>
                <strong>Pick Up Time:</strong> {bookingData.selectedTime}
              </p>
              {bookingData.tripType === "round-trip" &&
                bookingData.returnTime && (
                  <p>
                    <strong>Return Time:</strong> {bookingData.returnTime}
                  </p>
                )}
              <p>
                <strong>Total Paid:</strong> ${pricing.totalAmount?.toFixed(2)}{" "}
                USD
              </p>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: palette.textMuted,
                marginBottom: "20px",
              }}>
              A confirmation email has been sent to {customerInfo.email}
            </p>
            <button onClick={handleClose} style={buttonStyle(true)}>
              Complete
            </button>
          </div>
        )}

        {/* Failed State */}
        {step === "failed" && (
          <div style={styles.loadingBox}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
            <h3 style={styles.stateTitle}>Booking Failed</h3>
            <p style={styles.stateText}>
              There was an issue processing your booking. Please check the
              details and try again.
            </p>
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
              }}>
              <button
                onClick={() => setStep("booking")}
                style={buttonStyle(true)}>
                Fix Details
              </button>
              <button onClick={handleClose} style={buttonStyle()}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {step === "booking" && (
          <>
            <h2 style={styles.heading}>Book Your Jamaica Tour</h2>
            <div style={styles.subheading}>
              Finalize your transfer details and continue to secure payment.
            </div>

            {/* Tour Summary with Round Trip Support */}
            <div style={styles.summaryCard}>
              <div style={styles.summaryTitle}>{tourData.title}</div>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Duration</span>
                  <span style={styles.summaryValue}>{tourData.duration}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>Trip Type</span>
                  <span style={styles.summaryValue}>
                    {bookingData.tripType === "round-trip"
                      ? "Round Trip"
                      : "One Way"}
                  </span>
                </div>
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    {bookingData.tripType === "round-trip"
                      ? "Pick Up Date"
                      : "Pick Up"}
                  </span>
                  <span style={styles.summaryValue}>
                    {formatDateForDisplay(bookingData.selectedDate)}
                  </span>
                </div>
                {bookingData.tripType === "round-trip" &&
                  bookingData.returnDate && (
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Return Date</span>
                      <span style={styles.summaryValue}>
                        {formatDateForDisplay(bookingData.returnDate)}
                      </span>
                    </div>
                  )}
                <div style={styles.summaryItem}>
                  <span style={styles.summaryLabel}>
                    {bookingData.tripType === "round-trip"
                      ? "Pick Up Time"
                      : "Time"}
                  </span>
                  <span style={styles.summaryValue}>
                    {bookingData.selectedTime || "Not selected"}
                  </span>
                </div>
                {bookingData.tripType === "round-trip" &&
                  bookingData.returnTime && (
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Return Time</span>
                      <span style={styles.summaryValue}>
                        {bookingData.returnTime}
                      </span>
                    </div>
                  )}
              </div>

              {/* Price Breakdown with Round Trip Logic */}
              <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                <div
                  style={{
                    marginBottom: "10px",
                    fontWeight: "700",
                    color: palette.navy,
                  }}>
                  Total People: {pricing.totalPeople} ({bookingData.adults || 0}{" "}
                  Adults, {bookingData.youth || 0} Youth,{" "}
                  {bookingData.children || 0} Children)
                </div>

                {bookingData.tripType === "round-trip" && (
                  <div style={styles.callout}>
                    Round Trip - Prices doubled for return journey
                  </div>
                )}

                <div style={styles.breakdownWrap}>
                  {pricing.priceBreakdown.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        ...styles.breakdownRow,
                        borderBottom:
                          index === pricing.priceBreakdown.length - 1
                            ? "none"
                            : styles.breakdownRow.borderBottom,
                      }}>
                      <span>{item.description}</span>
                      <span style={{ fontWeight: 700, color: palette.navy }}>
                        {item.quantity > 1
                          ? `${item.quantity} × ${item.rate.toFixed(2)} = `
                          : ""}
                        ${item.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div style={styles.totalRow}>
                    <span>Total</span>
                    <span>${pricing.totalAmount?.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info Form */}
            <h4 style={styles.sectionTitle}>Customer Information</h4>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>
                  First Name *
                </label>
                <input
                  value={customerInfo.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  style={inputStyle(errors.firstName)}
                />
                {errors.firstName && (
                  <p style={{ color: "#dc3545", fontSize: "12px" }}>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label style={styles.label}>
                  Last Name *
                </label>
                <input
                  value={customerInfo.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  style={inputStyle(errors.lastName)}
                />
                {errors.lastName && (
                  <p style={{ color: "#dc3545", fontSize: "12px" }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>
                  Email *
                </label>
                <input
                  type='email'
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  style={inputStyle(errors.email)}
                />
                {errors.email && (
                  <p style={{ color: "#dc3545", fontSize: "12px" }}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label style={styles.label}>
                  Jamaica Phone *
                </label>
                <input
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder='876-123-4567'
                  style={inputStyle(errors.phone)}
                />
                {errors.phone && (
                  <p style={{ color: "#dc3545", fontSize: "12px" }}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "30px" }}>
              <label style={styles.label}>
                Special Requests
              </label>
              <textarea
                value={customerInfo.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                rows='3'
                style={{
                  ...inputStyle(),
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                placeholder='Any special requirements or requests...'
              />
            </div>

            <div style={styles.footerActions}>
              <button onClick={handleClose} style={buttonStyle()}>
                Cancel
              </button>
              <button
                onClick={handleContinueToPayment}
                style={buttonStyle(true, loading)}
                disabled={loading}>
                {loading ? "Processing…" : "Continue to Payment"}
              </button>
            </div>
          </>
        )}

        {/* Payment Page */}
        {step === "payment" && (
          <>
            <h2 style={styles.heading}>Secure Payment</h2>
            <div style={styles.subheading}>
              Review your booking and complete checkout with PayPal.
            </div>

            {/* Booking Summary */}
            <div style={styles.summaryCard}>
              <h4>Booking Summary</h4>
              <p>Tour: {tourData.title}</p>
              <p>
                Trip Type:{" "}
                {bookingData.tripType === "round-trip"
                  ? "Round Trip"
                  : "One Way"}
              </p>
              <p>Pick Up: {formatDateForDisplay(bookingData.selectedDate)}</p>
              {bookingData.tripType === "round-trip" &&
                bookingData.returnDate && (
                  <p>Return: {formatDateForDisplay(bookingData.returnDate)}</p>
                )}
              <p>Pick Up Time: {bookingData.selectedTime}</p>
              {bookingData.tripType === "round-trip" &&
                bookingData.returnTime && (
                  <p>Return Time: {bookingData.returnTime}</p>
                )}
              <p>
                Guests: {bookingData.adults} Adults, {bookingData.youth} Youth,{" "}
                {bookingData.children} Children
              </p>
              <div
                style={{
                  borderTop: `1px solid ${palette.border}`,
                  paddingTop: "12px",
                  marginTop: "12px",
                }}>
                <p
                  style={{
                    fontWeight: "800",
                    color: palette.navy,
                    fontSize: "20px",
                  }}>
                  Total: ${pricing.totalAmount?.toFixed(2)} USD
                </p>
              </div>
            </div>

            {/* PayPal Payment */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "15px" }}>Payment Method</h4>
              {paypalLoaded &&
              typeof window !== "undefined" &&
              window.paypal ? (
                <div id='paypal-button-container'>
                  <PayPalButtons
                    tourData={tourData}
                    bookingData={bookingData}
                    totalAmount={pricing.totalAmount}
                    onSuccess={(paymentData) => {
                      setStep("processing");
                      setLoading(true);
                      createBooking(paymentData)
                        .then((booking) => {
                          setLoading(false);
                          setStep("success");
                          onBookingSuccess?.({
                            booking,
                            paymentStatus: "completed",
                            transactionId: paymentData.transactionId,
                          });
                        })
                        .catch((error) => {
                          console.error("Booking creation failed:", error);
                          setLoading(false);
                          setStep("failed");
                        });
                    }}
                    onError={() => setStep("failed")}
                  />
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    backgroundColor: palette.surfaceSoft,
                    borderRadius: "18px",
                    border: `1px solid ${palette.border}`,
                  }}>
                  <p>Loading PayPal...</p>
                  <div style={styles.spinner}></div>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
              }}>
              <button onClick={() => setStep("booking")} style={buttonStyle()}>
                ← Back
              </button>
            </div>
          </>
        )}

        {/* Loading Spinner Styles */}
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

// PayPal Buttons Component
function PayPalButtons({
  tourData,
  bookingData,
  totalAmount,
  onSuccess,
  onError,
}) {
  const selectedDate = bookingData?.selectedDate;
  const tourId = tourData?.id;
  const tourTitle = tourData?.title;

  useEffect(() => {
    if (typeof window === "undefined" || !window.paypal) return;
    const container = document.getElementById("paypal-button-container");
    if (container) {
      container.innerHTML = "";

      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalAmount.toFixed(2),
                    currency_code: "USD",
                  },
                  description: `${tourTitle} - ${formatDateForDisplay(
                    selectedDate
                  )}`,
                  custom_id: `tour_${tourId}_${Date.now()}`,
                  soft_descriptor: "Jamaica Tour",
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const order = await actions.order.capture();
              const paymentData = {
                transactionId: order.id,
                amount: order.purchase_units[0].amount.value,
                currency: "USD",
                status: "completed",
                payerEmail: order.payer.email_address,
                payerName: `${order.payer.name.given_name} ${order.payer.name.surname}`,
              };
              onSuccess(paymentData);
            } catch (error) {
              console.error("PayPal payment capture failed:", error);
              onError(error);
            }
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            onError(err);
          },
          onCancel: (data) => {
            console.log("PayPal payment cancelled:", data);
          },
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
        })
        .render("#paypal-button-container");
    }
  }, [totalAmount, selectedDate, tourId, tourTitle, onSuccess, onError]);

  function formatDateForDisplay(dateString) {
    if (!dateString) return "Not selected";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return <div id='paypal-button-container'></div>;
}
