import React, { useState, useEffect } from "react";
import bookingService from "@/app/store/services/bookingService";

export default function EditBookingModal({
  isOpen,
  onClose,
  booking,
  onBookingUpdated,
}) {
  const [formData, setFormData] = useState({
    // Customer info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",

    // Trip details
    tripType: "one-way",
    startDate: "",
    startTime: "",
    returnDate: "",
    returnTime: "",

    // Guest counts
    adults: 1,
    youth: 0,
    children: 0,

    // Status
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        firstName: booking.customerInfo?.firstName || "",
        lastName: booking.customerInfo?.lastName || "",
        email: booking.customerInfo?.email || "",
        phone: booking.customerInfo?.phone || "",
        specialRequests: booking.customerInfo?.specialRequests || "",

        tripType: booking.tripType || "one-way",
        startDate: booking.startDate
          ? new Date(booking.startDate).toISOString().split("T")[0]
          : "",
        startTime: booking.startTime || booking.selectedTime || "",
        returnDate: booking.returnDate
          ? new Date(booking.returnDate).toISOString().split("T")[0]
          : "",
        returnTime: booking.returnTime || "",

        adults: booking.adults || 1,
        youth: booking.youth || 0,
        children: booking.children || 0,

        status: booking.status || "pending",
      });
    }
  }, [booking]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone required";

    // Date validation
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.startTime) newErrors.startTime = "Start time required";

    // Round trip validation
    if (formData.tripType === "round-trip") {
      if (!formData.returnDate) newErrors.returnDate = "Return date required";
      if (!formData.returnTime) newErrors.returnTime = "Return time required";

      if (formData.startDate && formData.returnDate) {
        const startDate = new Date(formData.startDate);
        const returnDate = new Date(formData.returnDate);
        if (returnDate < startDate) {
          newErrors.returnDate = "Return date cannot be before start date";
        }
      }
    }

    // Guest validation
    const totalGuests = formData.adults + formData.youth + formData.children;
    if (totalGuests === 0) {
      newErrors.adults = "At least one guest required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const updateData = {
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        },
        tripType: formData.tripType,
        startDate: formData.startDate,
        startTime: formData.startTime,
        returnDate:
          formData.tripType === "round-trip" ? formData.returnDate : null,
        returnTime:
          formData.tripType === "round-trip" ? formData.returnTime : null,
        adults: formData.adults,
        youth: formData.youth,
        children: formData.children,
        status: formData.status,
      };

      await bookingService.updateBooking(booking._id, updateData);
      onBookingUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating booking:", error);
      setErrors({ submit: "Failed to update booking. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
      tripType: "one-way",
      startDate: "",
      startTime: "",
      returnDate: "",
      returnTime: "",
      adults: 1,
      youth: 0,
      children: 0,
      status: "pending",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

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
    opacity: disabled ? 0.6 : 1,
  });

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
          maxWidth: "700px",
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

        <h2 style={{ color: "#1e7e34", marginBottom: "20px" }}>Edit Booking</h2>

        {booking && (
          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "30px",
            }}>
            <h4>Tour: {booking.tourTitle}</h4>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
              Booking ID:{" "}
              {booking.bookingReference ||
                `#${booking._id.slice(-6).toUpperCase()}`}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Customer Information */}
          <h4 style={{ marginBottom: "15px" }}>Customer Information</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                First Name *
              </label>
              <input
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                style={inputStyle(errors.firstName)}
              />
              {errors.firstName && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Last Name *
              </label>
              <input
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                style={inputStyle(errors.lastName)}
              />
              {errors.lastName && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
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
              marginBottom: "20px",
            }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Email *
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={inputStyle(errors.email)}
              />
              {errors.email && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Phone *
              </label>
              <input
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={inputStyle(errors.phone)}
              />
              {errors.phone && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Trip Details */}
          <h4 style={{ marginBottom: "15px" }}>Trip Details</h4>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Trip Type
            </label>
            <select
              value={formData.tripType}
              onChange={(e) => handleInputChange("tripType", e.target.value)}
              style={inputStyle()}>
              <option value='one-way'>One Way</option>
              <option value='round-trip'>Round Trip</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Start Date *
              </label>
              <input
                type='date'
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                style={inputStyle(errors.startDate)}
              />
              {errors.startDate && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
                  {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Start Time *
              </label>
              <input
                type='time'
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                style={inputStyle(errors.startTime)}
              />
              {errors.startTime && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
                  {errors.startTime}
                </p>
              )}
            </div>
          </div>

          {formData.tripType === "round-trip" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "20px",
              }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Return Date *
                </label>
                <input
                  type='date'
                  value={formData.returnDate}
                  onChange={(e) =>
                    handleInputChange("returnDate", e.target.value)
                  }
                  style={inputStyle(errors.returnDate)}
                />
                {errors.returnDate && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}>
                    {errors.returnDate}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Return Time *
                </label>
                <input
                  type='time'
                  value={formData.returnTime}
                  onChange={(e) =>
                    handleInputChange("returnTime", e.target.value)
                  }
                  style={inputStyle(errors.returnTime)}
                />
                {errors.returnTime && (
                  <p
                    style={{
                      color: "#dc3545",
                      fontSize: "12px",
                      margin: "5px 0",
                    }}>
                    {errors.returnTime}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Guest Counts */}
          <h4 style={{ marginBottom: "15px" }}>Guests</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Adults *
              </label>
              <input
                type='number'
                min='0'
                value={formData.adults}
                onChange={(e) =>
                  handleInputChange("adults", parseInt(e.target.value) || 0)
                }
                style={inputStyle(errors.adults)}
              />
              {errors.adults && (
                <p
                  style={{
                    color: "#dc3545",
                    fontSize: "12px",
                    margin: "5px 0",
                  }}>
                  {errors.adults}
                </p>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Youth
              </label>
              <input
                type='number'
                min='0'
                value={formData.youth}
                onChange={(e) =>
                  handleInputChange("youth", parseInt(e.target.value) || 0)
                }
                style={inputStyle()}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Children
              </label>
              <input
                type='number'
                min='0'
                value={formData.children}
                onChange={(e) =>
                  handleInputChange("children", parseInt(e.target.value) || 0)
                }
                style={inputStyle()}
              />
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              style={inputStyle()}>
              <option value='pending'>Pending</option>
              <option value='confirmed'>Confirmed</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>

          {/* Special Requests */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Special Requests
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) =>
                handleInputChange("specialRequests", e.target.value)
              }
              rows='3'
              style={{
                ...inputStyle(),
                resize: "vertical",
                fontFamily: "inherit",
              }}
              placeholder='Any special requirements...'
            />
          </div>

          {errors.submit && (
            <p style={{ color: "#dc3545", marginBottom: "20px" }}>
              {errors.submit}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type='button'
              onClick={handleClose}
              style={buttonStyle()}
              disabled={loading}>
              Cancel
            </button>
            <button
              type='submit'
              style={buttonStyle(true, loading)}
              disabled={loading}>
              {loading ? "Updating..." : "Update Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
