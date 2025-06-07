// app/booking-cancelled/page.js - Payment cancelled page
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import bookingService from "../store/services/bookingService";

export default function BookingCancelledPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadBookingInfo = async () => {
      try {
        // Get booking ID from localStorage or URL parameters
        const bookingId =
          searchParams.get("booking_id") ||
          localStorage.getItem("pendingBookingId");

        if (bookingId) {
          const response = await bookingService.getBooking(bookingId);
          if (response.status === "success") {
            setBooking(response.data.booking);
          }
        }
      } catch (err) {
        console.error("Error loading booking info:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookingInfo();
  }, [searchParams]);

  const handleRetryPayment = () => {
    if (booking) {
      // Redirect back to the tour page to restart the booking process
      // Or implement a retry payment flow
      const tourId = booking.tour;
      router.push(`/tour-single/${tourId}`);
    } else {
      router.push("/");
    }
  };

  const handleBrowseTours = () => {
    router.push("/tour-list");
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
          <h2>Loading...</h2>
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
          maxWidth: "700px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "50px",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}>
        {/* Cancelled Icon */}
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
            animation: "fadeIn 0.6s ease-out",
          }}>
          😔
        </div>

        {/* Main Message */}
        <h1
          style={{
            color: "var(--color-orange-1)",
            marginBottom: "15px",
            fontSize: "32px",
            fontWeight: "700",
          }}>
          Payment Cancelled
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "var(--color-light-2)",
            marginBottom: "30px",
          }}>
          Your payment was cancelled and the booking was not completed.
        </p>

        {/* Booking Info if available */}
        {booking && (
          <div
            style={{
              backgroundColor: "var(--color-light-1)",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "30px",
              textAlign: "left",
            }}>
            <h3
              style={{
                marginBottom: "15px",
                color: "var(--color-dark-1)",
                textAlign: "center",
              }}>
              📋 Booking Information
            </h3>

            <div
              style={{
                fontSize: "15px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
              }}>
              <div>
                <strong>Tour:</strong>
                <div>{booking.tourDetails?.title || "Tour Details"}</div>
              </div>

              <div>
                <strong>Amount:</strong>
                <div
                  style={{ color: "var(--color-accent-1)", fontWeight: "600" }}>
                  TTD ${booking.totalAmount?.toFixed(2)}
                </div>
              </div>

              {booking.startDate && (
                <div>
                  <strong>Date:</strong>
                  <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                </div>
              )}

              <div>
                <strong>Status:</strong>
                <div
                  style={{ color: "var(--color-orange-1)", fontWeight: "600" }}>
                  ⏳ {booking.status || "Pending Payment"}
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "15px",
                marginTop: "15px",
                fontSize: "13px",
                color: "var(--color-light-2)",
                textAlign: "center",
              }}>
              <strong>Booking ID:</strong> {booking._id}
              <br />
              <em>
                Your booking is still reserved. Complete payment to confirm.
              </em>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div
          style={{
            backgroundColor: "var(--color-blue-1)",
            color: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
            textAlign: "left",
          }}>
          <h4 style={{ marginBottom: "12px", fontSize: "16px" }}>
            💡 What you can do now:
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.6",
            }}>
            <li style={{ marginBottom: "6px" }}>
              ✅ Your booking is temporarily reserved
            </li>
            <li style={{ marginBottom: "6px" }}>
              🔄 You can retry payment to complete the booking
            </li>
            <li style={{ marginBottom: "6px" }}>
              🕒 Reservation will expire in 30 minutes without payment
            </li>
            <li>📞 Contact support if you experienced any issues</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}>
          {booking && (
            <button
              onClick={handleRetryPayment}
              style={{
                padding: "16px 32px",
                backgroundColor: "var(--color-accent-1)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseOver={(e) =>
                (e.target.style.transform = "translateY(-2px)")
              }
              onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}>
              🔄 Retry Payment
            </button>
          )}

          <button
            onClick={handleBrowseTours}
            style={{
              padding: "16px 32px",
              backgroundColor: "var(--color-blue-1)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}>
            🏞️ Browse Other Tours
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
          <button
            onClick={handleBackHome}
            style={{
              padding: "14px 28px",
              backgroundColor: "transparent",
              color: "var(--color-dark-1)",
              border: "2px solid var(--color-border)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
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

          <button
            onClick={() => {
              // Implement contact support functionality
              window.location.href =
                "mailto:support@yourtourscompany.com?subject=Payment Issue - Booking " +
                (booking?._id || "Unknown");
            }}
            style={{
              padding: "14px 28px",
              backgroundColor: "transparent",
              color: "var(--color-dark-1)",
              border: "2px solid var(--color-border)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
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
            📞 Contact Support
          </button>
        </div>

        {/* Additional Help */}
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "var(--color-light-1)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "var(--color-light-2)",
          }}>
          <strong>Need help?</strong> If you're experiencing technical
          difficulties or have questions about your booking, our customer
          support team is here to assist you.
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

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
