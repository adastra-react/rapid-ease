"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Stars from "@/components/common/Stars";
import { tourData } from "@/data/tours";
import Image from "next/image";
import Link from "next/link";

export default function TourSlder() {
  return (
    <section className='mb-50 mt-50 relative'>
      <div className='sectionBg -w-1530 rounded-12'></div>

      <div className='container'>
        <div className='row justify-between items-end y-gap-10'>
          <div className='col-auto'>
            <h2 className='text-30 md:text-24'>Top Trending</h2>
          </div>

          <div className='col-auto'>
            <Link
              href={"/tour-list-1"}
              className='buttonArrow d-flex items-center '>
              <span>See all</span>
              <i className='icon-arrow-top-right text-16 ml-10'></i>
            </Link>
          </div>
        </div>

        <div className='relative pt-40 sm:pt-20'>
          <div className='overflow-hidden pb-30 js-section-slider'>
            <div className='swiper-wrapper'>
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
                {tourData.map((elm, i) => (
                  <SwiperSlide key={i}>
                    <Link
                      href={`/tour-single-1/${elm.id}`}
                      className='tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow'>
                      <div className='tourCard__header'>
                        <div className='tourCard__image ratio ratio-28:20'>
                          <Image
                            width={421}
                            height={301}
                            src={elm.imageSrc}
                            alt='image'
                            className='img-ratio rounded-12'
                          />
                        </div>

                        <button className='tourCard__favorite'>
                          <i className='icon-heart'></i>
                        </button>
                      </div>

                      <div className='tourCard__content px-10 pt-10'>
                        <div className='tourCard__location d-flex items-center text-13 text-light-2'>
                          <i className='icon-pin d-flex text-16 text-light-2 mr-5'></i>
                          {elm.location}
                        </div>

                        <h3 className='tourCard__title text-16 fw-500 mt-5'>
                          <span>{elm.title}</span>
                        </h3>

                        <div className='tourCard__rating d-flex items-center text-13 mt-5'>
                          <div className='d-flex x-gap-5'>
                            <Stars star={elm.rating} />
                          </div>

                          <span className='text-dark-1 ml-10'>
                            {elm.rating} ({elm.ratingCount})
                          </span>
                        </div>

                        <div className='d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10'>
                          <div className='d-flex items-center'>
                            <i className='icon-clock text-16 mr-5'></i>
                            {elm.duration}
                          </div>

                          <div>
                            From{" "}
                            <span className='text-16 fw-500'>${elm.price}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
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
