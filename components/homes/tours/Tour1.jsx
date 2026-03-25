"use client";

import Stars from "@/components/common/Stars";
import PriceText from "@/components/common/PriceText";
import tourService from "../../../app/store/services/tourService";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Tour1() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await tourService.getAllTours();

        console.log("API Response:", response);

        let toursData = [];

        if (Array.isArray(response)) {
          toursData = response;
        } else if (response.data && Array.isArray(response.data)) {
          toursData = response.data;
        } else if (response.tours && Array.isArray(response.tours)) {
          toursData = response.tours;
        } else if (
          response.data &&
          response.data.tours &&
          Array.isArray(response.data.tours)
        ) {
          toursData = response.data.tours;
        } else {
          console.warn("Unexpected API response structure:", response);
          toursData = [];
        }

        setTours(toursData.slice(0, 8));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tours:", err);
        setError("Failed to load tours");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const getImageUrl = (tour) => {
    if (tour.imageSrc) return tour.imageSrc;
    if (tour.imageCover) return tour.imageCover;
    if (tour.images && tour.images.length > 0) return tour.images[0];
    if (tour.image) return tour.image;
    if (tour.photo) return tour.photo;
    return "/img/placeholder-tour.jpg";
  };

  if (loading) {
    return (
      <section className="layout-pt-xl layout-pb-xl">
        <div className="container">
          <div className="row justify-center">
            <div className="col-auto">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#888" }}>
                Loading tours...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="layout-pt-xl layout-pb-xl">
        <div className="container">
          <div className="row justify-center">
            <div className="col-auto">
              <div className="text-center text-red-1">{error}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="layout-pt-xl layout-pb-xl">
      <div className="container">
        {/* Section header */}
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2
              data-aos="fade-right"
              data-aos-delay=""
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0f1117",
                letterSpacing: "-0.02em",
              }}
            >
              Find Popular airport dropoff locations
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href="/tour-list-1"
              data-aos="fade-left"
              data-aos-delay=""
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-accent-1, #e63946)",
                textDecoration: "none",
              }}
            >
              <span>See all</span>
              <i className="icon-arrow-top-right" style={{ fontSize: "13px" }} />
            </Link>
          </div>
        </div>

        {/* Cards grid */}
        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-30 justify-between pt-40 sm:pt-20 mobile-css-slider -w-300"
        >
          {Array.isArray(tours) && tours.length > 0 ? (
            tours.map((tour, i) => {
              const cardKey = tour.id || i;
              const isHovered = hoveredId === cardKey;

              return (
                <div key={cardKey} className="col-lg-3 col-md-6">
                  <Link
                    href={`/tour-single-1/${tour.id}`}
                    onMouseEnter={() => setHoveredId(cardKey)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      borderRadius: "18px",
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.07)",
                      overflow: "hidden",
                      textDecoration: "none",
                      boxShadow: isHovered
                        ? "0 20px 52px rgba(0,0,0,0.15)"
                        : "0 2px 14px rgba(0,0,0,0.07)",
                      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    {/* ── Image block ── */}
                    <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3" }}>
                      <Image
                        width={421}
                        height={316}
                        src={getImageUrl(tour)}
                        alt={tour.title || "Tour image"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: isHovered ? "scale(1.08)" : "scale(1)",
                          transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.src = "/img/placeholder-tour.jpg";
                        }}
                      />

                      {/* Gradient overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(8,10,38,0.75) 0%, rgba(8,10,38,0.12) 52%, transparent 100%)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Location badge — bottom left of image */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "13px",
                          left: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "rgba(255,255,255,0.92)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        <i className="icon-pin" style={{ fontSize: "13px" }} />
                        {tour.location || "Location not specified"}
                      </div>

                      {/* Glassmorphism heart button */}
                      <button
                        onClick={(e) => e.preventDefault()}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.88)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#555",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                          zIndex: 2,
                        }}
                      >
                        <i className="icon-heart" style={{ fontSize: "13px" }} />
                      </button>
                    </div>

                    {/* ── Text content ── */}
                    <div
                      style={{
                        padding: "14px 16px 15px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        gap: "7px",
                      }}
                    >
                      {/* Title */}
                      <h3
                        style={{
                          fontSize: "14.5px",
                          fontWeight: 700,
                          lineHeight: 1.42,
                          color: isHovered ? "var(--color-accent-1, #e63946)" : "#0f1117",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          transition: "color 0.25s ease",
                        }}
                      >
                        {tour.title}
                      </h3>

                      {/* Stars + rating count */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ display: "flex", gap: "2px" }}>
                          <Stars star={tour.rating || 5} />
                        </div>
                        <span style={{ fontSize: "12px", color: "#a0a0a8", lineHeight: 1 }}>
                          {tour.rating || 5} ({tour.ratingCount || 0})
                        </span>
                      </div>

                      {/* Duration + price footer */}
                      <div
                        style={{
                          marginTop: "auto",
                          paddingTop: "11px",
                          borderTop: "1px solid rgba(0,0,0,0.07)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "12px",
                            color: "#a0a0a8",
                          }}
                        >
                          <i className="icon-clock" style={{ fontSize: "13px" }} />
                          {tour.duration || "N/A"}
                        </div>

                        <div>
                          <span style={{ fontSize: "11px", color: "#a0a0a8" }}>From </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: "#0f1117",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            <PriceText
                              className=""
                              amount={tour?.price || tour?.pricing?.basePrice || 0}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center">
              <p>No tours available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
