// "use client";

// import React, { useState, useEffect } from "react";
// import bookingService from "../../app/store/services/bookingService";

// export default function BookingModal({
//   isOpen,
//   onClose,
//   tour,
//   bookingData,
//   onBookingSuccess,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [customerInfo, setCustomerInfo] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     specialRequests: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [bookingCreated, setBookingCreated] = useState(null);
//   const [paymentUrl, setPaymentUrl] = useState(null);

//   // New payment states
//   const [currentStep, setCurrentStep] = useState("booking"); // 'booking', 'processing', 'payment', 'success', 'failed'
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [paymentError, setPaymentError] = useState(null);
//   const [paymentWindow, setPaymentWindow] = useState(null);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);

//   // if (!event.origin.includes("wipayfinancial.com")) return;

//   // Fix tour object on mount
//   const getFixedTour = () => {
//     if (!tour) return null;

//     let tourId = null;

//     if (tour.id && typeof tour.id === "number") {
//       tourId = tour.id;
//     } else if (tour.tourId && typeof tour.tourId === "number") {
//       tourId = tour.tourId;
//     } else if (
//       tour.id &&
//       typeof tour.id === "string" &&
//       !isNaN(parseInt(tour.id))
//     ) {
//       tourId = parseInt(tour.id);
//     } else {
//       const urlParams = window.location.pathname.split("/");
//       const urlTourId = urlParams[urlParams.length - 1];
//       if (urlTourId && !isNaN(parseInt(urlTourId))) {
//         tourId = parseInt(urlTourId);
//       } else {
//         tourId = 39; // Fallback
//       }
//     }

//     const fixedTour = {
//       ...tour,
//       id: tourId,
//       title: tour.title || "Tour Booking",
//       price: tour.price || tour.basePrice || 15000, // JMD 15,000
//       pricing: tour.pricing || {
//         adultPrice: tour.price || tour.basePrice || 15000,
//         youthPrice: (tour.price || tour.basePrice || 15000) * 0.8,
//         childrenPrice: (tour.price || tour.basePrice || 15000) * 0.5,
//         servicePrice: 2000, // JMD 2,000
//       },
//       duration: tour.duration || "4 hours",
//     };

//     return fixedTour;
//   };

//   // Listen for payment completion messages
//   useEffect(() => {
//     const handleMessage = (event) => {
//       console.log("📨 Message received from:", event.origin);
//       console.log("📦 Message data:", event.data);

//       // Allow messages from localhost for testing AND from WiPay domains for production
//       const isValidOrigin =
//         event.origin.includes("localhost") ||
//         event.origin.includes("127.0.0.1") ||
//         event.origin.includes("wipayfinancial.com") ||
//         event.origin === "null"; // For local file:// protocols

//       if (!isValidOrigin) {
//         console.warn("⚠️ Message blocked from untrusted origin:", event.origin);
//         return;
//       }

//       if (event.data && event.data.type === "WIPAY_PAYMENT_COMPLETE") {
//         console.log("🇯🇲 Payment message received:", event.data);
//         handlePaymentResponse(event.data.paymentData);
//       }
//     };

//     // Listen for messages from popup
//     window.addEventListener("message", handleMessage);

//     // Check if payment window is closed manually
//     let checkClosed;
//     if (paymentWindow) {
//       checkClosed = setInterval(() => {
//         if (paymentWindow.closed && !paymentCompleted) {
//           console.log("🔄 Payment window was closed manually");
//           setCurrentStep("failed");
//           setPaymentError("Payment window was closed. Please try again.");
//           setPaymentWindow(null);
//           clearInterval(checkClosed);
//         }
//       }, 1000);
//     }

