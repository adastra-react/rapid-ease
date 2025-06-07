// app/booking-success/page.js - Success page after WiPay payment
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import bookingService from "../store/services/bookingService";

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get booking ID from localStorage or URL parameters
        const bookingId =
          searchParams.get("booking_id") ||
          localStorage.getItem("pendingBookingId");

        if (!bookingId) {
          setError("No booking ID found");
          setLoading(false);
          return;
        }

        // Verify payment status
        const response = await bookingService.verifyPayment(bookingId);

        if (response.status === "success") {
          setBooking(response.data.booking);

          // Clear pending booking ID
          localStorage.removeItem("pendingBookingId");
        } else {
          setError("Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleViewBookings = () => {
    const email =
      booking?.customerInfo?.email || localStorage.getItem("userEmail");
    if (email) {
      router.push(`/my-bookings?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/");
    }
  };

  const handleBackHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid var(--color-light-1)",
              borderTop: "4px solid var(--color-accent-1)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}></div>
          <h2>Verifying Payment...</h2>
          <p style={{ color: "var(--color-light-2)" }}>
            Please wait while we confirm your payment status.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
          }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
          <h2 style={{ color: "var(--color-red-1)", marginBottom: "15px" }}>
            Payment Verification Failed
          </h2>
          <p style={{ color: "var(--color-light-2)", marginBottom: "30px" }}>
            {error}
          </p>
          <button
            onClick={handleBackHome}
            style={{
              padding: "15px 30px",
              backgroundColor: "var(--color-accent-1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}>
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light-3)",
        padding: "40px 20px",
      }}>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "50px",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}>
        {/* Success Icon */}
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
            animation: "bounceIn 0.6s ease-out",
          }}>
          🎉
        </div>

        {/* Success Message */}
        <h1
          style={{
            color: "var(--color-accent-1)",
            marginBottom: "15px",
            fontSize: "32px",
            fontWeight: "700",
          }}>
          Payment Successful!
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--color-light-2)",
            marginBottom: "40px",
          }}>
          Your booking has been confirmed and payment processed successfully.
        </p>

        {/* Booking Details Card */}
        {booking && (
          <div
            style={{
              backgroundColor: "var(--color-light-1)",
              borderRadius: "12px",
              padding: "30px",
              marginBottom: "40px",
              textAlign: "left",
            }}>
            <h3
              style={{
                marginBottom: "20px",
                color: "var(--color-dark-1)",
                textAlign: "center",
              }}>
              📋 Booking Confirmation
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                fontSize: "15px",
              }}>
              <div>
                <strong>Booking ID:</strong>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "13px",
                    color: "var(--color-light-2)",
                    wordBreak: "break-all",
                  }}>
                  {booking._id}
                </div>
              </div>

              <div>
                <strong>Tour:</strong>
                <div>{booking.tourDetails?.title || "Tour Details"}</div>
              </div>

              <div>
                <strong>Customer:</strong>
                <div>
                  {booking.customerInfo.firstName}{" "}
                  {booking.customerInfo.lastName}
                </div>
              </div>

              <div>
                <strong>Email:</strong>
                <div>{booking.customerInfo.email}</div>
              </div>

              <div>
                <strong>Date:</strong>
                <div>{new Date(booking.startDate).toLocaleDateString()}</div>
              </div>

              <div>
                <strong>Guests:</strong>
                <div>
                  {(booking.adults || 0) +
                    (booking.youth || 0) +
                    (booking.children || 0)}{" "}
                  person(s)
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "20px",
                marginTop: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <div>
                  <strong>Payment Status:</strong>
                  <span
                    style={{
                      color: "var(--color-green-1)",
                      marginLeft: "10px",
                      fontWeight: "600",
                    }}>
                    ✅ {booking.paymentInfo?.status || "Completed"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "var(--color-accent-1)",
                  }}>
                  TTD ${booking.totalAmount?.toFixed(2)}
                </div>
              </div>

              {booking.paymentInfo?.transactionId && (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "var(--color-light-2)",
                  }}>
                  <strong>Transaction ID:</strong>{" "}
                  {booking.paymentInfo.transactionId}
                </div>
              )}
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div
          style={{
            backgroundColor: "var(--color-blue-1)",
            color: "white",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            textAlign: "left",
          }}>
          <h4 style={{ marginBottom: "15px", fontSize: "18px" }}>
            📧 What happens next?
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.6",
            }}>
            <li style={{ marginBottom: "8px" }}>
              ✅ Confirmation email sent to {booking?.customerInfo?.email}
            </li>
            <li style={{ marginBottom: "8px" }}>
              📅 Tour details will be sent 24 hours before your tour date
            </li>
            <li style={{ marginBottom: "8px" }}>
              📞 Our team may contact you if any special arrangements are needed
            </li>
            <li>
              🎫 Please bring this confirmation and a valid ID on your tour date
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
          <button
            onClick={handleViewBookings}
            style={{
              padding: "15px 30px",
              backgroundColor: "var(--color-accent-1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}>
            📋 View My Bookings
          </button>

          <button
            onClick={handleBackHome}
            style={{
              padding: "15px 30px",
              backgroundColor: "transparent",
              color: "var(--color-dark-1)",
              border: "2px solid var(--color-border)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "var(--color-accent-1)";
              e.target.style.color = "var(--color-accent-1)";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.color = "var(--color-dark-1)";
            }}>
            🏠 Back to Homepage
          </button>
        </div>

        {/* Print Button */}
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "12px 24px",
              backgroundColor: "var(--color-light-1)",
              color: "var(--color-dark-1)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}>
            🖨️ Print Confirmation
          </button>
        </div>
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

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}
