// pages/booking/confirmation/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import bookingService from "../../../app/store/services/bookingService";

export default function BookingConfirmation() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBooking(id);

      // Handle your API response format
      if (response && response.success !== false) {
        const booking = response.data?.booking || response.booking || response;
        setBooking(bookingService.formatBookingForDisplay(booking));
      } else {
        setError(response.message || response.error || "Booking not found");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      const errorMessage =
        error.message || error.error || "Failed to load booking details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    // Implement PDF download functionality here
    alert("PDF download feature coming soon!");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-light-3)",
        }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid var(--color-light-1)",
              borderTop: "4px solid var(--color-accent-1)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}></div>
          <p>Loading booking details...</p>
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
          backgroundColor: "var(--color-light-3)",
          padding: "20px",
        }}>
        <div
          style={{
            maxWidth: "400px",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#ef4444",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "white",
              fontSize: "24px",
            }}>
            ✕
          </div>
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "10px",
              color: "var(--color-dark-1)",
            }}>
            Booking Not Found
          </h2>
          <p
            style={{
              color: "var(--color-light-2)",
              marginBottom: "30px",
            }}>
            {error}
          </p>
          <button
            onClick={() => router.push("/")}
            style={{
              backgroundColor: "var(--color-accent-1)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              cursor: "pointer",
            }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Booking Confirmation - {booking?.tourTitle}</title>
        <meta name='description' content='Your booking confirmation details' />
      </Head>

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
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}>
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent-1), #ff6b6b)",
              color: "white",
              padding: "40px",
              textAlign: "center",
            }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "40px",
              }}>
              ✓
            </div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "10px",
              }}>
              Booking Confirmed!
            </h1>
            <p
              style={{
                fontSize: "18px",
                opacity: 0.9,
              }}>
              Thank you for your booking. We look forward to hosting you!
            </p>
          </div>

          {/* Booking Details */}
          <div style={{ padding: "40px" }}>
            {/* Quick Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginBottom: "40px",
                padding: "25px",
                backgroundColor: "var(--color-light-1)",
                borderRadius: "12px",
              }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--color-accent-1)",
                    marginBottom: "5px",
                  }}>
                  {booking?.id}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--color-light-2)",
                  }}>
                  Booking ID
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--color-accent-1)",
                    marginBottom: "5px",
                  }}>
                  {booking?.guests.total}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--color-light-2)",
                  }}>
                  Guest(s)
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--color-accent-1)",
                    marginBottom: "5px",
                  }}>
                  ${booking?.amount.toFixed(2)}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--color-light-2)",
                  }}>
                  Total Paid
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "30px",
                marginBottom: "40px",
              }}>
              {/* Tour Information */}
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "var(--color-dark-1)",
                    borderBottom: "2px solid var(--color-accent-1)",
                    paddingBottom: "10px",
                  }}>
                  Tour Details
                </h3>
                <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Tour:</strong> {booking?.tourTitle}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Date:</strong>{" "}
                    {new Date(booking?.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Guests:</strong>
                    <div
                      style={{
                        marginLeft: "20px",
                        fontSize: "14px",
                        color: "var(--color-light-2)",
                      }}>
                      {booking?.guests.adults > 0 && (
                        <div>Adults: {booking.guests.adults}</div>
                      )}
                      {booking?.guests.youth > 0 && (
                        <div>Youth: {booking.guests.youth}</div>
                      )}
                      {booking?.guests.children > 0 && (
                        <div>Children: {booking.guests.children}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "var(--color-dark-1)",
                    borderBottom: "2px solid var(--color-accent-1)",
                    paddingBottom: "10px",
                  }}>
                  Customer Information
                </h3>
                <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Name:</strong> {booking?.customerName}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Email:</strong> {booking?.email}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Phone:</strong> {booking?.phone}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Booking Date:</strong>{" "}
                    {new Date(booking?.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div
              style={{
                backgroundColor: "#f0f9ff",
                border: "1px solid #0ea5e9",
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "30px",
              }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "#0369a1",
                }}>
                Payment Information
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "15px",
                  fontSize: "14px",
                }}>
                <div>
                  <strong>Status:</strong>
                  <span
                    style={{
                      marginLeft: "8px",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        booking?.status === "confirmed" ? "#10b981" : "#f59e0b",
                      color: "white",
                      fontSize: "12px",
                    }}>
                    {booking?.status.charAt(0).toUpperCase() +
                      booking?.status.slice(1)}
                  </span>
                </div>
                <div>
                  <strong>Amount:</strong> ${booking?.amount.toFixed(2)} USD
                </div>
                <div>
                  <strong>Payment Method:</strong> WiPay Jamaica
                </div>
                {booking?.transactionId && (
                  <div>
                    <strong>Transaction ID:</strong> {booking.transactionId}
                  </div>
                )}
                {booking?.paidAt && (
                  <div>
                    <strong>Paid On:</strong>{" "}
                    {new Date(booking.paidAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Important Information */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px",
              }}>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "#92400e",
                }}>
                📋 Important Information
              </h4>
              <ul
                style={{
                  fontSize: "14px",
                  color: "#92400e",
                  paddingLeft: "20px",
                  lineHeight: "1.6",
                }}>
                <li>
                  Please arrive 15 minutes before your scheduled tour time
                </li>
                <li>Bring a valid ID and this confirmation</li>
                <li>Check weather conditions before your tour</li>
                <li>Contact us if you need to make any changes</li>
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
                onClick={handlePrint}
                style={{
                  backgroundColor: "var(--color-accent-1)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                🖨️ Print Confirmation
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-accent-1)",
                  border: "2px solid var(--color-accent-1)",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                📄 Download PDF
              </button>
              <button
                onClick={() => router.push("/")}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-dark-1)",
                  border: "2px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                🏠 Back to Home
              </button>
            </div>
          </div>
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

        @media print {
          body * {
            visibility: hidden;
          }

          .print-section,
          .print-section * {
            visibility: visible;
          }

          .print-section {
            position: absolute;
            left: 0;
            top: 0;
          }

          button {
            display: none !important;
          }
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
}
