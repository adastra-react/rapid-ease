"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import api from "../../app/store/services/api";

const tabs = ["Content", "Location", "Pricing", "Included"];

const createInitialFormData = () => ({
  title: "", category: "", keywords: "", description: "", overview: "",
  badgeText: "", badgeClass: "",
  location: "", city: "", state: "", address: "", zipCode: "", country: "Jamaica",
  mapLatitude: "", mapLongitude: "", mapZoom: "15",
  basePrice: "",
  extraServices: [{ name: "", description: "", price: "" }],
  includedItems: [
    { name: "Beverages, drinking water, morning tea and buffet lunch", included: false },
    { name: "Local taxes", included: false },
    { name: "Hotel pickup and drop-off by air-conditioned minivan", included: false },
    { name: "InsuranceTransfer to a private pier", included: false },
    { name: "Soft drinks", included: false },
    { name: "Tour Guide", included: false },
    { name: "Towel", included: false },
    { name: "Tips", included: false },
    { name: "Alcoholic Beverages", included: false },
  ],
  duration: "1", groupSize: "10", languages: ["English"],
  rating: 0, bookingCount: "0", featured: false,
});

export default function AddTourModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("Content");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [lastCreatedTourTitle, setLastCreatedTourTitle] = useState("");
  const [formData, setFormData] = useState(createInitialFormData);
  const [images, setImages] = useState(Array(10).fill(""));
  const titleInputRef = useRef(null);
  const scrollRef = useRef(null);

  const ratingValue = Math.min(5, Math.max(0, Number.parseFloat(formData.rating) || 0));

  const getInputWrapperClass = (value) =>
    `form-input${String(value ?? "").trim() ? " is-filled" : ""}`;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => titleInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const resetForm = () => {
    setFormData(createInitialFormData());
    setImages(Array(10).fill(""));
    setActiveTab("Content");
    setMessage("");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (field, value) => {
    if (showSuccessAlert) setShowSuccessAlert(false);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (value) => {
    if (value === "") { handleInputChange("rating", ""); return; }
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) return;
    handleInputChange("rating", Math.min(5, Math.max(0, parsed)).toString());
  };

  const handleExtraServiceChange = (index, field, value) => {
    if (showSuccessAlert) setShowSuccessAlert(false);
    setFormData(prev => ({
      ...prev,
      extraServices: prev.extraServices.map((s, i) => i === index ? { ...s, [field]: value } : s),
    }));
  };

  const addExtraService = () => {
    if (showSuccessAlert) setShowSuccessAlert(false);
    setFormData(prev => ({ ...prev, extraServices: [...prev.extraServices, { name: "", description: "", price: "" }] }));
  };

  const removeExtraService = (index) => {
    if (showSuccessAlert) setShowSuccessAlert(false);
    setFormData(prev => ({ ...prev, extraServices: prev.extraServices.filter((_, i) => i !== index) }));
  };

  const handleIncludedItemChange = (index, included) => {
    if (showSuccessAlert) setShowSuccessAlert(false);
    setFormData(prev => ({
      ...prev,
      includedItems: prev.includedItems.map((item, i) => i === index ? { ...item, included } : item),
    }));
  };

  const handleMultipleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    if (showSuccessAlert) setShowSuccessAlert(false);
    const available = 10 - images.filter(Boolean).length;
    if (available === 0) { setMessage("Maximum 10 images allowed."); return; }
    files.slice(0, available).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          const next = [...prev];
          const slot = next.findIndex(img => !img);
          if (slot !== -1) next[slot] = reader.result;
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  const handleSingleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;
    if (showSuccessAlert) setShowSuccessAlert(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prev => { const n = [...prev]; n[index] = reader.result; return n; });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    if (showSuccessAlert) setShowSuccessAlert(false);
    setImages(prev => { const n = [...prev]; n[index] = ""; return n; });
  };

  const prepareTourData = () => {
    const validImages = images.filter(Boolean).map((img, i) => ({
      url: img, alt: `${formData.title} image ${i + 1}`, width: 800, height: 600,
    }));
    const highlights = formData.keywords
      ? formData.keywords.split(",").map(k => k.trim()).filter(Boolean) : [];
    const location = [formData.city, formData.state].filter(Boolean).join(", ") || formData.location;
    return {
      id: Math.floor(Math.random() * 1000000) + 1,
      title: formData.title, location,
      overview: formData.overview || formData.description,
      description: formData.description,
      duration: parseInt(formData.duration) || 1,
      groupSize: parseInt(formData.groupSize) || 10,
      languages: formData.languages,
      rating: parseFloat(formData.rating) || (Math.random() < 0.5 ? 4 : 5),
      ratingCount: 0, bookingCount: formData.bookingCount,
      pricing: {
        basePrice: parseFloat(formData.basePrice) || 0,
        adultPrice: parseFloat(formData.basePrice) || 0,
        youthPrice: parseFloat(formData.basePrice) * 0.8,
        childrenPrice: parseFloat(formData.basePrice) * 0.5,
        servicePrice: 0,
      },
      price: parseFloat(formData.basePrice) || 0,
      fromPrice: parseFloat(formData.basePrice) || 0,
      highlights,
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
      ageRange: { min: 0, max: 99 },
      cancelPolicy: "Free cancellation up to 24 hours before the activity starts",
      faqs: [], reviews: [], features: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowSuccessAlert(false);
    try {
      if (!formData.title || !formData.description || !formData.basePrice) {
        throw new Error("Please fill in all required fields (Title, Description, Price)");
      }
      const tourData = prepareTourData();
      const response = await api.post("/tours", tourData);
      if (response.data.status === "success") {
        const title = formData.title.trim();
        setLastCreatedTourTitle(title);
        resetForm();
        setShowSuccessAlert(true);
        onSuccess?.(title);
      }
    } catch (error) {
      let msg = "Failed to create tour";
      if (error.response?.status === 401) msg = "Authentication required. Please log in.";
      else if (error.response?.status === 403) msg = "Access denied. Admin or guide permissions required.";
      else if (error.response?.data?.message) msg = error.response.data.message;
      else if (error.message) msg = error.message;
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setShowSuccessAlert(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes atModalIn {
          from { opacity: 0; transform: translateY(24px) scale(.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   }
        }
        @keyframes atBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(400px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .at-tab-nav {
          display: flex; gap: 6px;
          background: #f1f5f9; border-radius: 14px; padding: 5px;
          width: fit-content; flex-wrap: wrap;
        }
        .at-tab-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 10px; border: none;
          background: transparent; font-size: 14px; font-weight: 500;
          color: #64748b; cursor: pointer;
          transition: background .18s, color .18s, box-shadow .18s;
          white-space: nowrap;
        }
        .at-tab-btn:hover { color: #1f2557; background: rgba(255,255,255,.6); }
        .at-tab-btn.active {
          background: #ffffff; color: #1f2557; font-weight: 600;
          box-shadow: 0 2px 8px rgba(15,23,42,.1);
        }
        .at-tab-num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; border-radius: 6px;
          font-size: 11px; font-weight: 700;
          background: #e2e8f0; color: #64748b;
          transition: background .18s, color .18s;
        }
        .at-tab-btn.active .at-tab-num { background: #ea3c3c; color: #fff; }
        .rating-chip {
          display: inline-flex; align-items: center; gap: 8px;
          min-height: 40px; padding: 0 16px;
          border: 1.5px solid #e2e8f0; border-radius: 999px;
          background: #ffffff; color: #475569;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: border-color .18s, background .18s, color .18s, transform .18s;
        }
        .rating-chip:hover { border-color: #fca5a5; color: #dc2626; transform: translateY(-1px); }
        .rating-chip.is-active { border-color: #ef4444; background: #fff1f2; color: #b91c1c; font-weight: 600; }
        .rating-chip.is-clear:hover, .rating-chip.is-clear.is-active {
          border-color: #cbd5e1; background: #f8fafc; color: #475569;
        }
        .add-tour-helper-text { color: #64748b !important; }
        .at-modal-footer {
          position: sticky; bottom: 0;
          background: rgba(255,255,255,.94);
          backdrop-filter: blur(10px);
          border-top: 1px solid #e9edf5;
          padding: 14px 32px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          border-radius: 0 0 20px 20px;
          flex-shrink: 0;
        }
        .at-submit-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 28px; border-radius: 12px; border: none;
          background: linear-gradient(135deg,#ea3c3c 0%,#cf3434 100%);
          color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
          box-shadow: 0 6px 20px rgba(234,60,60,.28);
          transition: opacity .18s, transform .18s;
        }
        .at-submit-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .at-submit-btn:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,.55)",
          backdropFilter: "blur(6px)",
          animation: "atBackdropIn .25s ease both",
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1001,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px", pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%", maxWidth: 860,
            maxHeight: "92vh",
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 32px 80px rgba(15,23,42,.22)",
            display: "flex", flexDirection: "column",
            animation: "atModalIn .3s cubic-bezier(.22,1,.36,1) both",
            pointerEvents: "auto",
            overflow: "hidden",
          }}
        >
          {/* Modal header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 32px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ea3c3c", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
                Listed Tours
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1f2557" }}>
                Add New Tour
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1.5px solid #e9edf5", background: "#f8fafc",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#64748b", fontSize: 18, lineHeight: 1,
                transition: "background .15s",
              }}
            >
              ×
            </button>
          </div>

          {/* Scrollable form body */}
          <div ref={scrollRef} style={{ overflowY: "auto", flex: 1, padding: "28px 32px 0" }}>

            {/* Success toast */}
            {showSuccessAlert && (
              <div role="status" aria-live="polite" style={{ animation: "slideInRight .4s ease both", marginBottom: 24 }}>
                <div style={{
                  background: "#10b981", color: "#fff",
                  padding: "16px 20px", borderRadius: 12,
                  boxShadow: "0 8px 28px rgba(16,185,129,.28)",
                  display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{ background: "rgba(255,255,255,.2)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Tour saved!</div>
                    <div style={{ fontSize: 13, opacity: .9 }}>"{lastCreatedTourTitle}" was added. Form cleared — ready for the next one.</div>
                  </div>
                  <button type="button" onClick={() => setShowSuccessAlert(false)} style={{ background: "transparent", border: "none", color: "#fff", opacity: .8, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
                </div>
              </div>
            )}

            {/* Error message */}
            {message && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 14, marginBottom: 24 }}>
                <i className="icon-close-circle" style={{ fontSize: 16, flexShrink: 0 }}></i>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} id="add-tour-form">
              {/* Tab nav */}
              <div className="at-tab-nav" style={{ marginBottom: 28 }}>
                {tabs.map((elm, i) => (
                  <button key={elm} type="button" onClick={() => setActiveTab(elm)} className={`at-tab-btn${activeTab === elm ? " active" : ""}`}>
                    <span className="at-tab-num">{i + 1}</span>
                    {elm}
                  </button>
                ))}
              </div>

              {/* CONTENT TAB */}
              {activeTab === "Content" && (
                <div className="contactForm row y-gap-30">
                  <div className="col-12">
                    <div className={getInputWrapperClass(formData.title)}>
                      <input ref={titleInputRef} type="text" required placeholder=" " value={formData.title} onChange={e => handleInputChange("title", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Tour Title *</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={getInputWrapperClass(formData.category)}>
                      <input type="text" placeholder=" " value={formData.category} onChange={e => handleInputChange("category", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Category</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={getInputWrapperClass(formData.keywords)}>
                      <input type="text" placeholder=" " value={formData.keywords} onChange={e => handleInputChange("keywords", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Keywords / Highlights</label>
                    </div>
                    <div className="text-14 add-tour-helper-text mt-10">Separate keywords with commas.</div>
                  </div>

                  <div className="col-md-6">
                    <div className={getInputWrapperClass(formData.badgeText)}>
                      <input type="text" placeholder=" " value={formData.badgeText} onChange={e => handleInputChange("badgeText", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Badge Text</label>
                    </div>
                    <div className="text-14 add-tour-helper-text mt-10">Optional label on the listing card.</div>
                  </div>

                  <div className="col-md-6">
                    <div className={getInputWrapperClass(formData.badgeClass)}>
                      <input type="text" placeholder=" " value={formData.badgeClass} onChange={e => handleInputChange("badgeClass", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Badge Style Class</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={getInputWrapperClass(formData.overview)}>
                      <textarea required rows="4" placeholder=" " value={formData.overview} onChange={e => handleInputChange("overview", e.target.value)}></textarea>
                      <label className="lh-1 text-16 text-light-1">Tour Overview *</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={getInputWrapperClass(formData.description)}>
                      <textarea required rows="6" placeholder=" " value={formData.description} onChange={e => handleInputChange("description", e.target.value)}></textarea>
                      <label className="lh-1 text-16 text-light-1">Tour Content *</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={getInputWrapperClass(formData.duration)}>
                      <input type="number" min="1" placeholder=" " value={formData.duration} onChange={e => handleInputChange("duration", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Duration (days)</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className={getInputWrapperClass(formData.groupSize)}>
                      <input type="number" min="1" placeholder=" " value={formData.groupSize} onChange={e => handleInputChange("groupSize", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Max Group Size</label>
                    </div>
                  </div>

                  {/* Star rating */}
                  <div className="col-12">
                    <div className="rounded-12 border-light p-20">
                      <div className="text-16 fw-500 text-dark-1 mb-10">Star Rating</div>
                      <div className="row y-gap-20 items-end mt-10">
                        <div className="col-xl-8">
                          <div style={{ display:"flex", flexWrap:"wrap", gap:12, rowGap:12 }}>
                            {[1,2,3,4,5].map(n => (
                              <button key={n} type="button" className={`rating-chip${Math.round(ratingValue) === n ? " is-active" : ""}`} onClick={() => handleRatingChange(n)}>
                                <i className="icon-star text-14 text-yellow-2"></i>
                                <span className="fw-500">{n} Star{n > 1 ? "s" : ""}</span>
                              </button>
                            ))}
                            <button type="button" className={`rating-chip is-clear${ratingValue === 0 ? " is-active" : ""}`} onClick={() => handleRatingChange(0)}>No Stars Yet</button>
                          </div>
                        </div>
                        <div className="col-xl-4">
                          <div className={getInputWrapperClass(formData.rating)}>
                            <input type="number" min="0" max="5" step="0.1" placeholder=" " value={formData.rating} onChange={e => handleRatingChange(e.target.value)} />
                            <label className="lh-1 text-16 text-light-1">Manual Rating</label>
                          </div>
                          <div className="text-14 add-tour-helper-text mt-10">Current: {ratingValue.toFixed(1)}/5</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="col-12">
                    <h4 className="text-18 fw-500 mb-20">Gallery</h4>
                    <div className="mb-20">
                      <label htmlFor="atm-multi-upload" className="button -md -outline-accent-1 text-accent-1 cursor-pointer">
                        <i className="icon-add-button text-16 mr-10"></i>
                        Select Images (Max 10)
                      </label>
                      <input id="atm-multi-upload" type="file" multiple accept="image/*" onChange={handleMultipleImageChange} style={{ display: "none" }} />
                    </div>

                    {images.filter(Boolean).length > 0 && (
                      <div className="row x-gap-15 y-gap-15 mb-20">
                        {images.map((image, index) => image && (
                          <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                            <div className="relative" style={{ aspectRatio: "4/3" }}
                              onMouseEnter={e => { e.currentTarget.querySelectorAll(".atm-hover").forEach(el => el.style.opacity = "1"); }}
                              onMouseLeave={e => { e.currentTarget.querySelectorAll(".atm-hover").forEach(el => el.style.opacity = "0"); }}>
                              <Image width={200} height={150} src={image} alt={`Image ${index + 1}`} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: 8, display: "block" }} />
                              <div className="atm-hover" style={{ position: "absolute", inset: 0, borderRadius: 8, background: "rgba(0,0,0,.28)", opacity: 0, transition: "opacity .2s" }} />
                              <label htmlFor={`atm-replace-${index}`} className="atm-hover" title="Replace"
                                style={{ position: "absolute", top: 8, left: 8, width: 30, height: 30, borderRadius: 6, background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0, transition: "opacity .2s", color: "#333" }}>
                                <i className="icon-edit text-13"></i>
                              </label>
                              <input id={`atm-replace-${index}`} type="file" accept="image/*" onChange={e => handleSingleImageChange(e, index)} style={{ display: "none" }} />
                              <button type="button" className="atm-hover" onClick={() => removeImage(index)} title="Remove"
                                style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 6, background: "rgba(239,68,68,.92)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: 0, transition: "opacity .2s", color: "#fff" }}>
                                <i className="icon-delete text-13"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="d-flex items-center justify-between mt-10">
                      <div className="text-14 add-tour-helper-text">
                        Images uploaded: <span style={{ color: "#ea3c3c", fontWeight: 600 }}>{images.filter(Boolean).length}/10</span>
                      </div>
                      {images.some(Boolean) && (
                        <div className="d-flex gap-10">
                          {images.filter(Boolean).length < 10 && (
                            <label htmlFor="atm-add-more" className="button -sm -outline-accent-1 text-accent-1 cursor-pointer">
                              <i className="icon-add-button text-14 mr-5"></i>Add More
                            </label>
                          )}
                          <input id="atm-add-more" type="file" multiple accept="image/*" onChange={handleMultipleImageChange} style={{ display: "none" }} />
                          <button type="button" onClick={() => setImages(Array(10).fill(""))} className="button -sm -outline-red-1 text-red-1">
                            <i className="icon-delete text-14 mr-5"></i>Clear All
                          </button>
                        </div>
                      )}
                    </div>

                    {images.filter(Boolean).length === 0 && (
                      <div className="text-center py-40 bg-light-1 rounded-12 border-dash-1 mt-15">
                        <Image width={48} height={48} alt="upload" src="/img/dashboard/upload.svg" className="mx-auto mb-15" />
                        <div className="text-16 fw-500 text-dark-1 mb-10">No images yet</div>
                        <div className="text-14 add-tour-helper-text mb-20">Click "Select Images" above to add up to 10</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LOCATION TAB */}
              {activeTab === "Location" && (
                <div className="contactForm row y-gap-30">
                  <div className="col-md-6">
                    <div className={getInputWrapperClass(formData.country)}>
                      <input type="text" placeholder=" " value={formData.country} onChange={e => handleInputChange("country", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">Country</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={getInputWrapperClass(formData.city)}>
                      <input type="text" placeholder=" " value={formData.city} onChange={e => handleInputChange("city", e.target.value)} />
                      <label className="lh-1 text-16 text-light-1">City</label>
                    </div>
                  </div>
                </div>
              )}

              {/* PRICING TAB */}
              {activeTab === "Pricing" && (
                <div>
                  <div className="contactForm row y-gap-30">
                    <div className="col-12">
                      <div className={getInputWrapperClass(formData.basePrice)}>
                        <input type="number" step="0.01" min="0" required placeholder=" " value={formData.basePrice} onChange={e => handleInputChange("basePrice", e.target.value)} />
                        <label className="lh-1 text-16 text-light-1">Tour Price (USD) *</label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-30">
                    <h3 className="text-18 fw-500 mb-20">Extra Services</h3>
                    {formData.extraServices.map((service, index) => (
                      <div key={index} className="contactForm row y-gap-30 items-center mb-20">
                        <div className="col-lg-4">
                          <div className={getInputWrapperClass(service.name)}>
                            <input type="text" placeholder=" " value={service.name} onChange={e => handleExtraServiceChange(index, "name", e.target.value)} />
                            <label className="lh-1 text-16 text-light-1">Service Name</label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className={getInputWrapperClass(service.description)}>
                            <input type="text" placeholder=" " value={service.description} onChange={e => handleExtraServiceChange(index, "description", e.target.value)} />
                            <label className="lh-1 text-16 text-light-1">Description</label>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="d-flex items-center">
                            <div className={getInputWrapperClass(service.price)}>
                              <input type="number" step="0.01" min="0" placeholder=" " value={service.price} onChange={e => handleExtraServiceChange(index, "price", e.target.value)} />
                              <label className="lh-1 text-16 text-light-1">Price (USD)</label>
                            </div>
                            {formData.extraServices.length > 1 && (
                              <button type="button" onClick={() => removeExtraService(index)} className="text-18 ml-20"><i className="icon-delete"></i></button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addExtraService} className="button -md -outline-dark-1 bg-light-1 mt-10">
                      <i className="icon-add-button text-16 mr-10"></i>Add Service
                    </button>
                  </div>
                </div>
              )}

              {/* INCLUDED TAB */}
              {activeTab === "Included" && (
                <div>
                  <div className="row y-gap-20 justify-between">
                    <div className="col-md-8">
                      <div className="row y-gap-20">
                        {formData.includedItems.slice(0, 6).map((item, index) => (
                          <div key={index} className="col-12">
                            <div className="d-flex items-center">
                              <div className="form-checkbox">
                                <input type="checkbox" checked={item.included} onChange={e => handleIncludedItemChange(index, e.target.checked)} />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon">
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z" fill="white"/></svg>
                                  </div>
                                </div>
                              </div>
                              <div className="lh-16 ml-15">{item.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row y-gap-20">
                        {formData.includedItems.slice(6).map((item, index) => (
                          <div key={index + 6} className="col-12">
                            <div className="d-flex items-center">
                              <div className="form-checkbox">
                                <input type="checkbox" checked={item.included} onChange={e => handleIncludedItemChange(index + 6, e.target.checked)} />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon">
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z" fill="white"/></svg>
                                  </div>
                                </div>
                              </div>
                              <div className="lh-16 ml-15">{item.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-30">
                    <div className="col-12">
                      <div className="d-flex items-center">
                        <div className="form-checkbox">
                          <input type="checkbox" checked={formData.featured} onChange={e => handleInputChange("featured", e.target.checked)} />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon">
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z" fill="white"/></svg>
                            </div>
                          </div>
                        </div>
                        <div className="lh-16 ml-15 fw-500">Mark as Featured Tour</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* spacer so content clears the sticky footer */}
              <div style={{ height: 16 }} />
            </form>
          </div>

          {/* Sticky footer */}
          <div className="at-modal-footer">
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              Saves and resets form automatically.
            </p>
            <button type="submit" form="add-tour-form" disabled={loading} className="at-submit-btn">
              {loading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Saving…
                </>
              ) : (
                <>Create Tour <i className="icon-arrow-top-right" style={{ fontSize: 13 }}></i></>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
