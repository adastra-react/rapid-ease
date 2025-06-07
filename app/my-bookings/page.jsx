// app/my-bookings/page.js - Booking lookup and management page
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import bookingService from "../store/services/bookingService";

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for email in URL or localStorage
    const emailFromUrl = searchParams.get("email");
    const emailFromStorage = localStorage.getItem("userEmail");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
      handleSearch(emailFromUrl);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, [searchParams]);

  const handleSearch = async (searchEmail = email) => {
    if (!searchEmail || !searchEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await bookingService.getBookingsByEmail(searchEmail);

      if (response.status === "success") {
        setBookings(response.data.bookings);
        localStorage.setItem("userEmail", searchEmail);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Search bookings error:", err);
      setError(err.message || "Failed to search bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await bookingService.cancelBooking(bookingId);

      if (response.status === "success") {
        // Refresh bookings
        await handleSearch();
        alert("Booking cancelled successfully");
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "var(--color-green-1)";
      case "pending":
        return "var(--color-orange-1)";
      case "cancelled":
        return "var(--color-red-1)";
      case "completed":
        return "var(--color-blue-1)";
      case "payment_failed":
        return "var(--color-red-1)";
      default:
        return "var(--color-light-2)";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "pending":
        return "⏳";
      case "cancelled":
        return "❌";
      case "completed":
        return "🎉";
      case "payment_failed":
        return "💳";
      default:
        return "❓";
    }
  };

  const canCancelBooking = (booking) => {
    if (booking.status !== "confirmed" && booking.status !== "pending") {
      return false;
    }

    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursDiff = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return hoursDiff >= 24;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-light-3)",
        padding: "40px 20px",
      }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "var(--color-dark-1)",
              marginBottom: "10px",
            }}>
            📋 My Bookings
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--color-light-2)",
            }}>
            Search and manage your tour bookings
          </p>
        </div>

        {/* Search Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
          }}>
          <h3
            style={{
              marginBottom: "20px",
              color: "var(--color-dark-1)",
            }}>
            🔍 Find Your Bookings
          </h3>

          <div
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}>
                Email Address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder='Enter your email address'
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "16px",
                  outline: "none",
                }}
                disabled={loading}
              />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading || !email}
              style={{
                padding: "15px 30px",
                backgroundColor: loading ? "#ccc" : "var(--color-accent-1)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                minWidth: "120px",
              }}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                backgroundColor: "var(--color-red-1)",
                color: "white",
                borderRadius: "6px",
                fontSize: "14px",
              }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
            }}>
            {bookings.length === 0 && !loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--color-light-2)",
                }}>
                <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
                <h3>No bookings found</h3>
                <p>No bookings were found for this email address.</p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    marginBottom: "25px",
                    color: "var(--color-dark-1)",
                  }}>
                  📅 Your Bookings ({bookings.length})
                </h3>

                <div
                  style={{
                    display: "grid",
                    gap: "20px",
                  }}>
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        padding: "25px",
                        backgroundColor: "var(--color-light-1)",
                        transition: "all 0.2s",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "20px",
                          flexWrap: "wrap",
                          gap: "15px",
                        }}>
                        {/* Booking Info */}
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: "20px",
                              fontWeight: "600",
                              marginBottom: "8px",
                              color: "var(--color-dark-1)",
                            }}>
                            {booking.tourDetails?.title || "Tour Booking"}
                          </h4>

                          <div
                            style={{
                              fontSize: "13px",
                              color: "var(--color-light-2)",
                              fontFamily: "monospace",
                              marginBottom: "10px",
                            }}>
                            ID: {booking._id}
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: "10px",
                              fontSize: "14px",
                            }}>
                            <div>
                              <strong>📅 Date:</strong>{" "}
                              {new Date(booking.startDate).toLocaleDateString()}
                            </div>
                            <div>
                              <strong>👥 Guests:</strong>{" "}
                              {(booking.adults || 0) +
                                (booking.youth || 0) +
                                (booking.children || 0)}
                            </div>
                            <div>
                              <strong>💰 Amount:</strong> TTD $
                              {booking.totalAmount?.toFixed(2)}
                            </div>
                            <div>
                              <strong>📧 Email:</strong>{" "}
                              {booking.customerInfo.email}
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "10px",
                            minWidth: "150px",
                          }}>
                          {/* Status Badge */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              backgroundColor:
                                getStatusColor(booking.status) + "20",
                              color: getStatusColor(booking.status),
                              borderRadius: "20px",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1).replace("_", " ")}
                          </div>

                          {/* Action Buttons */}
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}>
                            <button
                              onClick={() =>
                                router.push(`/booking-details/${booking._id}`)
                              }
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "var(--color-blue-1)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}>
                              View Details
                            </button>

                            {canCancelBooking(booking) && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: "var(--color-red-1)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}>
                                Cancel
                              </button>
                            )}

                            {booking.status === "payment_failed" && (
                              <button
                                onClick={() => {
                                  // Implement retry payment logic
                                  alert("Payment retry feature coming soon");
                                }}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: "var(--color-orange-1)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}>
                                Retry Payment
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {booking.customerInfo.specialRequests && (
                        <div
                          style={{
                            marginTop: "15px",
                            padding: "12px",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            fontSize: "14px",
                          }}>
                          <strong>Special Requests:</strong>
                          <div
                            style={{
                              marginTop: "5px",
                              color: "var(--color-light-2)",
                            }}>
                            {booking.customerInfo.specialRequests}
                          </div>
                        </div>
                      )}

                      {/* Payment Info */}
                      {booking.paymentInfo &&
                        booking.paymentInfo.transactionId && (
                          <div
                            style={{
                              marginTop: "10px",
                              fontSize: "12px",
                              color: "var(--color-light-2)",
                            }}>
                            <strong>Transaction:</strong>{" "}
                            {booking.paymentInfo.transactionId}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}>
          <button
            onClick={() => router.push("/")}
            style={{
              padding: "15px 30px",
              backgroundColor: "transparent",
              color: "var(--color-dark-1)",
              border: "2px solid var(--color-border)",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}>
            🏠 Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