//     return () => {
//       window.removeEventListener("message", handleMessage);
//       if (checkClosed) clearInterval(checkClosed);
//     };
//   }, [paymentWindow, paymentCompleted]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCustomerInfo((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const validateJamaicaPhone = (phone) => {
//     const cleanPhone = phone.replace(/\D/g, "");
//     return cleanPhone.length >= 7 && cleanPhone.length <= 11;
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!selectedDate) {
//       newErrors.selectedDate = "Please select a date";
//     }

//     if (!customerInfo.firstName.trim()) {
//       newErrors.firstName = "First name is required";
//     }

//     if (!customerInfo.lastName.trim()) {
//       newErrors.lastName = "Last name is required";
//     }

//     if (!customerInfo.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!customerInfo.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!validateJamaicaPhone(customerInfo.phone)) {
//       newErrors.phone =
//         "Please provide a valid Jamaica phone number (e.g., 876-123-4567)";
//     }

//     if (
//       bookingData.adults === 0 &&
//       bookingData.youth === 0 &&
//       bookingData.children === 0
//     ) {
//       newErrors.guests = "Please select at least one guest";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handlePaymentResponse = async (paymentData) => {
//     console.log("🔄 Processing payment response:", paymentData);
//     setCurrentStep("processing");

//     try {
//       if (
//         paymentData.status === "success" ||
//         paymentData.response_code === "00"
//       ) {
//         // Payment successful
//         setPaymentCompleted(true);
//         setCurrentStep("success");
//         setPaymentStatus("completed");

//         // Store success info
//         localStorage.setItem("userEmail", customerInfo.email);
//         localStorage.setItem("completedBookingId", bookingCreated._id);

//         // Close payment window
//         if (paymentWindow) {
//           paymentWindow.close();
//           setPaymentWindow(null);
//         }

//         // Call success callback
//         if (onBookingSuccess) {
//           onBookingSuccess({
//             booking: bookingCreated,
//             paymentStatus: "completed",
//             paymentData,
//           });
//         }
//       } else {
//         // Payment failed
//         setCurrentStep("failed");
//         setPaymentError(
//           paymentData.response_text || "Payment failed. Please try again."
//         );
//         setPaymentStatus("failed");

//         if (paymentWindow) {
//           paymentWindow.close();
//           setPaymentWindow(null);
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error processing payment response:", error);
//       setCurrentStep("failed");
//       setPaymentError("Error processing payment. Please contact support.");
//     }
//   };

//   const openPaymentWindow = (paymentUrl) => {
//     const popup = window.open(
//       paymentUrl,
//       "wipay_payment",
//       "width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
//     );

//     setPaymentWindow(popup);
//     setCurrentStep("payment");

//     // Focus the popup
//     if (popup) {
//       popup.focus();
//     } else {
//       // Popup blocked
//       alert(
//         "Please allow popups for this site to process payment, or click the payment link below."
//       );
//       window.open(paymentUrl, "_blank");
//     }
//   };

//   const handleCreateBookingAndPay = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setCurrentStep("processing");

//     try {
//       const fixedTour = getFixedTour();

//       if (!fixedTour || !fixedTour.id) {
//         throw new Error("Invalid tour object. Cannot determine tour ID.");
//       }

//       console.log("🇯🇲 Creating booking for Jamaica tour:", fixedTour);

//       // Create booking payload with modal return URLs
//       const bookingPayload = {
//         tour: fixedTour.id,
//         customerInfo: customerInfo,
//         startDate: selectedDate,
//         adults: bookingData.adults || 1,
//         youth: bookingData.youth || 0,
//         children: bookingData.children || 0,
//         additionalServices:
//           bookingData.isExtraService || bookingData.isServicePerPerson || false,
//         returnUrl: `${window.location.origin}/api/bookings/wipay/response?modal=true`,
//         cancelUrl: `${window.location.origin}/api/bookings/wipay/response?modal=true&cancelled=true`,
//       };

//       console.log("📋 Jamaica booking payload:", bookingPayload);

//       const response = await bookingService.createBooking(bookingPayload);

//       if (response.status === "success") {
//         console.log("✅ Booking created successfully:", response.data);

//         setBookingCreated(response.data.booking);
//         setPaymentUrl(response.data.paymentUrl);
//         setLoading(false);

//         // Open payment in popup window
//         openPaymentWindow(response.data.paymentUrl);
//       }
//     } catch (error) {
//       console.error("❌ Jamaica booking creation error:", error);
//       setLoading(false);
//       setCurrentStep("failed");

//       let errorMessage = "Failed to create booking. Please try again.";
//       if (error.message) {
//         errorMessage = error.message;
//       } else if (error.error) {
//         errorMessage = error.error;
//       }

//       setPaymentError(errorMessage);
//     }
//   };

//   const retryPayment = () => {
//     if (paymentUrl) {
//       setCurrentStep("payment");
//       setPaymentError(null);
//       openPaymentWindow(paymentUrl);
//     } else {
//       // Restart the whole process
//       setCurrentStep("booking");
//       setPaymentError(null);
//       setPaymentStatus(null);
//       setBookingCreated(null);
//       setPaymentUrl(null);
//     }
//   };

//   const handleClose = () => {
//     // Close payment window if open
//     if (paymentWindow && !paymentWindow.closed) {
//       paymentWindow.close();
//     }

//     // Reset all states
//     setBookingCreated(null);
//     setPaymentUrl(null);
//     setErrors({});
//     setCustomerInfo({
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       specialRequests: "",
//     });
//     setSelectedDate("");
//     setLoading(false);
//     setCurrentStep("booking");
//     setPaymentStatus(null);
//     setPaymentError(null);
//     setPaymentWindow(null);
//     setPaymentCompleted(false);
//     onClose();
//   };

//   if (!isOpen) return null;

//   const fixedTour = getFixedTour();

//   // Render different content based on current step
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case "processing":
//         return (
//           <div style={{ textAlign: "center", padding: "60px 40px" }}>
//             <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
//             <h3 style={{ marginBottom: "15px", color: "var(--color-dark-1)" }}>
//               {loading ? "Creating your booking..." : "Processing payment..."}
//             </h3>
//             <p style={{ color: "var(--color-light-2)", marginBottom: "20px" }}>
//               {loading
//                 ? "Please wait while we prepare your booking."
//                 : "Please complete payment in the popup window."}
//             </p>
//             <div
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 border: "4px solid #f3f3f3",
//                 borderTop: "4px solid #1e7e34",
//                 borderRadius: "50%",
//                 animation: "spin 1s linear infinite",
//                 margin: "0 auto",
//               }}></div>
//           </div>
//         );

//       case "payment":
//         return (
//           <div style={{ textAlign: "center", padding: "60px 40px" }}>
//             <div style={{ fontSize: "48px", marginBottom: "20px" }}>💳</div>
//             <h3 style={{ marginBottom: "15px", color: "var(--color-dark-1)" }}>
//               Complete Payment
//             </h3>
//             <p style={{ color: "var(--color-light-2)", marginBottom: "30px" }}>
//               Please complete your payment in the WiPay Jamaica popup window.
//             </p>

//             {paymentUrl && (
//               <div style={{ marginBottom: "30px" }}>
//                 <a
//                   href={paymentUrl}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   style={{
//                     display: "inline-block",
//                     padding: "12px 24px",
//                     backgroundColor: "#1e7e34",
//                     color: "white",
//                     textDecoration: "none",
//                     borderRadius: "8px",
//                     marginBottom: "15px",
//                   }}>
//                   🇯🇲 Open Payment Window
//                 </a>
//                 <p style={{ fontSize: "13px", color: "var(--color-light-2)" }}>
//                   If the popup was blocked, click the link above
//                 </p>
//               </div>
//             )}

//             <button
//               onClick={() => setCurrentStep("booking")}
//               style={{
//                 padding: "10px 20px",
//                 border: "1px solid #ccc",
//                 backgroundColor: "transparent",
//                 borderRadius: "6px",
//                 cursor: "pointer",
//               }}>
//               ← Go Back
//             </button>
//           </div>
//         );

//       case "success":
//         return (
//           <div style={{ textAlign: "center", padding: "60px 40px" }}>
//             <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
//             <h3 style={{ marginBottom: "15px", color: "#1e7e34" }}>
//               Booking Confirmed!
//             </h3>
//             <p style={{ color: "var(--color-light-2)", marginBottom: "20px" }}>
//               Your Jamaica tour has been successfully booked and paid for.
//             </p>

//             {bookingCreated && (
//               <div
//                 style={{
//                   backgroundColor: "#f8f9fa",
//                   borderRadius: "12px",
//                   padding: "20px",
//                   marginBottom: "30px",
//                   textAlign: "left",
//                 }}>
//                 <h4
//                   style={{
//                     marginBottom: "10px",
//                     color: "var(--color-dark-1)",
//                   }}>
//                   Booking Details
//                 </h4>
//                 <p>
//                   <strong>Booking ID:</strong> {bookingCreated._id}
//                 </p>
//                 <p>
//                   <strong>Tour:</strong> {fixedTour.title}
//                 </p>
//                 <p>
//                   <strong>Date:</strong> {selectedDate}
//                 </p>
//                 <p>
//                   <strong>Guests:</strong> {bookingData.adults} Adults,{" "}
//                   {bookingData.youth} Youth, {bookingData.children} Children
//                 </p>
//                 <p>
//                   <strong>Total:</strong> JMD $
//                   {bookingData.totalAmount?.toLocaleString()}
//                 </p>
//               </div>
//             )}

//             <p
//               style={{
//                 fontSize: "13px",
//                 color: "var(--color-light-2)",
//                 marginBottom: "30px",
//               }}>
//               A confirmation email has been sent to {customerInfo.email}
//             </p>

//             <button
//               onClick={handleClose}
//               style={{
//                 padding: "15px 30px",
//                 backgroundColor: "#1e7e34",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 cursor: "pointer",
//                 fontSize: "16px",
//               }}>
//               Close
//             </button>
//           </div>
//         );

//       case "failed":
//         return (
//           <div style={{ textAlign: "center", padding: "60px 40px" }}>
//             <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
//             <h3 style={{ marginBottom: "15px", color: "#dc3545" }}>
//               Payment Failed
//             </h3>
//             <p style={{ color: "var(--color-light-2)", marginBottom: "20px" }}>
//               {paymentError ||
//                 "Something went wrong with your payment. Please try again."}
//             </p>

//             <div
//               style={{
//                 display: "flex",
//                 gap: "15px",
//                 justifyContent: "center",
//               }}>
//               <button
//                 onClick={retryPayment}
//                 style={{
//                   padding: "12px 24px",
//                   backgroundColor: "#1e7e34",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                 }}>
//                 Try Again
//               </button>
//               <button
//                 onClick={handleClose}
//                 style={{
//                   padding: "12px 24px",
//                   border: "1px solid #ccc",
//                   backgroundColor: "transparent",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                 }}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div style={{ padding: "40px", paddingTop: "60px" }}>
//             {/* Header */}
//             <div style={{ marginBottom: "30px", textAlign: "center" }}>
//               <h2
//                 className='text-30 fw-700'
//                 style={{ color: "var(--color-dark-1)", marginBottom: "10px" }}>
//                 🇯🇲 Complete Your Jamaica Tour Booking
//               </h2>
//               <div
//                 className='line'
//                 style={{
//                   width: "60px",
//                   height: "3px",
//                   backgroundColor: "var(--color-accent-1)",
//                   margin: "0 auto",
//                 }}></div>
//               <p
//                 style={{
//                   marginTop: "10px",
//                   color: "var(--color-light-2)",
//                   fontSize: "14px",
//                 }}>
//                 Secure payment powered by WiPay Jamaica
//               </p>
//             </div>

//             {/* Tour Summary */}
//             {fixedTour && (
//               <div
//                 style={{
//                   backgroundColor: "var(--color-light-1)",
//                   borderRadius: "12px",
//                   padding: "25px",
//                   marginBottom: "30px",
//                 }}>
//                 <h3
//                   className='text-18 fw-500'
//                   style={{
//                     marginBottom: "15px",
//                     color: "var(--color-dark-1)",
//                   }}>
//                   🎯 {fixedTour.title}
//                 </h3>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                     gap: "15px",
//                     fontSize: "14px",
//                   }}>
//                   <div>
//                     <strong>Adults:</strong> {bookingData.adults} × JMD $
//                     {fixedTour.pricing?.adultPrice?.toLocaleString() ||
//                       fixedTour.price?.toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>Youth:</strong> {bookingData.youth} × JMD $
//                     {(
//                       fixedTour.pricing?.youthPrice || fixedTour.price * 0.8
//                     )?.toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>Children:</strong> {bookingData.children} × JMD $
//                     {(
//                       fixedTour.pricing?.childrenPrice || fixedTour.price * 0.5
//                     )?.toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>Duration:</strong> {fixedTour.duration}
//                   </div>
//                 </div>
//                 {(bookingData.isExtraService ||
//                   bookingData.isServicePerPerson) && (
//                   <div style={{ marginTop: "10px", fontSize: "14px" }}>
//                     <strong>Additional Services:</strong> JMD $2,000
//                   </div>
//                 )}
//                 <div
//                   style={{
//                     borderTop: "1px solid var(--color-border)",
//                     paddingTop: "15px",
//                     marginTop: "15px",
//                   }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       fontSize: "18px",
//                       fontWeight: "700",
//                       color: "var(--color-accent-1)",
//                     }}>
//                     <span>Total Amount:</span>
//                     <span>
//                       JMD ${bookingData.totalAmount?.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Customer Form */}
//             <form onSubmit={(e) => e.preventDefault()}>
//               {/* Date Selection */}
//               <div style={{ marginBottom: "25px" }}>
//                 <label
//                   className='text-15 fw-500'
//                   style={{
//                     display: "block",
//                     marginBottom: "8px",
//                     color: "var(--color-dark-1)",
//                   }}>
//                   Select Date *
//                 </label>
//                 <input
//                   type='date'
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   min={new Date().toISOString().split("T")[0]}
//                   style={{
//                     width: "100%",
//                     padding: "15px",
//                     border: errors.selectedDate
//                       ? "1px solid var(--color-red-1)"
//                       : "1px solid var(--color-border)",
//                     borderRadius: "12px",
//                     fontSize: "15px",
//                     outline: "none",
//                     transition: "border-color 0.2s",
//                   }}
//                   disabled={loading}
//                 />
//                 {errors.selectedDate && (
//                   <p
//                     style={{
//                       color: "var(--color-red-1)",
//                       fontSize: "13px",
//                       marginTop: "5px",
//                     }}>
//                     {errors.selectedDate}
//                   </p>
//                 )}
//               </div>

//               {/* Customer Information */}
//               <h3
//                 className='text-18 fw-500'
//                 style={{ marginBottom: "20px", color: "var(--color-dark-1)" }}>
//                 👤 Customer Information
//               </h3>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                   gap: "20px",
//                   marginBottom: "20px",
//                 }}>
//                 <div>
//                   <label
//                     className='text-15 fw-500'
//                     style={{
//                       display: "block",
//                       marginBottom: "8px",
//                       color: "var(--color-dark-1)",
//                     }}>
//                     First Name *
//                   </label>
//                   <input
//                     type='text'
//                     name='firstName'
//                     value={customerInfo.firstName}
//                     onChange={handleInputChange}
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       border: errors.firstName
//                         ? "1px solid var(--color-red-1)"
//                         : "1px solid var(--color-border)",
//                       borderRadius: "12px",
//                       fontSize: "15px",
//                       outline: "none",
//                       transition: "border-color 0.2s",
//                     }}
//                     disabled={loading}
//                   />
//                   {errors.firstName && (
//                     <p
//                       style={{
//                         color: "var(--color-red-1)",
//                         fontSize: "13px",
//                         marginTop: "5px",
//                       }}>
//                       {errors.firstName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     className='text-15 fw-500'
//                     style={{
//                       display: "block",
//                       marginBottom: "8px",
//                       color: "var(--color-dark-1)",
//                     }}>
//                     Last Name *
//                   </label>
//                   <input
//                     type='text'
//                     name='lastName'
//                     value={customerInfo.lastName}
//                     onChange={handleInputChange}
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       border: errors.lastName
//                         ? "1px solid var(--color-red-1)"
//                         : "1px solid var(--color-border)",
//                       borderRadius: "12px",
//                       fontSize: "15px",
//                       outline: "none",
//                       transition: "border-color 0.2s",
//                     }}
//                     disabled={loading}
//                   />
//                   {errors.lastName && (
//                     <p
//                       style={{
//                         color: "var(--color-red-1)",
//                         fontSize: "13px",
//                         marginTop: "5px",
//                       }}>
//                       {errors.lastName}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                   gap: "20px",
//                   marginBottom: "20px",
//                 }}>
//                 <div>
//                   <label
//                     className='text-15 fw-500'
//                     style={{
//                       display: "block",
//                       marginBottom: "8px",
//                       color: "var(--color-dark-1)",
//                     }}>
//                     Email *
//                   </label>
//                   <input
//                     type='email'
//                     name='email'
//                     value={customerInfo.email}
//                     onChange={handleInputChange}
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       border: errors.email
//                         ? "1px solid var(--color-red-1)"
//                         : "1px solid var(--color-border)",
//                       borderRadius: "12px",
//                       fontSize: "15px",
//                       outline: "none",
//                       transition: "border-color 0.2s",
//                     }}
//                     disabled={loading}
//                   />
//                   {errors.email && (
//                     <p
//                       style={{
//                         color: "var(--color-red-1)",
//                         fontSize: "13px",
//                         marginTop: "5px",
//                       }}>
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label
//                     className='text-15 fw-500'
//                     style={{
//                       display: "block",
//                       marginBottom: "8px",
//                       color: "var(--color-dark-1)",
//                     }}>
//                     Jamaica Phone Number *
//                   </label>
//                   <input
//                     type='tel'
//                     name='phone'
//                     value={customerInfo.phone}
//                     onChange={handleInputChange}
//                     placeholder='876-123-4567'
//                     style={{
//                       width: "100%",
//                       padding: "15px",
//                       border: errors.phone
//                         ? "1px solid var(--color-red-1)"
//                         : "1px solid var(--color-border)",
//                       borderRadius: "12px",
//                       fontSize: "15px",
//                       outline: "none",
//                       transition: "border-color 0.2s",
//                     }}
//                     disabled={loading}
//                   />
//                   {errors.phone && (
//                     <p
//                       style={{
//                         color: "var(--color-red-1)",
//                         fontSize: "13px",
//                         marginTop: "5px",
//                       }}>
//                       {errors.phone}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div style={{ marginBottom: "30px" }}>
//                 <label
//                   className='text-15 fw-500'
//                   style={{
//                     display: "block",
//                     marginBottom: "8px",
//                     color: "var(--color-dark-1)",
//                   }}>
//                   Special Requests (Optional)
//                 </label>
//                 <textarea
//                   name='specialRequests'
//                   value={customerInfo.specialRequests}
//                   onChange={handleInputChange}
//                   rows='4'
//                   style={{
//                     width: "100%",
//                     padding: "15px",
//                     border: "1px solid var(--color-border)",
//                     borderRadius: "12px",
//                     fontSize: "15px",
//                     outline: "none",
//                     resize: "vertical",
//                     fontFamily: "inherit",
//                   }}
//                   placeholder='Any special requirements or requests...'
//                   disabled={loading}
//                 />
//               </div>

//               {errors.guests && (
//                 <p
//                   style={{
//                     color: "var(--color-red-1)",
//                     fontSize: "14px",
//                     marginBottom: "20px",
//                     textAlign: "center",
//                   }}>
//                   {errors.guests}
//                 </p>
//               )}
//             </form>

//             {/* WiPay Jamaica Info */}
//             <div
//               style={{
//                 backgroundColor: "#1e7e34", // Jamaica green
//                 color: "white",
//                 borderRadius: "12px",
//                 padding: "20px",
//                 marginBottom: "30px",
//                 textAlign: "center",
//               }}>
//               <h4 style={{ marginBottom: "10px", fontSize: "16px" }}>
//                 🇯🇲 Secure Payment with WiPay Jamaica
//               </h4>
//               <div style={{ fontSize: "13px", lineHeight: "1.5" }}>
//                 <p style={{ marginBottom: "8px" }}>
//                   ✅ All major credit/debit cards accepted
//                 </p>
//                 <p style={{ marginBottom: "8px" }}>
//                   🔒 Bank-level security and encryption
//                 </p>
//                 <p style={{ marginBottom: "0" }}>
//                   💳 Payment processed in Jamaica Dollars (JMD)
//                 </p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: "15px",
//                 justifyContent: "space-between",
//                 marginTop: "30px",
//                 paddingTop: "20px",
//                 borderTop: "1px solid var(--color-border)",
//               }}>
//               <button
//                 onClick={handleClose}
//                 className='button -md -outline-dark-1'
//                 style={{
//                   minWidth: "120px",
//                   padding: "16px 30px",
//                   border: "1px solid var(--color-border)",
//                   color: "var(--color-dark-1)",
//                   backgroundColor: "transparent",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                 }}
//                 disabled={loading}>
//                 Cancel
//               </button>

//               <button
//                 onClick={handleCreateBookingAndPay}
//                 className='button -md -dark-1 bg-accent-1 text-white'
//                 style={{
//                   minWidth: "240px",
//                   padding: "16px 30px",
//                   backgroundColor: loading ? "#ccc" : "#1e7e34", // Jamaica green
//                   color: "white",
//                   border: "none",
//                   borderRadius: "12px",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   transition: "all 0.2s",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                 }}
//                 disabled={loading}>
//                 {loading ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}>
//                     <div
//                       style={{
//                         width: "16px",
//                         height: "16px",
//                         border: "2px solid transparent",
//                         borderTop: "2px solid white",
//                         borderRadius: "50%",
//                         animation: "spin 1s linear infinite",
//                         marginRight: "8px",
//                       }}></div>
//                     Processing...
//                   </div>
//                 ) : (
//                   "🇯🇲 Pay with WiPay Jamaica"
//                 )}
//               </button>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div
//       className={`modal ${isOpen ? "activeImageLightBox" : ""}`}
//       style={{
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         zIndex: 1000,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}>
//       <div
//         className='modal-content'
//         style={{
//           backgroundColor: "white",
//           borderRadius: "12px",
//           maxWidth: "700px",
//           width: "90%",
//           maxHeight: "90vh",
//           overflow: "auto",
//           padding: "0",
//           position: "relative",
//         }}>
//         {/* Close Button */}
//         <span
//           className='close'
//           onClick={handleClose}
//           style={{
//             position: "absolute",
//             top: "20px",
//             right: "30px",
//             color: "var(--color-dark-1)",
//             fontSize: "28px",
//             fontWeight: "bold",
//             cursor: "pointer",
//             zIndex: 1001,
//             background: "white",
//             borderRadius: "100%",
//             width: "40px",
//             height: "40px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//           }}>
//           &times;
//         </span>

