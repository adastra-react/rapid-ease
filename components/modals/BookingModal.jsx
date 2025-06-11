import React, { useState, useEffect } from "react";

export default function BookingModal({
  isOpen,
  onClose,
  tour,
  bookingData,
  onBookingSuccess,
}) {
  const [currentStep, setCurrentStep] = useState("booking"); // 'booking', 'processing', 'redirecting', 'success', 'failed'
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState({});
  const [bookingCreated, setBookingCreated] = useState(null);
  const [paymentWindow, setPaymentWindow] = useState(null);

  // Fix tour object
  const getFixedTour = () => {
    if (!tour) return null;

    let tourId = null;
    if (tour.id && typeof tour.id === "number") {
      tourId = tour.id;
    } else if (tour.tourId && typeof tour.tourId === "number") {
      tourId = tour.tourId;
    } else if (
      tour.id &&
      typeof tour.id === "string" &&
      !isNaN(parseInt(tour.id))
    ) {
      tourId = parseInt(tour.id);
    } else {
      const urlParams = window.location.pathname.split("/");
      const urlTourId = urlParams[urlParams.length - 1];
      if (urlTourId && !isNaN(parseInt(urlTourId))) {
        tourId = parseInt(urlTourId);
      } else {
        tourId = 39; // Fallback
      }
    }

    return {
      ...tour,
      id: tourId,
      title: tour.title || "Tour Booking",
      price: tour.price || tour.basePrice || 15000,
      pricing: tour.pricing || {
        adultPrice: tour.price || tour.basePrice || 15000,
        youthPrice: (tour.price || tour.basePrice || 15000) * 0.8,
        childrenPrice: (tour.price || tour.basePrice || 15000) * 0.5,
        servicePrice: 2000,
      },
      duration: tour.duration || "4 hours",
    };
  };

  // Listen for WiPay payment completion messages
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("🎯 Received message:", event.data);

      if (event.data.type === "WIPAY_PAYMENT_COMPLETE") {
        const { paymentData } = event.data;
        console.log("💳 Payment data received:", paymentData);

        // Close payment window if it exists
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close();
          setPaymentWindow(null);
        }

        if (
          paymentData.status === "success" ||
          paymentData.response_code === "00"
        ) {
          setCurrentStep("success");
          if (onBookingSuccess) {
            onBookingSuccess({
              booking: bookingCreated,
              paymentStatus: "completed",
              transactionId: paymentData.transaction_id,
              paymentData,
            });
          }
        } else {
          setCurrentStep("failed");
        }

        setLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [paymentWindow, bookingCreated, onBookingSuccess]);

  // Clean up payment window on unmount
  useEffect(() => {
    return () => {
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
    };
  }, [paymentWindow]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedDate) newErrors.selectedDate = "Please select a date";
    if (!customerInfo.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!customerInfo.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (
      bookingData.adults === 0 &&
      bookingData.youth === 0 &&
      bookingData.children === 0
    ) {
      newErrors.guests = "Please select at least one guest";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBookingAndPayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setCurrentStep("processing");

    try {
      const fixedTour = getFixedTour();

      // Create booking
      const bookingPayload = {
        tour: fixedTour.id,
        customerInfo,
        startDate: selectedDate,
        adults: bookingData.adults || 1,
        youth: bookingData.youth || 0,
        children: bookingData.children || 0,
        additionalServices:
          bookingData.isExtraService || bookingData.isServicePerPerson || false,
      };

      console.log("📝 Creating booking...", bookingPayload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      console.log("✅ Booking created:", result);
      setBookingCreated(result.data.booking);

      // Check if we have a payment URL
      if (result.data.paymentUrl) {
        setCurrentStep("redirecting");

        // Open WiPay payment in popup window
        const popup = window.open(
          result.data.paymentUrl,
          "wipay_payment",
          "width=800,height=600,scrollbars=yes,resizable=yes,status=yes"
        );

        setPaymentWindow(popup);

        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === "undefined") {
          alert(
            "Pop-up blocked! Please allow pop-ups for this site and try again."
          );
          setCurrentStep("failed");
          setLoading(false);
          return;
        }

        // Monitor if user closes popup manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            if (currentStep === "redirecting") {
              setCurrentStep("failed");
              setLoading(false);
            }
          }
        }, 1000);
      } else {
        throw new Error("No payment URL received from server");
      }
    } catch (error) {
      console.error("❌ Booking/Payment error:", error);
      setCurrentStep("failed");
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Close payment window if open
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
      setPaymentWindow(null);
    }

    // Reset all states
    setCurrentStep("booking");
    setLoading(false);
    setSelectedDate("");
    setCustomerInfo({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
    });
    setErrors({});
    setBookingCreated(null);
    onClose();
  };

  if (!isOpen) return null;

  const fixedTour = getFixedTour();

  const renderStepContent = () => {
    switch (currentStep) {
      case "processing":
        return (
          <div style={{ textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <h3 style={{ marginBottom: "15px", color: "#333" }}>
              Creating your booking...
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Please wait while we prepare your Jamaica tour booking.
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
        );

      case "redirecting":
        return (
          <div style={{ textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏦</div>
            <h3 style={{ marginBottom: "15px", color: "#1e7e34" }}>
              Redirecting to WiPay...
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Complete your payment securely with WiPay Jamaica.
            </p>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
              A new window has opened for payment. If you don't see it, please
              check if pop-ups are blocked.
            </p>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #1e7e34",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }}></div>
            <button
              onClick={handleClose}
              style={{
                padding: "12px 24px",
                border: "1px solid #ccc",
                backgroundColor: "transparent",
                borderRadius: "8px",
                cursor: "pointer",
              }}>
              Cancel
            </button>
          </div>
        );

      case "success":
        return (
          <div style={{ textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
            <h3 style={{ marginBottom: "15px", color: "#1e7e34" }}>
              Payment Successful!
            </h3>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Your Jamaica tour has been successfully booked and paid for
              through WiPay.
            </p>

            {bookingCreated && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "25px",
                  marginBottom: "30px",
                  textAlign: "left",
                }}>
                <h4 style={{ marginBottom: "15px", color: "#333" }}>
                  Booking Details
                </h4>
                <p>
                  <strong>Booking ID:</strong> {bookingCreated._id}
                </p>
                <p>
                  <strong>Tour:</strong> {fixedTour?.title}
                </p>
                <p>
                  <strong>Date:</strong> {selectedDate}
                </p>
                <p>
                  <strong>Guests:</strong> {bookingData.adults} Adults,{" "}
                  {bookingData.youth} Youth, {bookingData.children} Children
                </p>
                <p>
                  <strong>Total Paid:</strong> JMD $
                  {bookingData.totalAmount?.toLocaleString()}
                </p>
              </div>
            )}

            <p
              style={{ fontSize: "13px", color: "#666", marginBottom: "30px" }}>
              A confirmation email has been sent to {customerInfo.email}
            </p>

            <button
              onClick={handleClose}
              style={{
                padding: "15px 30px",
                backgroundColor: "#1e7e34",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}>
              Complete
            </button>
          </div>
        );

      case "failed":
        return (
          <div style={{ textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
            <h3 style={{ marginBottom: "15px", color: "#dc3545" }}>
              Payment Failed
            </h3>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Your payment could not be processed. Please try again or contact
              support.
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
              }}>
              <button
                onClick={() => {
                  setCurrentStep("booking");
                  setErrors({});
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#1e7e34",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}>
                Try Again
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: "12px 24px",
                  border: "1px solid #ccc",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}>
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ padding: "40px" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h2 style={{ color: "#1e7e34", marginBottom: "10px" }}>
                🇯🇲 Book Your Jamaica Tour
              </h2>
              <p style={{ color: "#666" }}>
                Complete your booking information below
              </p>
            </div>

            {/* Tour Summary */}
            {fixedTour && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  padding: "25px",
                  marginBottom: "30px",
                }}>
                <h3 style={{ marginBottom: "15px", color: "#333" }}>
                  🎯 {fixedTour.title}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                    fontSize: "14px",
                  }}>
                  <div>
                    <strong>Adults:</strong> {bookingData.adults} × JMD $
                    {fixedTour.pricing?.adultPrice?.toLocaleString() ||
                      fixedTour.price?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Youth:</strong> {bookingData.youth} × JMD $
                    {(
                      fixedTour.pricing?.youthPrice || fixedTour.price * 0.8
                    )?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Children:</strong> {bookingData.children} × JMD $
                    {(
                      fixedTour.pricing?.childrenPrice || fixedTour.price * 0.5
                    )?.toLocaleString()}
                  </div>
                  <div>
                    <strong>Duration:</strong> {fixedTour.duration}
                  </div>
                </div>
                {(bookingData.isExtraService ||
                  bookingData.isServicePerPerson) && (
                  <div style={{ marginTop: "10px", fontSize: "14px" }}>
                    <strong>Additional Services:</strong> JMD $2,000
                  </div>
                )}
                <div
                  style={{
                    borderTop: "1px solid #dee2e6",
                    paddingTop: "15px",
                    marginTop: "15px",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1e7e34",
                    }}>
                    <span>Total Amount:</span>
                    <span>
                      JMD ${bookingData.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Form */}
            <div>
              {/* Date Selection */}
              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}>
                  Select Date *
                </label>
                <input
                  type='date'
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: errors.selectedDate
                      ? "1px solid #dc3545"
                      : "1px solid #ddd",
                    borderRadius: "12px",
                    fontSize: "15px",
                  }}
                  disabled={loading}
                />
                {errors.selectedDate && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "13px",
                      marginTop: "5px",
                    }}>
                    {errors.selectedDate}
                  </p>
                )}
              </div>

              {/* Customer Information */}
              <h3 style={{ marginBottom: "20px", color: "#333" }}>
                👤 Customer Information
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginBottom: "20px",
                }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    First Name *
                  </label>
                  <input
                    type='text'
                    name='firstName'
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: errors.firstName
                        ? "1px solid #dc3545"
                        : "1px solid #ddd",
                      borderRadius: "12px",
                      fontSize: "15px",
                    }}
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Last Name *
                  </label>
                  <input
                    type='text'
                    name='lastName'
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: errors.lastName
                        ? "1px solid #dc3545"
                        : "1px solid #ddd",
                      borderRadius: "12px",
                      fontSize: "15px",
                    }}
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px",
                  marginBottom: "20px",
                }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Email *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: errors.email
                        ? "1px solid #dc3545"
                        : "1px solid #ddd",
                      borderRadius: "12px",
                      fontSize: "15px",
                    }}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Jamaica Phone Number *
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    placeholder='876-123-4567'
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: errors.phone
                        ? "1px solid #dc3545"
                        : "1px solid #ddd",
                      borderRadius: "12px",
                      fontSize: "15px",
                    }}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}>
                  Special Requests (Optional)
                </label>
                <textarea
                  name='specialRequests'
                  value={customerInfo.specialRequests}
                  onChange={handleInputChange}
                  rows='4'
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    fontSize: "15px",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  placeholder='Any special requirements or requests...'
                  disabled={loading}
                />
              </div>

              {errors.guests && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "14px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}>
                  {errors.guests}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "space-between",
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "1px solid #ddd",
              }}>
              <button
                onClick={handleClose}
                style={{
                  minWidth: "120px",
                  padding: "16px 30px",
                  border: "1px solid #ddd",
                  color: "#333",
                  backgroundColor: "transparent",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
                disabled={loading}>
                Cancel
              </button>

              <button
                onClick={handleCreateBookingAndPayment}
                style={{
                  minWidth: "240px",
                  padding: "16px 30px",
                  backgroundColor: loading ? "#ccc" : "#1e7e34",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
                disabled={loading}>
                {loading ? "Processing..." : "Book & Pay with WiPay"}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        display: isOpen ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "#333",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 1001,
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
          ×
        </button>

        {/* Step Content */}
        {renderStepContent()}
      </div>

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
  );
}
