"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Map from "../pages/contact/Map";
import api from "../../app/store/services/api";

import ProtectedRoute from "../../components/auth/ProtectedRoute";

const tabs = ["Content", "Location", "Pricing", "Included"];

const createInitialFormData = () => ({
  // Content tab fields
  title: "",
  category: "",
  keywords: "",
  description: "",
  overview: "",
  badgeText: "",
  badgeClass: "",

  // Location tab fields
  location: "",
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

  // Included tab fields
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

  duration: "1",
  groupSize: "10",
  languages: ["English"],
  rating: 0,
  bookingCount: "0",
  featured: false,
});

export default function AddTour() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [lastCreatedTourTitle, setLastCreatedTourTitle] = useState("");
  const titleInputRef = useRef(null);

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
  const [formData, setFormData] = useState(createInitialFormData);

  const getInputWrapperClass = (value) =>
    `form-input${String(value ?? "").trim() ? " is-filled" : ""}`;

  const ratingValue = Math.min(
    5,
    Math.max(0, Number.parseFloat(formData.rating) || 0)
  );

  const focusTitleField = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => {
        titleInputRef.current?.focus();
      }, 150);
    }
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
    setImages(Array(10).fill(""));
    setActiveTab("Content");
    setMessage("");
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRatingChange = (value) => {
    if (value === "") {
      handleInputChange("rating", "");
      return;
    }

    const parsedValue = Number.parseFloat(value);

    if (Number.isNaN(parsedValue)) {
      return;
    }

    const normalizedValue = Math.min(5, Math.max(0, parsedValue));
    handleInputChange("rating", normalizedValue.toString());
  };

  // Handle nested object changes (like mapLocation)
  const handleNestedChange = (parent, field, value) => {
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

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
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  // Add new extra service
  const addExtraService = () => {
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

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
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.filter((_, i) => i !== index),
    }));
  };

  // Handle included items checkbox changes
  const handleIncludedItemChange = (index, included) => {
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

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

    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

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
      if (showSuccessAlert) {
        setShowSuccessAlert(false);
      }

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
    if (showSuccessAlert) {
      setShowSuccessAlert(false);
    }

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
      rating: parseFloat(formData.rating) || 0,
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
      badgeText: formData.badgeText.trim(),
      badgeClass: formData.badgeClass.trim(),
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
    setMessage("");
    setShowSuccessAlert(false);

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
        const createdTourTitle = formData.title.trim();
        setLastCreatedTourTitle(createdTourTitle);
        resetForm();
        setShowSuccessAlert(true);
        focusTitleField();
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
            role='status'
            aria-live='polite'
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
                maxWidth: "560px",
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
                  Tour saved. Ready for the next one.
                </div>
                <div style={{ fontSize: "14px", opacity: 0.9 }}>
                  "{lastCreatedTourTitle || "Your new tour"}" was added
                  successfully. The form has been cleared and the cursor is
                  back in Tour Title.
                </div>
                <button
                  type='button'
                  onClick={focusTitleField}
                  style={{
                    marginTop: "12px",
                    backgroundColor: "white",
                    color: "#047857",
                    border: "none",
                    borderRadius: "999px",
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}>
                  Add another tour
                </button>
              </div>

              {/* Close Button */}
              <button
                type='button'
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

          </div>
        )}

        <style jsx>{`
          @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to   { transform: translateX(0);     opacity: 1; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          .add-tour-page { color: #1f2937; }
          .add-tour-page :global(.contactForm .form-input label) { color: #334155 !important; }
          .add-tour-helper-text { color: #64748b !important; }

          /* ── Tab pill nav ── */
          .at-tab-nav {
            display: flex;
            gap: 6px;
            background: #f1f5f9;
            border-radius: 14px;
            padding: 5px;
            width: fit-content;
          }
          .at-tab-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 20px;
            border-radius: 10px;
            border: none;
            background: transparent;
            font-size: 14px;
            font-weight: 500;
            color: #64748b;
            cursor: pointer;
            transition: background .18s, color .18s, box-shadow .18s;
            white-space: nowrap;
          }
          .at-tab-btn:hover { color: #1f2557; background: rgba(255,255,255,.6); }
          .at-tab-btn.active {
            background: #ffffff;
            color: #1f2557;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(15,23,42,.1);
          }
          .at-tab-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            background: #e2e8f0;
            color: #64748b;
            transition: background .18s, color .18s;
          }
          .at-tab-btn.active .at-tab-num {
            background: #ea3c3c;
            color: #fff;
          }

          /* ── Section labels inside form card ── */
          .at-section-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f1f5f9;
          }

          /* ── Rating chips ── */
          .rating-chip {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 40px;
            padding: 0 16px;
            border: 1.5px solid #e2e8f0;
            border-radius: 999px;
            background: #ffffff;
            color: #475569;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: border-color .18s, background .18s, color .18s, transform .18s;
          }
          .rating-chip:hover { border-color: #fca5a5; color: #dc2626; transform: translateY(-1px); }
          .rating-chip.is-active { border-color: #ef4444; background: #fff1f2; color: #b91c1c; font-weight: 600; }
          .rating-chip.is-clear:hover, .rating-chip.is-clear.is-active {
            border-color: #cbd5e1; background: #f8fafc; color: #475569;
          }

          /* ── Submit footer ── */
          .at-submit-footer {
            position: sticky;
            bottom: 0;
            background: rgba(255,255,255,.92);
            backdrop-filter: blur(12px);
            border-top: 1px solid #e9edf5;
            padding: 16px 40px;
            margin: 0 -40px -30px;
            border-radius: 0 0 20px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            z-index: 10;
          }
          .at-submit-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 13px 32px;
            border-radius: 12px;
            border: none;
            background: linear-gradient(135deg, #ea3c3c 0%, #cf3434 100%);
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(234,60,60,.28);
            transition: opacity .18s, transform .18s;
          }
          .at-submit-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
          .at-submit-btn:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
        `}</style>
        <div
          className={`add-tour-page dashboard ${
            sideBarOpen ? "-is-sidebar-visible" : ""
          } js-dashboard`}>
          <Sidebar setSideBarOpen={setSideBarOpen} />

          <div className='dashboard__content'>
            <Header setSideBarOpen={setSideBarOpen} />

            <div className='dashboard__content_content'>

              {/* Page header */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap", marginBottom:32 }}>
                <div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:12, fontWeight:600, color:"#ea3c3c", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>
                    <i className='icon-add-button' style={{ fontSize:14 }}></i>
                    Dashboard
                  </div>
                  <h1 style={{ fontSize:28, fontWeight:800, color:"#1f2557", margin:"0 0 6px", letterSpacing:"-0.4px" }}>
                    Add New Tour
                  </h1>
                  <p style={{ fontSize:14, color:"#64748b", margin:0, lineHeight:1.6 }}>
                    Fill in the details across all tabs, then hit <strong>Create Tour</strong>. The form resets automatically so you can add the next one straight away.
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:999, background:"#f8fafc", border:"1px solid #e9edf5", fontSize:13, color:"#64748b", fontWeight:500, whiteSpace:"nowrap" }}>
                  <i className='icon-info' style={{ fontSize:14 }}></i>
                  {images.filter(i => i).length}/10 images
                </div>
              </div>

              {message && (
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderRadius:12, background:"#fff1f2", border:"1px solid #fecaca", color:"#b91c1c", fontSize:14, marginBottom:24 }}>
                  <i className='icon-close-circle' style={{ fontSize:18, flexShrink:0 }}></i>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ background:"#fff", borderRadius:20, boxShadow:"0 4px 24px rgba(15,23,42,.07)", border:"1px solid #e9edf5", padding:"32px 40px 30px", marginTop:8 }}>

                  {/* Pill tab nav */}
                  <div className='at-tab-nav' style={{ marginBottom:32 }}>
                    {tabs.map((elm, i) => (
                      <button
                        key={elm}
                        type='button'
                        onClick={() => setActiveTab(elm)}
                        className={`at-tab-btn ${activeTab === elm ? "active" : ""}`}>
                        <span className='at-tab-num'>{i + 1}</span>
                        {elm}
                      </button>
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
                                <div className={getInputWrapperClass(formData.title)}>
                                  <input
                                    ref={titleInputRef}
                                    type='text'
                                    required
                                    placeholder=' '
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.category
                                  )}>
                                  <input
                                    type='text'
                                    placeholder=' '
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.keywords
                                  )}>
                                  <input
                                    type='text'
                                    value={formData.keywords}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "keywords",
                                        e.target.value
                                      )
                                    }
                                    placeholder=' '
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Keywords/Highlights
                                  </label>
                                </div>
                                <div className='text-14 add-tour-helper-text mt-10'>
                                  Separate keywords with commas.
                                </div>
                              </div>

                              <div className='col-md-6'>
                                <div
                                  className={getInputWrapperClass(
                                    formData.badgeText
                                  )}>
                                  <input
                                    type='text'
                                    value={formData.badgeText}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "badgeText",
                                        e.target.value
                                      )
                                    }
                                    placeholder=' '
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Badge Text
                                  </label>
                                </div>
                                <div className='text-14 add-tour-helper-text mt-10'>
                                  Optional label shown on the listing card.
                                </div>
                              </div>

                              <div className='col-md-6'>
                                <div
                                  className={getInputWrapperClass(
                                    formData.badgeClass
                                  )}>
                                  <input
                                    type='text'
                                    value={formData.badgeClass}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "badgeClass",
                                        e.target.value
                                      )
                                    }
                                    placeholder=' '
                                  />
                                  <label className='lh-1 text-16 text-light-1'>
                                    Badge Style Class
                                  </label>
                                </div>
                                <div className='text-14 add-tour-helper-text mt-10'>
                                  Optional class name if you want a custom badge style.
                                </div>
                              </div>

                              <div className='col-12'>
                                <div
                                  className={getInputWrapperClass(
                                    formData.overview
                                  )}>
                                  <textarea
                                    required
                                    rows='4'
                                    placeholder=' '
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.description
                                  )}>
                                  <textarea
                                    required
                                    rows='8'
                                    placeholder=' '
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.duration
                                  )}>
                                  <input
                                    type='number'
                                    min='1'
                                    placeholder=' '
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.groupSize
                                  )}>
                                  <input
                                    type='number'
                                    min='1'
                                    placeholder=' '
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

                              <div className='col-12'>
                                <div className='rounded-12 border-light p-20'>
                                  <div className='text-18 fw-500 text-dark-1'>
                                    Star Rating
                                  </div>
                                  <div className='text-14 add-tour-helper-text mt-10'>
                                    Click a star level or type a number from 0
                                    to 5. This controls the rating shown on the
                                    tour card.
                                  </div>

                                  <div className='row y-gap-20 items-end mt-20'>
                                    <div className='col-xl-8'>
                                      <div className='d-flex flex-wrap gap-10'>
                                        {Array.from({ length: 5 }, (_, index) => {
                                          const starCount = index + 1;
                                          const isActive =
                                            Math.round(ratingValue) ===
                                            starCount;

                                          return (
                                            <button
                                              key={starCount}
                                              type='button'
                                              className={`rating-chip ${
                                                isActive ? "is-active" : ""
                                              }`}
                                              onClick={() =>
                                                handleRatingChange(starCount)
                                              }>
                                              <i className='icon-star text-14 text-yellow-2'></i>
                                              <span className='fw-500'>
                                                {starCount} Star
                                                {starCount > 1 ? "s" : ""}
                                              </span>
                                            </button>
                                          );
                                        })}

                                        <button
                                          type='button'
                                          className={`rating-chip is-clear ${
                                            ratingValue === 0 ? "is-active" : ""
                                          }`}
                                          onClick={() => handleRatingChange(0)}>
                                          No Stars Yet
                                        </button>
                                      </div>
                                    </div>

                                    <div className='col-xl-4'>
                                      <div
                                        className={getInputWrapperClass(
                                          formData.rating
                                        )}>
                                        <input
                                          type='number'
                                          min='0'
                                          max='5'
                                          step='0.1'
                                          placeholder=' '
                                          value={formData.rating}
                                          onChange={(e) =>
                                            handleRatingChange(e.target.value)
                                          }
                                        />
                                        <label className='lh-1 text-16 text-light-1'>
                                          Manual Star Rating
                                        </label>
                                      </div>
                                      <div className='text-14 add-tour-helper-text mt-10'>
                                        Current rating: {ratingValue.toFixed(1)}
                                        /5
                                      </div>
                                    </div>
                                  </div>
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
                                    <div className='text-14 add-tour-helper-text'>
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
                                    <div className='text-14 add-tour-helper-text mb-20'>
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.country
                                  )}>
                                  <input
                                    type='text'
                                    placeholder=' '
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
                                <div className={getInputWrapperClass(formData.city)}>
                                  <input
                                    type='text'
                                    placeholder=' '
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
                                <div
                                  className={getInputWrapperClass(
                                    formData.basePrice
                                  )}>
                                  <input
                                    type='number'
                                    step='0.01'
                                    min='0'
                                    required
                                    placeholder=' '
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
                                    <div
                                      className={getInputWrapperClass(
                                        service.name
                                      )}>
                                      <input
                                        type='text'
                                        placeholder=' '
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
                                    <div
                                      className={getInputWrapperClass(
                                        service.description
                                      )}>
                                      <input
                                        type='text'
                                        placeholder=' '
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
                                      <div
                                        className={getInputWrapperClass(
                                          service.price
                                        )}>
                                        <input
                                          type='number'
                                          step='0.01'
                                          min='0'
                                          placeholder=' '
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

                  {/* Sticky submit footer */}
                  <div className='at-submit-footer'>
                    <p style={{ fontSize:13, color:"#94a3b8", margin:0 }}>
                      Saves and resets the form automatically.
                    </p>
                    <button type='submit' disabled={loading} className='at-submit-btn'>
                      {loading ? (
                        <>
                          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' style={{ animation:"spin 1s linear infinite" }}>
                            <circle cx='8' cy='8' r='6' stroke='rgba(255,255,255,.3)' strokeWidth='2'/>
                            <path d='M8 2a6 6 0 0 1 6 6' stroke='#fff' strokeWidth='2' strokeLinecap='round'/>
                          </svg>
                          Saving…
                        </>
                      ) : (
                        <>
                          Create Tour
                          <i className='icon-arrow-top-right' style={{ fontSize:14 }}></i>
                        </>
                      )}
                    </button>
                  </div>
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