//         {/* Dynamic Content Based on Step */}
//         {renderStepContent()}
//       </div>

//       <style jsx>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         input:focus,
//         textarea:focus {
//           border-color: #1e7e34 !important;
//           box-shadow: 0 0 0 3px rgba(30, 126, 52, 0.1);
//         }

//         .button:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
//         }

//         .modal-content {
//           animation: modalSlideIn 0.3s ease-out;
//         }

//         @keyframes modalSlideIn {
//           from {
//             opacity: 0;
//             transform: translateY(-50px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

import React, { useState } from "react";

export default function BookingModal({
  isOpen,
  onClose,
  tour,
  bookingData,
  onBookingSuccess,
}) {
  const [currentStep, setCurrentStep] = useState("booking"); // 'booking', 'processing', 'payment', 'success', 'failed'
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

  // Payment simulation states
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

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

  const validatePaymentForm = () => {
    const newErrors = {};

    if (!cardNumber || cardNumber.length < 16) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = "Please enter expiry date (MM/YY)";
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }
    if (!cardName.trim()) {
      newErrors.cardName = "Please enter cardholder name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBooking = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setCurrentStep("processing");

    try {
      const fixedTour = getFixedTour();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

      // Simulate successful booking creation
      const newBooking = {
        _id: `booking_${Date.now()}`,
        ...bookingPayload,
        totalAmount: bookingData.totalAmount,
        status: "pending",
        createdAt: new Date(),
      };

      setBookingCreated(newBooking);
      setLoading(false);
      setCurrentStep("payment");
    } catch (error) {
      console.error("❌ Booking creation error:", error);
      setLoading(false);
      setCurrentStep("failed");
    }
  };

  const handlePayment = async () => {
    if (!validatePaymentForm()) return;

    setLoading(true);
    setPaymentProgress(0);

    // Simulate payment processing with progress
    const progressInterval = setInterval(() => {
      setPaymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 95% success rate for demo
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        setCurrentStep("success");
        if (onBookingSuccess) {
          onBookingSuccess({
            booking: bookingCreated,
            paymentStatus: "completed",
            transactionId: `TXN_${Date.now()}`,
          });
        }
      } else {
        setCurrentStep("failed");
      }
    } catch (error) {
      setCurrentStep("failed");
    } finally {
      setLoading(false);
      clearInterval(progressInterval);
    }
  };

  const handleClose = () => {
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
    setPaymentProgress(0);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardName("");
    onClose();
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
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

      case "payment":
        return (
          <div style={{ padding: "40px" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h2 style={{ color: "#1e7e34", marginBottom: "10px" }}>
                🇯🇲 Secure Payment
              </h2>
              <p style={{ color: "#666" }}>
                Complete your payment for {fixedTour?.title}
              </p>
            </div>

            {/* Booking Summary */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px",
              }}>
              <h4 style={{ marginBottom: "15px" }}>Booking Summary</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}>
                <span>Tour: {fixedTour?.title}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}>
                <span>Date: {selectedDate}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}>
                <span>
                  Guests: {bookingData.adults} Adults, {bookingData.youth}{" "}
                  Youth, {bookingData.children} Children
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid #dee2e6",
                  paddingTop: "10px",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1e7e34",
                }}>
                <span>
                  Total: JMD ${bookingData.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Form */}
            <div style={{ marginBottom: "30px" }}>
              <h4 style={{ marginBottom: "20px" }}>Payment Information</h4>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}>
                  Card Number *
                </label>
                <input
                  type='text'
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  placeholder='1234 5678 9012 3456'
                  maxLength='19'
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: errors.cardNumber
                      ? "1px solid #dc3545"
                      : "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                />
                {errors.cardNumber && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "13px",
                      marginTop: "5px",
                    }}>
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "15px",
                  marginBottom: "20px",
                }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Expiry *
                  </label>
                  <input
                    type='text'
                    value={expiryDate}
                    onChange={(e) =>
                      setExpiryDate(formatExpiryDate(e.target.value))
                    }
                    placeholder='MM/YY'
                    maxLength='5'
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: errors.expiryDate
                        ? "1px solid #dc3545"
                        : "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  />
                  {errors.expiryDate && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}>
                      {errors.expiryDate}
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
                    CVV *
                  </label>
                  <input
                    type='text'
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder='123'
                    maxLength='4'
                    style={{
                      width: "100%",
                      padding: "15px",
                      border: errors.cvv
                        ? "1px solid #dc3545"
                        : "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                  />
                  {errors.cvv && (
                    <p
                      style={{
                        color: "#dc3545",
                        fontSize: "13px",
                        marginTop: "5px",
                      }}>
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}>
                  Cardholder Name *
                </label>
                <input
                  type='text'
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder='John Doe'
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: errors.cardName
                      ? "1px solid #dc3545"
                      : "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                />
                {errors.cardName && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "13px",
                      marginTop: "5px",
                    }}>
                    {errors.cardName}
                  </p>
                )}
              </div>
            </div>

            {/* Progress Bar (when processing) */}
            {loading && (
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}>
                  <span style={{ fontSize: "14px" }}>
                    Processing Payment...
                  </span>
                  <span style={{ fontSize: "14px" }}>{paymentProgress}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#f3f3f3",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}>
                  <div
                    style={{
                      width: `${paymentProgress}%`,
                      height: "100%",
                      backgroundColor: "#1e7e34",
                      transition: "width 0.3s ease",
                    }}></div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "space-between",
              }}>
              <button
                onClick={() => setCurrentStep("booking")}
                style={{
                  padding: "15px 30px",
                  border: "1px solid #ddd",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                disabled={loading}>
                ← Back
              </button>

              <button
                onClick={handlePayment}
                style={{
                  padding: "15px 40px",
                  backgroundColor: loading ? "#ccc" : "#1e7e34",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
                disabled={loading}>
                {loading
                  ? "Processing..."
                  : `Pay JMD $${bookingData.totalAmount?.toLocaleString()}`}
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div style={{ textAlign: "center", padding: "60px 40px" }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
            <h3 style={{ marginBottom: "15px", color: "#1e7e34" }}>
              Booking Confirmed!
            </h3>
            <p style={{ color: "#666", marginBottom: "30px" }}>
              Your Jamaica tour has been successfully booked and paid for.
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
              We couldn't process your payment. Please check your card details
              and try again.
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
              }}>
              <button
                onClick={() => setCurrentStep("payment")}
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
            <form>
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
            </form>

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
                onClick={handleCreateBooking}
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
                {loading ? "Processing..." : "Continue to Payment"}
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
