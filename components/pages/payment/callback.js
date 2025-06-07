// pages/payment/callback.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import bookingService from "../../app/store/services/bookingService";

export default function PaymentCallback() {
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");
  const [bookingDetails, setBookingDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const {
        status: paymentStatus,
        order_id,
        total,
        fee,
        hash,
        gateway_transaction_id,
      } = router.query;

      // Get pending booking info from sessionStorage
      const pendingBookingStr = sessionStorage.getItem("pendingBooking");
      let pendingBooking = null;

      if (pendingBookingStr) {
        try {
          pendingBooking = JSON.parse(pendingBookingStr);
        } catch (error) {
          console.error("Error parsing pending booking:", error);
        }
      }

      if (!paymentStatus || !order_id) {
        setStatus("error");
        setMessage(
          "Invalid payment response. Please contact support if you were charged."
        );
        return;
      }

      try {
        setMessage("Verifying payment with WiPay...");

        // Send callback data to your backend for processing and verification
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
          }/api/payment/callback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: paymentStatus,
              order_id,
              total,
              fee,
              hash,
              gateway_transaction_id,
            }),
          }
        );

        const data = await response.json();

        if (paymentStatus === "success" && data.success) {
          setMessage("Payment successful! Updating your booking...");

          // Update the booking status to confirmed
          const updatePayload = {
            status: "confirmed",
            paidAt: new Date().toISOString(),
            paymentInfo: {
              gateway: "wipay",
              transactionId: gateway_transaction_id,
              paymentMethod: "credit_card",
              amount: parseFloat(total),
              fee: parseFloat(fee || 0),
              status: "completed",
              paidAt: new Date().toISOString(),
            },
          };

          const bookingResponse = await bookingService.updateBooking(
            order_id,
            updatePayload
          );

          if (bookingResponse.status === "success") {
            setStatus("success");
            setMessage("Payment successful! Your booking has been confirmed.");
            setBookingDetails({
              ...pendingBooking,
              bookingId: order_id,
              transactionId: gateway_transaction_id,
              amount: total,
              fee: fee,
            });

            // Clear pending booking from sessionStorage
            sessionStorage.removeItem("pendingBooking");

            // Redirect to confirmation page after 3 seconds
            setTimeout(() => {
              router.push(`/booking/confirmation/${order_id}`);
            }, 3000);
          } else {
            throw new Error("Failed to update booking status");
          }
        } else {
          // Payment failed
          setStatus("error");
          setMessage(
            paymentStatus === "fail"
              ? "Payment was not successful. Please try again or contact support."
              : "Payment verification failed. Please contact support if you were charged."
          );

          // Update booking status to failed if we have the order_id
          if (order_id) {
            try {
              await bookingService.updateBooking(order_id, {
                status: "payment_failed",
                paymentInfo: {
                  gateway: "wipay",
                  transactionId: gateway_transaction_id,
                  status: "failed",
                  failureReason:
                    paymentStatus === "fail"
                      ? "Payment declined"
                      : "Payment verification failed",
                  attemptedAt: new Date().toISOString(),
                },
              });
            } catch (updateError) {
              console.error("Error updating failed booking:", updateError);
            }
          }
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("error");
        setMessage(
          "Error processing payment. Please contact support if you were charged."
        );
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

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
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        }}>
        {status === "processing" && (
          <>
            <div style={{ marginBottom: "30px" }}>
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
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "var(--color-dark-1)",
                  marginBottom: "10px",
                }}>
                Processing Payment
              </h2>
              <p
                style={{
                  color: "var(--color-light-2)",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}>
                {message}
              </p>
            </div>
            <div
              style={{
                backgroundColor: "var(--color-light-1)",
                padding: "15px",
                borderRadius: "8px",
                fontSize: "14px",
                color: "var(--color-light-2)",
              }}>
              Please do not close this window or navigate away.
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ marginBottom: "30px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "white",
                  fontSize: "40px",
                }}>
                ✓
              </div>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#10b981",
                  marginBottom: "10px",
                }}>
                Payment Successful!
              </h2>
              <p
                style={{
                  color: "var(--color-dark-1)",
                  fontSize: "16px",
                  marginBottom: "20px",
                  lineHeight: "1.5",
                }}>
                {message}
              </p>
            </div>

            {bookingDetails && (
              <div
                style={{
                  backgroundColor: "var(--color-light-1)",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  textAlign: "left",
                }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "15px",
                    color: "var(--color-dark-1)",
                  }}>
                  Booking Confirmation
                </h3>
                <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Booking ID:</strong> {bookingDetails.bookingId}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Tour:</strong> {bookingDetails.tourTitle}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Customer:</strong> {bookingDetails.customerName}
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Amount Paid:</strong> ${bookingDetails.amount} USD
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <strong>Transaction ID:</strong>{" "}
                    {bookingDetails.transactionId}
                  </div>
                  {bookingDetails.fee && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--color-light-2)",
                      }}>
                      Payment processing fee: ${bookingDetails.fee} USD
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              style={{
                backgroundColor: "#ecfdf5",
                border: "1px solid #10b981",
                borderRadius: "8px",
                padding: "15px",
                fontSize: "14px",
                color: "#065f46",
                marginBottom: "20px",
              }}>
              📧 A confirmation email has been sent to your email address.
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "var(--color-light-2)",
                marginBottom: "20px",
              }}>
              Redirecting to confirmation page in a few seconds...
            </div>

            <button
              onClick={() =>
                router.push(
                  `/booking/confirmation/${bookingDetails?.bookingId}`
                )
              }
              style={{
                backgroundColor: "var(--color-accent-1)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}>
              View Booking Details
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ marginBottom: "30px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#ef4444",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "white",
                  fontSize: "40px",
                }}>
                ✕
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#ef4444",
                  marginBottom: "10px",
                }}>
                Payment Failed
              </h2>
              <p
                style={{
                  color: "var(--color-dark-1)",
                  fontSize: "16px",
                  marginBottom: "20px",
                  lineHeight: "1.5",
                }}>
                {message}
              </p>
            </div>

            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "8px",
                padding: "15px",
                fontSize: "14px",
                color: "#991b1b",
                marginBottom: "20px",
              }}>
              If you believe this is an error or if you were charged, please
              contact our support team with any transaction details you may
              have.
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}>
              <button
                onClick={() => router.back()}
                style={{
                  backgroundColor: "var(--color-accent-1)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}>
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-dark-1)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}>
                Back to Home
              </button>
            </div>
          </>
        )}

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
