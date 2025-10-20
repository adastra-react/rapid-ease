"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react"; // Add useEffect
import Image from "next/image";
import Map from "../pages/contact/Map";
import api from "../../app/store/services/api";

import ProtectedRoute from "../../components/auth/ProtectedRoute";

const tabs = ["Content", "Location", "Pricing", "Included"];

export default function AddTour() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Auto-hide success alert after 5 seconds
  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  // Image states - now supports up to 10 images
  const [images, setImages] = useState(Array(10).fill(""));

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token found:", !!token); // Debug log
    console.log("Token value:", token ? "EXISTS" : "MISSING"); // Debug log

    if (!token) {
      setMessage("Please log in to access this feature.");
      // Optionally redirect to login page
      // router.push('/login');
    } else {
      // Try to decode and check role
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token role:", decoded.role); // Debug log

        if (decoded.role !== "admin" && decoded.role !== "guide") {
          setMessage("Access denied. You need admin or guide permissions.");
        }
      } catch (error) {
        console.error("Token decode error:", error);
        setMessage("Invalid token. Please log in again.");
      }
    }
  }, []);

  // Helper function to check user role
  const checkUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Decode JWT token (basic decode - you might need jwt-decode library for more complex tokens)
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.role === "admin" || decoded.role === "guide";
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Form data state
  const [formData, setFormData] = useState({
    // Content tab fields
    title: "",
    category: "", // You might want to map this to a specific field in your model
    keywords: "", // You might want to use this for highlights array
    description: "",
    overview: "",

    // Location tab fields
    location: "", // This maps to the location field in your model
    city: "",
    state: "",
    address: "",
    zipCode: "",
    mapLatitude: "",
    mapLongitude: "",
    mapZoom: "15",

    // Pricing tab fields
    basePrice: "",
    extraServices: [{ name: "", description: "", price: "" }],

    // Included tab fields - these map to includedItems in your model
    includedItems: [
      {
        name: "Beverages, drinking water, morning tea and buffet lunch",
        included: false,
      },
      { name: "Local taxes", included: false },
      {
        name: "Hotel pickup and drop-off by air-conditioned minivan",
        included: false,
      },
      { name: "InsuranceTransfer to a private pier", included: false },
      { name: "Soft drinks", included: false },
      { name: "Tour Guide", included: false },
      { name: "Towel", included: false },
      { name: "Tips", included: false },
      { name: "Alcoholic Beverages", included: false },
    ],

    // Additional required fields based on your model
    duration: "1",
    groupSize: "10",
    languages: ["English"],
    rating: 0,
    bookingCount: "0",
    featured: false,
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested object changes (like mapLocation)
  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Handle extra services changes
  const handleExtraServiceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  // Add new extra service
  const addExtraService = () => {
    setFormData((prev) => ({
      ...prev,
      extraServices: [
        ...prev.extraServices,
        { name: "", description: "", price: "" },
      ],
    }));
  };

  // Remove extra service
  const removeExtraService = (index) => {
    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.filter((_, i) => i !== index),
    }));
  };

  // Handle included items checkbox changes
  const handleIncludedItemChange = (index, included) => {
    setFormData((prev) => ({
      ...prev,
      includedItems: prev.includedItems.map((item, i) =>
        i === index ? { ...item, included } : item
      ),
    }));
  };

  // Handle multiple image uploads
  const handleMultipleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Find available slots
    const currentImageCount = images.filter((img) => img).length;
    const availableSlots = 10 - currentImageCount;

    if (availableSlots === 0) {
      setMessage("Maximum 10 images allowed. Please remove some images first.");
      return;
    }

    // Limit files to available slots
    const filesToProcess = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      setMessage(
        `Only ${availableSlots} images were added. Maximum 10 images allowed.`
      );
    }

    // Process each file
    filesToProcess.forEach((file, fileIndex) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImages((prev) => {
          const newImages = [...prev];
          // Find first empty slot
          const emptySlotIndex = newImages.findIndex((img) => !img);
          if (emptySlotIndex !== -1) {
            newImages[emptySlotIndex] = reader.result;
          }
          return newImages;
        });
      };

      reader.readAsDataURL(file);
    });

    // Clear the input
    event.target.value = "";
  };

  // Handle single image upload for specific index
  const handleSingleImageChange = (event, index) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImages((prev) => {
          const newImages = [...prev];
          newImages[index] = reader.result;
          return newImages;
        });
      };

      reader.readAsDataURL(file);
    }
  };

  // Remove image at specific index
  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = "";
      return newImages;
    });
  };

  // Generate next tour ID (you might want to handle this differently)
  const generateTourId = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  // Prepare tour data for API
  const prepareTourData = () => {
    // Collect all images that are not empty
    const validImages = images
      .filter((img) => img && img !== "")
      .map((img, index) => ({
        url: img,
        alt: `${formData.title} image ${index + 1}`,
        width: 800,
        height: 600,
      }));

    // Parse keywords into highlights array
    const highlights = formData.keywords
      ? formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k)
      : [];

    // Build location string
    const location =
      [formData.city, formData.state].filter((l) => l).join(", ") ||
      formData.location;

    return {
      id: generateTourId(),
      title: formData.title,
      location: location,
      overview: formData.overview || formData.description,
      description: formData.description,
      duration: parseInt(formData.duration) || 1,
      groupSize: parseInt(formData.groupSize) || 10,
      languages: formData.languages,
      rating: formData.rating,
      ratingCount: 0,
      bookingCount: formData.bookingCount,
      pricing: {
        basePrice: parseFloat(formData.basePrice) || 0,
        adultPrice: parseFloat(formData.basePrice) || 0,
        youthPrice: parseFloat(formData.basePrice) * 0.8, // 20% discount
        childrenPrice: parseFloat(formData.basePrice) * 0.5, // 50% discount
        servicePrice: 0,
      },
      price: parseFloat(formData.basePrice) || 0,
      fromPrice: parseFloat(formData.basePrice) || 0,
      highlights: highlights,
      includedItems: formData.includedItems,
      imageSrc: validImages[0]?.url || "/img/tours/default.jpg",
      images: validImages,
      mapLocation: {
        latitude: parseFloat(formData.mapLatitude) || 0,
        longitude: parseFloat(formData.mapLongitude) || 0,
        zoom: parseInt(formData.mapZoom) || 15,
      },
      featured: formData.featured,
      badgeText: "",
      badgeClass: "",
      ageRange: {
        min: 0,
        max: 99,
      },
      cancelPolicy:
        "Free cancellation up to 24 hours before the activity starts",
      faqs: [],
      reviews: [],
      features: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Check authentication status
  const checkAuthStatus = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return !!token;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccessAlert(true);

    try {
      // TEMPORARILY COMMENTED OUT FOR TESTING - UNCOMMENT IN PRODUCTION
      // Check if user is authenticated
      // if (!checkAuthStatus()) {
      //   throw new Error("Please log in to create tours. You need admin or guide permissions.");
      // }

      // Check if user has the correct role
      // if (!checkUserRole()) {
      //   throw new Error("Access denied. You need admin or guide permissions to create tours.");
      // }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.basePrice) {
        throw new Error(
          "Please fill in all required fields (Title, Description, Price)"
        );
      }

      const tourData = prepareTourData();

      const response = await api.post("/tours", tourData);

      if (response.data.status === "success") {
        setMessage("Tour created successfully!");
        // Reset form or redirect
        setTimeout(() => {
          setTimeout(() => {
            resetForm();
          }, 1000);
          // You might want to redirect to tour list or tour details page
          // router.push('/dashboard/tours');
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating tour:", error);

      // Handle different types of errors
      let errorMessage = "Failed to create tour";

      if (error.response?.status === 401) {
        errorMessage =
          "Authentication required. Please log in with admin or guide permissions.";
      } else if (error.response?.status === 403) {
        errorMessage =
          "Access denied. You need admin or guide permissions to create tours.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProtectedRoute>
        {/* Success Alert Toast */}
        {showSuccessAlert && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 9999,
              animation: "slideInRight 0.5s ease-out",
            }}>
            <div
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "20px 30px",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                minWidth: "350px",
                maxWidth: "500px",
              }}>
              {/* Success Icon */}
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>

              {/* Message Content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "4px",
                  }}>
                  Tour Created Successfully!
                </div>
                <div style={{ fontSize: "14px", opacity: 0.9 }}>
                  Your tour "{formData.title}" has been added to the system.
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowSuccessAlert(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.8,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "1")}
                onMouseLeave={(e) => (e.target.style.opacity = "0.8")}>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M15 5L5 15M5 5L15 15'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: "0 0 12px 12px",
                overflow: "hidden",
              }}>
              <div
                style={{
                  height: "100%",
                  backgroundColor: "white",
                  animation: "progressBar 5s linear",
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        )}

        {/* Add CSS Animations */}
        <style jsx>{`
          @keyframes slideInRight {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes progressBar {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}</style>
        <div
          className={`dashboard ${
            sideBarOpen ? "-is-sidebar-visible" : ""
          } js-dashboard`}>
          <Sidebar setSideBarOpen={setSideBarOpen} />

          <div className='dashboard__content'>
            <Header setSideBarOpen={setSideBarOpen} />

            <div className='dashboard__content_content'>
              <h1 className='text-30'>Add Tour</h1>
              <p className=''>
                Create a new tour experience for your customers.
              </p>

              {message && (
                <div
                  className={`alert mt-20 p-20 rounded-12 ${
                    message.includes("success")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-60'>
                  <div className='tabs -underline-2 js-tabs'>
                    <div className='tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls'>
                      {tabs.map((elm, i) => (
                        <div
                          onClick={() => setActiveTab(elm)}
                          key={i}
                          className='col-auto'>
                          <button
                            type='button'
                            className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${
                              activeTab == elm ? "is-tab-el-active" : ""
                            }`}>
                            {i + 1}. {elm}
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className='row pt-40'>
                      <div className='col-xl-9 col-lg-10'>
                        <div className='tabs__content js-tabs-content'>
                          {/* CONTENT TAB */}
                          <div
                            className={`tabs__pane ${
                              activeTab == "Content" ? "is-tab-el-active" : ""
                            }`}>
                            <div className='contactForm row y-gap-30'>
                              <div className='col-12'>
                                <div className='form-input'>
                                  <input
                                    type='text'
                                    required
                                    value={formData.title}
                                    onChange={(e) =>
                                      handleInputChange("title", e.target.value)
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Tour Title *
                                  </label>
                                </div>
                              </div>

                              <div className='col-12'>
                                <div className='form-input'>
                                  <input
                                    type='text'
                                    value={formData.category}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "category",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Category
                                  </label>
                                </div>
                              </div>

                              <div className='col-12'>
                                <div className='form-input'>
                                  <input
                                    type='text'
                                    value={formData.keywords}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "keywords",
                                        e.target.value
                                      )
                                    }
                                    placeholder='Separate with commas'
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Keywords/Highlights
                                  </label>
                                </div>
                              </div>

                              <div className='col-12'>
                                <div className='form-input'>
                                  <textarea
                                    required
                                    rows='4'
                                    value={formData.overview}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "overview",
                                        e.target.value
                                      )
                                    }></textarea>
                                  <label className='lh-1 text-16 text-light-1'>
                                    Tour Overview *
                                  </label>
                                </div>
                              </div>

                              <div className='col-12'>
                                <div className='form-input'>
                                  <textarea
                                    required
                                    rows='8'
                                    value={formData.description}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "description",
                                        e.target.value
                                      )
                                    }></textarea>
                                  <label className='lh-1 text-16 text-light-1'>
                                    Tour Content *
                                  </label>
                                </div>
                              </div>

                              {/* Duration and Group Size */}
                              <div className='col-md-6'>
                                <div className='form-input'>
                                  <input
                                    type='number'
                                    min='1'
                                    value={formData.duration}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "duration",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Duration (days)
                                  </label>
                                </div>
                              </div>

                              <div className='col-md-6'>
                                <div className='form-input'>
                                  <input
                                    type='number'
                                    min='1'
                                    value={formData.groupSize}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "groupSize",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Max Group Size
                                  </label>
                                </div>
                              </div>

                              {/* Gallery Section - Grid Layout with Multiple Selection */}
                              <div className='col-12'>
                                <h4 className='text-18 fw-500 mb-20'>
                                  Gallery
                                </h4>

                                {/* Multiple Upload Button */}
                                <div className='mb-30'>
                                  <label
                                    htmlFor='multipleImageUpload'
                                    className='button -md -outline-accent-1 text-accent-1 cursor-pointer'>
                                    <i className='icon-add-button text-16 mr-10'></i>
                                    Select Multiple Images (Max 10)
                                  </label>
                                  <input
                                    id='multipleImageUpload'
                                    type='file'
                                    multiple
                                    accept='image/*'
                                    onChange={handleMultipleImageChange}
                                    style={{ display: "none" }}
                                  />
                                </div>

                                {/* Image Grid Display */}
                                {images.filter((img) => img).length > 0 && (
                                  <div className='row x-gap-15 y-gap-15 mb-20'>
                                    {images.map(
                                      (image, index) =>
                                        image && (
                                          <div
                                            key={index}
                                            className='col-xl-2 col-lg-3 col-md-4 col-sm-6'>
                                            <div
                                              className='relative group cursor-pointer'
                                              style={{ aspectRatio: "4/3" }}
                                              onMouseEnter={(e) => {
                                                const overlay =
                                                  e.currentTarget.querySelector(
                                                    ".hover-overlay"
                                                  );
                                                const buttons =
                                                  e.currentTarget.querySelectorAll(
                                                    ".hover-button"
                                                  );
                                                if (overlay)
                                                  overlay.style.opacity = "1";
                                                buttons.forEach(
                                                  (btn) =>
                                                    (btn.style.opacity = "1")
                                                );
                                              }}
                                              onMouseLeave={(e) => {
                                                const overlay =
                                                  e.currentTarget.querySelector(
                                                    ".hover-overlay"
                                                  );
                                                const buttons =
                                                  e.currentTarget.querySelectorAll(
                                                    ".hover-button"
                                                  );
                                                if (overlay)
                                                  overlay.style.opacity = "0";
                                                buttons.forEach(
                                                  (btn) =>
                                                    (btn.style.opacity = "0")
                                                );
                                              }}>
                                              <Image
                                                width={200}
                                                height={150}
                                                src={image}
                                                alt={`Gallery image ${
                                                  index + 1
                                                }`}
                                                className='w-100 h-100 rounded-8 object-cover'
                                                style={{
                                                  width: "100%",
                                                  height: "150px",
                                                  objectFit: "cover",
                                                }}
                                              />

                                              {/* Subtle hover overlay */}
                                              <div
                                                className='hover-overlay absolute inset-0 rounded-8 transition-all duration-300'
                                                style={{
                                                  backgroundColor:
                                                    "rgba(0,0,0,0.3)",
                                                  opacity: "0",
                                                }}></div>

                                              {/* Replace button - top left */}
                                              <label
                                                htmlFor={`replaceImage${index}`}
                                                className='hover-button absolute cursor-pointer d-flex items-center justify-center transition-all duration-200'
                                                title='Replace image'
                                                style={{
                                                  top: "8px",
                                                  left: "8px",
                                                  width: "32px",
                                                  height: "32px",
                                                  borderRadius: "6px",
                                                  backgroundColor:
                                                    "rgba(255,255,255,0.95)",
                                                  color: "#333",
                                                  boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.2)",
                                                  opacity: "0",
                                                }}
                                                onMouseEnter={(e) => {
                                                  e.target.style.backgroundColor =
                                                    "#ffffff";
                                                  e.target.style.transform =
                                                    "scale(1.05)";
                                                }}
                                                onMouseLeave={(e) => {
                                                  e.target.style.backgroundColor =
                                                    "rgba(255,255,255,0.95)";
                                                  e.target.style.transform =
                                                    "scale(1)";
                                                }}>
                                                <i className='icon-edit text-14'></i>
                                              </label>
                                              <input
                                                id={`replaceImage${index}`}
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) =>
                                                  handleSingleImageChange(
                                                    e,
                                                    index
                                                  )
                                                }
                                                style={{ display: "none" }}
                                              />

                                              {/* Delete button - top right */}
                                              <button
                                                type='button'
                                                onClick={() =>
                                                  removeImage(index)
                                                }
                                                className='hover-button absolute cursor-pointer d-flex items-center justify-center transition-all duration-200'
                                                title='Delete image'
                                                style={{
                                                  top: "8px",
                                                  right: "8px",
                                                  width: "32px",
                                                  height: "32px",
                                                  borderRadius: "6px",
                                                  backgroundColor:
                                                    "rgba(239,68,68,0.95)",
                                                  color: "white",
                                                  border: "none",
                                                  boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.2)",
                                                  opacity: "0",
                                                }}
                                                onMouseEnter={(e) => {
                                                  e.target.style.backgroundColor =
                                                    "#dc2626";
                                                  e.target.style.transform =
                                                    "scale(1.05)";
                                                }}
                                                onMouseLeave={(e) => {
                                                  e.target.style.backgroundColor =
                                                    "rgba(239,68,68,0.95)";
                                                  e.target.style.transform =
                                                    "scale(1)";
                                                }}>
                                                <i className='icon-delete text-14'></i>
                                              </button>
                                            </div>
                                          </div>
                                        )
                                    )}
                                  </div>
                                )}

                                {/* Upload Info and Actions */}
                                <div className='row items-center justify-between mt-20'>
                                  <div className='col-auto'>
                                    <div className='text-14 text-light-1'>
                                      PNG or JPG no bigger than 800px wide and
                                      tall.
                                    </div>
                                    <div className='text-14 fw-500 mt-5'>
                                      Images uploaded:{" "}
                                      <span className='text-accent-1'>
                                        {images.filter((img) => img).length}/10
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  {images.some((img) => img) && (
                                    <div className='col-auto d-flex gap-10'>
                                      {/* Add more images button */}
                                      {images.filter((img) => img).length <
                                        10 && (
                                        <label
                                          htmlFor='addMoreImages'
                                          className='button -sm -outline-accent-1 text-accent-1 cursor-pointer'>
                                          <i className='icon-add-button text-14 mr-5'></i>
                                          Add More
                                        </label>
                                      )}
                                      <input
                                        id='addMoreImages'
                                        type='file'
                                        multiple
                                        accept='image/*'
                                        onChange={handleMultipleImageChange}
                                        style={{ display: "none" }}
                                      />

                                      {/* Clear all button */}
                                      <button
                                        type='button'
                                        onClick={() =>
                                          setImages(Array(10).fill(""))
                                        }
                                        className='button -sm -outline-red-1 text-red-1'>
                                        <i className='icon-delete text-14 mr-5'></i>
                                        Clear All
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Empty State */}
                                {images.filter((img) => img).length === 0 && (
                                  <div className='text-center py-40 bg-light-1 rounded-12 border-dash-1'>
                                    <Image
                                      width='48'
                                      height='48'
                                      alt='upload'
                                      src={"/img/dashboard/upload.svg"}
                                      className='mx-auto mb-15'
                                    />
                                    <div className='text-16 fw-500 text-dark-1 mb-10'>
                                      No images uploaded yet
                                    </div>
                                    <div className='text-14 text-light-1 mb-20'>
                                      Click "Select Multiple Images" to add up
                                      to 10 images at once
                                    </div>
                                    <label
                                      htmlFor='emptyStateUpload'
                                      className='button -md -accent-1 text-white cursor-pointer'>
                                      <i className='icon-add-button text-16 mr-10'></i>
                                      Upload Images
                                    </label>
                                    <input
                                      id='emptyStateUpload'
                                      type='file'
                                      multiple
                                      accept='image/*'
                                      onChange={handleMultipleImageChange}
                                      style={{ display: "none" }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* LOCATION TAB */}
                          {/* <div
                          className={`tabs__pane ${
                            activeTab == "Location" ? "is-tab-el-active" : ""
                          }`}>
                          <div className='contactForm row y-gap-30'>
                            <div className='col-12'>
                              <div className='form-input'>
                                <input
                                  type='text'
                                  value={formData.city}
                                  onChange={(e) =>
                                    handleInputChange("city", e.target.value)
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  City
                                </label>
                              </div>
                            </div>

                            <div className='col-12'>
                              <div className='form-input'>
                                <input
                                  type='text'
                                  value={formData.state}
                                  onChange={(e) =>
                                    handleInputChange("state", e.target.value)
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  State
                                </label>
                              </div>
                            </div>

                            <div className='col-12'>
                              <div className='form-input'>
                                <input
                                  type='text'
                                  value={formData.address}
                                  onChange={(e) =>
                                    handleInputChange("address", e.target.value)
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  Address
                                </label>
                              </div>
                            </div>

                            <div className='col-12'>
                              <div className='form-input'>
                                <input
                                  type='text'
                                  value={formData.zipCode}
                                  onChange={(e) =>
                                    handleInputChange("zipCode", e.target.value)
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  Zip Code
                                </label>
                              </div>
                            </div>

                            <div className='col-lg-4'>
                              <div className='form-input'>
                                <input
                                  type='number'
                                  step='any'
                                  value={formData.mapLatitude}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "mapLatitude",
                                      e.target.value
                                    )
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  Map Latitude
                                </label>
                              </div>
                            </div>

                            <div className='col-lg-4'>
                              <div className='form-input'>
                                <input
                                  type='number'
                                  step='any'
                                  value={formData.mapLongitude}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "mapLongitude",
                                      e.target.value
                                    )
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  Map Longitude
                                </label>
                              </div>
                            </div>

                            <div className='col-lg-4'>
                              <div className='form-input'>
                                <input
                                  type='number'
                                  min='1'
                                  max='20'
                                  value={formData.mapZoom}
                                  onChange={(e) =>
                                    handleInputChange("mapZoom", e.target.value)
                                  }
                                />
                                <label className='lh-1 text-16 text-light-1'>
                                  Map Zoom
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className='map relative mt-30'>
                            <Map />
                          </div>
                        </div> */}
                          {/* LOCATION TAB - SIMPLIFIED */}
                          <div
                            className={`tabs__pane ${
                              activeTab == "Location" ? "is-tab-el-active" : ""
                            }`}>
                            <div className='contactForm row y-gap-30'>
                              <div className='col-md-6'>
                                <div className='form-input'>
                                  <input
                                    type='text'
                                    value={formData.country}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "country",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Country
                                  </label>
                                </div>
                              </div>

                              <div className='col-md-6'>
                                <div className='form-input'>
                                  <input
                                    type='text'
                                    value={formData.city}
                                    onChange={(e) =>
                                      handleInputChange("city", e.target.value)
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    City
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* PRICING TAB */}
                          <div
                            className={`tabs__pane ${
                              activeTab == "Pricing" ? "is-tab-el-active" : ""
                            }`}>
                            <div className='contactForm row y-gap-30'>
                              <div className='col-12'>
                                <div className='form-input'>
                                  <input
                                    type='number'
                                    step='0.01'
                                    min='0'
                                    required
                                    value={formData.basePrice}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "basePrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Tour Price (USD) *
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className='mt-30'>
                              <h3 className='text-18 fw-500 mb-20'>
                                Extra Services
                              </h3>

                              {formData.extraServices.map((service, index) => (
                                <div
                                  key={index}
                                  className='contactForm row y-gap-30 items-center mb-20'>
                                  <div className='col-lg-4'>
                                    <div className='form-input'>
                                      <input
                                        type='text'
                                        value={service.name}
                                        onChange={(e) =>
                                          handleExtraServiceChange(
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label className='lh-1 text-16 text-light-1'>
                                        Service Name
                                      </label>
                                    </div>
                                  </div>

                                  <div className='col-lg-4'>
                                    <div className='form-input'>
                                      <input
                                        type='text'
                                        value={service.description}
                                        onChange={(e) =>
                                          handleExtraServiceChange(
                                            index,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label className='lh-1 text-16 text-light-1'>
                                        Description
                                      </label>
                                    </div>
                                  </div>

                                  <div className='col-lg-4'>
                                    <div className='d-flex items-center'>
                                      <div className='form-input'>
                                        <input
                                          type='number'
                                          step='0.01'
                                          min='0'
                                          value={service.price}
                                          onChange={(e) =>
                                            handleExtraServiceChange(
                                              index,
                                              "price",
                                              e.target.value
                                            )
                                          }
                                        />
                                        <label className='lh-1 text-16 text-light-1'>
                                          Price (USD)
                                        </label>
                                      </div>

                                      {formData.extraServices.length > 1 && (
                                        <button
                                          type='button'
                                          onClick={() =>
                                            removeExtraService(index)
                                          }
                                          className='text-18 ml-20'>
                                          <i className='icon-delete'></i>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className='mt-30'>
                                <button
                                  type='button'
                                  onClick={addExtraService}
                                  className='button -md -outline-dark-1 bg-light-1'>
                                  <i className='icon-add-button text-16 mr-10'></i>
                                  Add Service
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* INCLUDED TAB */}
                          <div
                            className={`tabs__pane ${
                              activeTab == "Included" ? "is-tab-el-active" : ""
                            }`}>
                            <div className='row y-gap-20 justify-between'>
                              <div className='col-md-8'>
                                <div className='row y-gap-20'>
                                  {formData.includedItems
                                    .slice(0, 6)
                                    .map((item, index) => (
                                      <div key={index} className='col-12'>
                                        <div className='d-flex items-center'>
                                          <div className='form-checkbox'>
                                            <input
                                              type='checkbox'
                                              checked={item.included}
                                              onChange={(e) =>
                                                handleIncludedItemChange(
                                                  index,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                            <div className='form-checkbox__mark'>
                                              <div className='form-checkbox__icon'>
                                                <svg
                                                  width='10'
                                                  height='8'
                                                  viewBox='0 0 10 8'
                                                  fill='none'
                                                  xmlns='http://www.w3.org/2000/svg'>
                                                  <path
                                                    d='M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z'
                                                    fill='white'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='lh-16 ml-15'>
                                            {item.name}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              <div className='col-md-4'>
                                <div className='row y-gap-20'>
                                  {formData.includedItems
                                    .slice(6)
                                    .map((item, index) => (
                                      <div key={index + 6} className='col-12'>
                                        <div className='d-flex items-center'>
                                          <div className='form-checkbox'>
                                            <input
                                              type='checkbox'
                                              checked={item.included}
                                              onChange={(e) =>
                                                handleIncludedItemChange(
                                                  index + 6,
                                                  e.target.checked
                                                )
                                              }
                                            />
                                            <div className='form-checkbox__mark'>
                                              <div className='form-checkbox__icon'>
                                                <svg
                                                  width='10'
                                                  height='8'
                                                  viewBox='0 0 10 8'
                                                  fill='none'
                                                  xmlns='http://www.w3.org/2000/svg'>
                                                  <path
                                                    d='M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z'
                                                    fill='white'
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='lh-16 ml-15'>
                                            {item.name}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>

                            {/* Featured tour checkbox */}
                            <div className='row mt-30'>
                              <div className='col-12'>
                                <div className='d-flex items-center'>
                                  <div className='form-checkbox'>
                                    <input
                                      type='checkbox'
                                      checked={formData.featured}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "featured",
                                          e.target.checked
                                        )
                                      }
                                    />
                                    <div className='form-checkbox__mark'>
                                      <div className='form-checkbox__icon'>
                                        <svg
                                          width='10'
                                          height='8'
                                          viewBox='0 0 10 8'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'>
                                          <path
                                            d='M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z'
                                            fill='white'
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='lh-16 ml-15 fw-500'>
                                    Mark as Featured Tour
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className='text-center mt-30'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='button -md -dark-1 bg-accent-1 text-white'>
                    {loading ? "Creating Tour..." : "Create Tour"}
                    <i className='icon-arrow-top-right text-16 ml-10'></i>
                  </button>
                </div>
              </form>

              <div className='text-center pt-30'>
                © Copyright Rapid Eases {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
