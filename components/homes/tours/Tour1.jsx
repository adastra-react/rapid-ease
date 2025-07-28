"use client";

import Stars from "@/components/common/Stars";
import tourService from "../../../app/store/services/tourService";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Tour1() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await tourService.getAllTours();

        // Debug: Log the response to see the structure
        console.log("API Response:", response);

        // Handle different possible response structures
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

        // Limit to 8 tours for the popular tours section
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

  // Helper function to get image URL - adjust based on your API response structure
  const getImageUrl = (tour) => {
    // Based on your schema, the image is in imageSrc field
    if (tour.imageSrc) return tour.imageSrc;
    if (tour.imageCover) return tour.imageCover;
    if (tour.images && tour.images.length > 0) return tour.images[0];
    if (tour.image) return tour.image;
    if (tour.photo) return tour.photo;

    // Fallback to a placeholder image
    return "/img/placeholder-tour.jpg";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string") return parseFloat(price) || 0;
    return 0;
  };

  if (loading) {
    return (
      <section className='layout-pt-xl layout-pb-xl'>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-auto'>
              <div className='text-center'>Loading tours...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='layout-pt-xl layout-pb-xl'>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-auto'>
              <div className='text-center text-red-1'>{error}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='layout-pt-xl layout-pb-xl'>
      <div className='container'>
        <div className='row justify-between items-end y-gap-10'>
          <div className='col-auto'>
            <h2
              data-aos='fade-right'
              data-aos-delay=''
              className='text-30 md:text-24'>
              Find Popular airport dropoff locations
            </h2>
          </div>

          <div className='col-auto'>
            <Link
              href={"/tour-list-1"}
              data-aos='fade-left'
              data-aos-delay=''
              className='buttonArrow d-flex items-center '>
              <span>See all</span>
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </Link>
          </div>
        </div>

        <div
          data-aos='fade-up'
          data-aos-delay=''
          className='row y-gap-30 justify-between pt-40 sm:pt-20 mobile-css-slider -w-300'>
          {Array.isArray(tours) && tours.length > 0 ? (
            tours.map((tour, i) => (
              <div key={tour.id || i} className='col-lg-3 col-md-6'>
                <Link
                  href={`/tour-single-1/${tour.id}`}
                  className='tourCard -type-1 py-10 px-10 border-1 rounded-12  -hover-shadow'>
                  <div className='tourCard__header'>
                    <div className='tourCard__image ratio ratio-28:20'>
                      <Image
                        width={421}
                        height={301}
                        src={getImageUrl(tour)}
                        alt={tour.title || "Tour image"}
                        className='img-ratio rounded-12'
                        onError={(e) => {
                          e.target.src = "/img/placeholder-tour.jpg";
                        }}
                      />
                    </div>

                    <button className='tourCard__favorite'>
                      <i className='icon-heart'></i>
                    </button>
                  </div>

                  <div className='tourCard__content px-10 pt-10'>
                    <div className='tourCard__location d-flex items-center text-13 text-light-2'>
                      <i className='icon-pin d-flex text-16 text-light-2 mr-5'></i>
                      {tour.location || "Location not specified"}
                    </div>

                    <h3 className='tourCard__title text-16 fw-500 mt-5'>
                      <span>{tour.title}</span>
                    </h3>

                    <div className='tourCard__rating d-flex items-center text-13 mt-5'>
                      <div className='d-flex x-gap-5'>
                        <Stars star={tour.rating || 5} />
                      </div>

                      <span className='text-dark-1 ml-10'>
                        {tour.rating || 5} ({tour.ratingCount || 0})
                      </span>
                    </div>

                    <div className='d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10'>
                      <div className='d-flex items-center'>
                        <i className='icon-clock text-16 mr-5'></i>
                        {tour.duration || "Duration not specified"}
                      </div>

                      <div>
                        From{" "}
                        <span className='text-16 fw-500'>
                          ${formatPrice(tour.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className='col-12 text-center'>
              <p>No tours available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
