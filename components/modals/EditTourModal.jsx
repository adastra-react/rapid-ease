"use client";

import { useState, useEffect } from "react";
import tourService from "@/app/store/services/tourService";

export default function EditTourModal({ tour, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    overview: "",
    description: "",
    duration: 1,
    groupSize: 0,
    languages: ["English"],
    ageRange: { min: 0, max: 99 },
    adultOnly: false,
    price: 0,
    fromPrice: 0,
    pricing: {
      basePrice: 0,
      adultPrice: 0,
      youthPrice: 0,
      childrenPrice: 0,
      servicePrice: 0,
    },
    imageSrc: "",
    highlights: [""],
    cancelPolicy: "",
    featured: false,
    badgeText: "",
    badgeClass: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (tour) {
      console.log("Tour object received:", tour); // Debug log
      setFormData({
        title: tour.title || "",
        location: tour.location || "",
        overview: tour.overview || "",
        description: tour.description || "",
        duration: tour.duration || 1,
        groupSize: tour.groupSize || 0,
        languages: tour.languages || ["English"],
        ageRange: tour.ageRange || { min: 0, max: 99 },
        adultOnly: tour.adultOnly || false,
        price: tour.price || 0,
        fromPrice: tour.fromPrice || 0,
        pricing: {
          basePrice: tour.pricing?.basePrice || 0,
          adultPrice: tour.pricing?.adultPrice || 0,
          youthPrice: tour.pricing?.youthPrice || 0,
          childrenPrice: tour.pricing?.childrenPrice || 0,
          servicePrice: tour.pricing?.servicePrice || 0,
        },
        imageSrc: tour.imageSrc || "",
        highlights: tour.highlights?.length > 0 ? tour.highlights : [""],
        cancelPolicy: tour.cancelPolicy || "",
        featured: tour.featured || false,
        badgeText: tour.badgeText || "",
        badgeClass: tour.badgeClass || "",
      });
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (index, value, arrayName) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ""],
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get tour ID - try multiple properties
      const tourId = tour._id || tour.id;

      console.log("Submitting tour update:", {
        tourId,
        formData,
      });

      if (!tourId) {
        throw new Error("Tour ID is missing. Cannot update tour.");
      }

      await tourService.updateTour(tourId, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating tour:", err);

      // Better error message based on error type
      if (err.response?.status === 404) {
        setError("Tour not found. The tour may have been deleted.");
      } else if (err.response?.status === 400) {
        setError("Invalid tour data. Please check all required fields.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update tour. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      location: "",
      overview: "",
      description: "",
      duration: 1,
      groupSize: 0,
      languages: ["English"],
      ageRange: { min: 0, max: 99 },
      adultOnly: false,
      price: 0,
      fromPrice: 0,
      pricing: {
        basePrice: 0,
        adultPrice: 0,
        youthPrice: 0,
        childrenPrice: 0,
        servicePrice: 0,
      },
      imageSrc: "",
      highlights: [""],
      cancelPolicy: "",
      featured: false,
      badgeText: "",
      badgeClass: "",
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = (hasError = false) => ({
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    border: hasError ? "1px solid #dc3545" : "1px solid #ddd",
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

  const tabStyle = (isActive) => ({
    padding: "12px 24px",
    background: "none",
    border: "none",
    borderBottom: isActive ? "2px solid #1e7e34" : "2px solid transparent",
    cursor: "pointer",
    fontWeight: isActive ? "600" : "500",
    color: isActive ? "#1e7e34" : "#666",
    transition: "all 0.2s",
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
        padding: "20px",
      }}
      onClick={handleClose}>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: "24px 30px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <h2
            style={{
              color: "#1e7e34",
              margin: 0,
              fontSize: "24px",
              fontWeight: "600",
            }}>
            Edit Tour
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
            }}>
            ×
          </button>
        </div>

        {/* Tour Info Badge */}
        {tour && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "12px 30px",
              borderBottom: "1px solid #e5e7eb",
              fontSize: "14px",
              color: "#15803d",
            }}>
            Editing: <strong>{tour.title}</strong> (ID: {tour._id || tour.id})
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "0 30px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
          }}>
          <button
            style={tabStyle(activeTab === "basic")}
            onClick={() => setActiveTab("basic")}>
            Basic Info
          </button>
          <button
            style={tabStyle(activeTab === "details")}
            onClick={() => setActiveTab("details")}>
            Details
          </button>
          <button
            style={tabStyle(activeTab === "pricing")}
            onClick={() => setActiveTab("pricing")}>
            Pricing
          </button>
          <button
            style={tabStyle(activeTab === "media")}
            onClick={() => setActiveTab("media")}>
            Media
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}>
          <div
            style={{
              padding: "30px",
              overflowY: "auto",
              flex: 1,
            }}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #fecaca",
                }}>
                {error}
              </div>
            )}

            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Title <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    style={inputStyle()}
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Location <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type='text'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    style={inputStyle()}
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Overview <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <textarea
                    name='overview'
                    value={formData.overview}
                    onChange={handleChange}
                    style={{
                      ...inputStyle(),
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    rows='3'
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Description <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    style={{
                      ...inputStyle(),
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    rows='5'
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Highlights
                  </label>
                  {formData.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                      }}>
                      <input
                        type='text'
                        value={highlight}
                        onChange={(e) =>
                          handleArrayChange(index, e.target.value, "highlights")
                        }
                        style={inputStyle()}
                        placeholder={`Highlight ${index + 1}`}
                      />
                      {formData.highlights.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeArrayItem(index, "highlights")}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type='button'
                    onClick={() => addArrayItem("highlights")}
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#1e7e34",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}>
                    + Add Highlight
                  </button>
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
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
                      Duration (days){" "}
                      <span style={{ color: "#dc3545" }}>*</span>
                    </label>
                    <input
                      type='number'
                      name='duration'
                      value={formData.duration}
                      onChange={handleChange}
                      style={inputStyle()}
                      min='1'
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Group Size
                    </label>
                    <input
                      type='number'
                      name='groupSize'
                      value={formData.groupSize}
                      onChange={handleChange}
                      style={inputStyle()}
                      min='0'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Min Age
                    </label>
                    <input
                      type='number'
                      value={formData.ageRange.min}
                      onChange={(e) =>
                        handleNestedChange("ageRange", "min", e.target.value)
                      }
                      style={inputStyle()}
                      min='0'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Max Age
                    </label>
                    <input
                      type='number'
                      value={formData.ageRange.max}
                      onChange={(e) =>
                        handleNestedChange("ageRange", "max", e.target.value)
                      }
                      style={inputStyle()}
                      min='0'
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}>
                    <input
                      type='checkbox'
                      name='adultOnly'
                      checked={formData.adultOnly}
                      onChange={handleChange}
                      style={{ marginRight: "10px" }}
                    />
                    <span>Adult Only (18+)</span>
                  </label>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}>
                    <input
                      type='checkbox'
                      name='featured'
                      checked={formData.featured}
                      onChange={handleChange}
                      style={{ marginRight: "10px" }}
                    />
                    <span>Featured Tour</span>
                  </label>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Cancellation Policy
                  </label>
                  <textarea
                    name='cancelPolicy'
                    value={formData.cancelPolicy}
                    onChange={handleChange}
                    style={{
                      ...inputStyle(),
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    rows='4'
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Badge Text
                    </label>
                    <input
                      type='text'
                      name='badgeText'
                      value={formData.badgeText}
                      onChange={handleChange}
                      style={inputStyle()}
                      placeholder='e.g., Popular, Best Seller'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Badge Class
                    </label>
                    <input
                      type='text'
                      name='badgeClass'
                      value={formData.badgeClass}
                      onChange={handleChange}
                      style={inputStyle()}
                      placeholder='e.g., badge-primary'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
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
                      Price <span style={{ color: "#dc3545" }}>*</span>
                    </label>
                    <input
                      type='number'
                      name='price'
                      value={formData.price}
                      onChange={handleChange}
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      From Price <span style={{ color: "#dc3545" }}>*</span>
                    </label>
                    <input
                      type='number'
                      name='fromPrice'
                      value={formData.fromPrice}
                      onChange={handleChange}
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                      required
                    />
                  </div>
                </div>

                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    marginTop: "20px",
                    marginBottom: "15px",
                  }}>
                  Detailed Pricing
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Base Price
                    </label>
                    <input
                      type='number'
                      value={formData.pricing.basePrice}
                      onChange={(e) =>
                        handleNestedChange(
                          "pricing",
                          "basePrice",
                          e.target.value
                        )
                      }
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Adult Price
                    </label>
                    <input
                      type='number'
                      value={formData.pricing.adultPrice}
                      onChange={(e) =>
                        handleNestedChange(
                          "pricing",
                          "adultPrice",
                          e.target.value
                        )
                      }
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Youth Price
                    </label>
                    <input
                      type='number'
                      value={formData.pricing.youthPrice}
                      onChange={(e) =>
                        handleNestedChange(
                          "pricing",
                          "youthPrice",
                          e.target.value
                        )
                      }
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Children Price
                    </label>
                    <input
                      type='number'
                      value={formData.pricing.childrenPrice}
                      onChange={(e) =>
                        handleNestedChange(
                          "pricing",
                          "childrenPrice",
                          e.target.value
                        )
                      }
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "500",
                      }}>
                      Service Price
                    </label>
                    <input
                      type='number'
                      value={formData.pricing.servicePrice}
                      onChange={(e) =>
                        handleNestedChange(
                          "pricing",
                          "servicePrice",
                          e.target.value
                        )
                      }
                      style={inputStyle()}
                      min='0'
                      step='0.01'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}>
                    Main Image URL <span style={{ color: "#dc3545" }}>*</span>
                  </label>
                  <input
                    type='text'
                    name='imageSrc'
                    value={formData.imageSrc}
                    onChange={handleChange}
                    style={inputStyle()}
                    required
                  />
                  {formData.imageSrc && (
                    <div style={{ marginTop: "15px" }}>
                      <img
                        src={formData.imageSrc}
                        alt='Preview'
                        style={{
                          maxWidth: "300px",
                          height: "auto",
                          borderRadius: "12px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              padding: "20px 30px",
              borderTop: "1px solid #e5e7eb",
            }}>
            <button
              type='button'
              onClick={handleClose}
              style={buttonStyle(false, loading)}
              disabled={loading}>
              Cancel
            </button>
            <button
              type='submit'
              onClick={handleSubmit}
              style={buttonStyle(true, loading)}
              disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
