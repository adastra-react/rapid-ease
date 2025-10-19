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
  useEffect(() => {
    if (typeof window !== "undefined" && !window.paypal && !paypalLoaded) {
      const script = document.createElement("script");
      script.src = `https://www/paypal.com/sdk/js?client-id=${
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"
      }&currency=USD&components=buttons`;
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else if (typeof window !== "undefined" && window.paypal) {
      setPaypalLoaded(true);
    }
  }, [paypalLoaded]);

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

  const inputStyle = (error) => ({
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: error ? "1px solid #dc3545" : "1px solid #ddd",
  });

  const buttonStyle = (primary = false, disabled = false) => ({
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: disabled ? "#ccc" : primary ? "#1e7e34" : "transparent",
    color: primary ? "white" : "#333",
    border: primary ? "none" : "1px solid #ddd",
  });

  const pricing = calculatePricing();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          padding: "40px",
        }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}>
          ×
        </button>

        {/* Processing State */}
        {step === "processing" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <h3 style={{ color: "#1e7e34", marginBottom: "15px" }}>
              Processing Your Booking...
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Please wait while we confirm your payment and create your booking.
            </p>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #1e7e34",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}></div>
          </div>
        )}

        {/* Success State */}
        {step === "success" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎉</div>
            <h3 style={{ color: "#1e7e34", marginBottom: "15px" }}>
              Booking Confirmed!
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Your Jamaica tour has been successfully booked and paid for.
            </p>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
                textAlign: "left",
              }}>
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
              style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
              A confirmation email has been sent to {customerInfo.email}
            </p>
            <button onClick={handleClose} style={buttonStyle(true)}>
              Complete
            </button>
          </div>
        )}

        {/* Failed State */}
        {step === "failed" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
            <h3 style={{ color: "#dc3545", marginBottom: "15px" }}>
              Booking Failed
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
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
            <h2
              style={{
                color: "#1e7e34",
                marginBottom: "10px",
                textAlign: "center",
              }}>
              Book Your Jamaica Tour
            </h2>

            {/* Tour Summary with Round Trip Support */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "30px",
              }}>
              <h4>{tourData.title}</h4>
              <p>Duration: {tourData.duration}</p>
              <p>
                <strong>Trip Type:</strong>{" "}
                {bookingData.tripType === "round-trip"
                  ? "Round Trip"
                  : "One Way"}
              </p>
              <p>
                <strong>
                  {bookingData.tripType === "round-trip"
                    ? "Pick Up Date:"
                    : "Pick Up:"}
                </strong>{" "}
                {formatDateForDisplay(bookingData.selectedDate)}
              </p>
              {bookingData.tripType === "round-trip" &&
                bookingData.returnDate && (
                  <p>
                    <strong>Return Date:</strong>{" "}
                    {formatDateForDisplay(bookingData.returnDate)}
                  </p>
                )}
              <p>
                <strong>
                  {bookingData.tripType === "round-trip"
                    ? "Pick Up Time:"
                    : "Time:"}
                </strong>{" "}
                {bookingData.selectedTime || "Not selected"}
              </p>
              {bookingData.tripType === "round-trip" &&
                bookingData.returnTime && (
                  <p>
                    <strong>Return Time:</strong> {bookingData.returnTime}
                  </p>
                )}

              {/* Price Breakdown with Round Trip Logic */}
              <div style={{ marginBottom: "10px", fontSize: "14px" }}>
                <div style={{ marginBottom: "8px", fontWeight: "500" }}>
                  Total People: {pricing.totalPeople} ({bookingData.adults || 0}{" "}
                  Adults, {bookingData.youth || 0} Youth,{" "}
                  {bookingData.children || 0} Children)
                </div>

                {bookingData.tripType === "round-trip" && (
                  <div
                    style={{
                      backgroundColor: "#fff3cd",
                      border: "1px solid #ffeaa7",
                      borderRadius: "6px",
                      padding: "10px",
                      marginBottom: "10px",
                      fontSize: "13px",
                      color: "#856404",
                    }}>
                    Round Trip - Prices doubled for return journey
                  </div>
                )}

                {pricing.priceBreakdown.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}>
                    <span>{item.description}</span>
                    <span>
                      {item.quantity > 1
                        ? `${item.quantity} × ${item.rate.toFixed(2)} = `
                        : ""}
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  color: "#1e7e34",
                  borderTop: "1px solid #dee2e6",
                  paddingTop: "8px",
                  marginTop: "8px",
                }}>
                <span>Total: ${pricing.totalAmount?.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Customer Info Form */}
            <h4 style={{ marginBottom: "15px" }}>Customer Information</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
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
                <label style={{ display: "block", marginBottom: "5px" }}>
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px",
              }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
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
                <label style={{ display: "block", marginBottom: "5px" }}>
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
              <label style={{ display: "block", marginBottom: "5px" }}>
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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            <h2
              style={{
                color: "#1e7e34",
                marginBottom: "20px",
                textAlign: "center",
              }}>
              Secure Payment
            </h2>

            {/* Booking Summary */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "30px",
              }}>
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
                  borderTop: "1px solid #dee2e6",
                  paddingTop: "10px",
                  marginTop: "10px",
                }}>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#1e7e34",
                    fontSize: "18px",
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
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}>
                  <p>Loading PayPal...</p>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      border: "3px solid #f3f3f3",
                      borderTop: "3px solid #1e7e34",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "10px auto",
                    }}></div>
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
