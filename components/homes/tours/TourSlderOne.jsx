"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import Stars from "@/components/common/Stars";
import tourService from "../../../app/store/services/tourService";
import Image from "next/image";
import Link from "next/link";

export default function TourSliderOne() {
  const [showSwiper, setShowSwiper] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setShowSwiper(true);

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

        // Limit to 8 tours for the trending tours slider
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
      <section className='layout-pt-xl layout-pb-xl relative'>
        <div className='sectionBg -w-1530 rounded-12 bg-light-1'></div>
        <div className='container'>
          <div className='row justify-center'>
            <div className='col-auto'>
              <div className='text-center'>Loading trending tours...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='layout-pt-xl layout-pb-xl relative'>
        <div className='sectionBg -w-1530 rounded-12 bg-light-1'></div>
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
    <section className='layout-pt-xl layout-pb-xl relative'>
      <div className='sectionBg -w-1530 rounded-12 bg-light-1'></div>

      <div className='container'>
        <div className='row justify-between items-end y-gap-10'>
          <div className='col-auto'>
            <h2
              data-aos='fade-up'
              data-aos-delay=''
              className='text-30 md:text-24'>
              Top Trending
            </h2>
          </div>

          <div className='col-auto'>
            <Link
              href={"/tour-list-1"}
              data-aos='fade-right'
              data-aos-delay=''
              className='buttonArrow d-flex items-center '>
              <span>See all</span>
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </Link>
          </div>
        </div>

        <div className='relative pt-40 sm:pt-20'>
          <div className='overflow-hidden pb-30 js-section-slider'>
            <div
              data-aos='fade-up'
              data-aos-delay=''
              className='swiper-wrapper'>
              {showSwiper && Array.isArray(tours) && tours.length > 0 && (
                <Swiper
                  spaceBetween={30}
                  className='w-100'
                  pagination={{
                    el: ".pbutton1",
                    clickable: true,
                  }}
                  navigation={{
                    prevEl: ".prev1",
                    nextEl: ".next1",
                  }}
                  modules={[Navigation, Pagination]}
                  breakpoints={{
                    500: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                    1200: {
                      slidesPerView: 4,
                    },
                  }}>
                  {tours.map((tour, i) => (
                    <SwiperSlide key={tour._id || i}>
                      <Link
                        href={`/tour-single-1/${tour.id}`}
                        className='tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow'>
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
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {(!tours || tours.length === 0) && !loading && (
                <div className='text-center py-40'>
                  <p>No trending tours available</p>
                </div>
              )}
            </div>
          </div>

          <div className='navAbsolute'>
            <button className='navAbsolute__button bg-white js-slider1-prev prev1'>
              <i className='icon-arrow-left text-14'></i>
            </button>

            <button className='navAbsolute__button bg-white js-slider1-next next1'>
              <i className='icon-arrow-right text-14'></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
