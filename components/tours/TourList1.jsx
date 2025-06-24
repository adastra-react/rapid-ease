"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { speedFeatures } from "@/data/tourFilteringOptions";
import Stars from "../common/Stars";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  fetchTours,
  setFilters,
  setCurrentPage,
} from "../../app/store/slices/toursSlice";

export default function TourList1() {
  const dispatch = useAppDispatch();
  const {
    tours,
    totalTours,
    totalPages,
    currentPage,
    loading,
    error,
    filters,
  } = useAppSelector((state) => state.tours);

  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const dropDownContainer = useRef();

  // Function to truncate description to 15 words with ellipses
  const truncateDescription = (text, maxWords = 15) => {
    if (!text) return "";

    const words = text.trim().split(/\s+/);

    if (words.length <= maxWords) {
      return text;
    }

    // Take first 15 words and add ellipses
    return words.slice(0, maxWords).join(" ") + "...";
  };

  useEffect(() => {
    // Fetch tours when component mounts
    dispatch(fetchTours());
  }, [dispatch, currentPage, filters]);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    // Fetch tours when component mounts or when page/filters change
    dispatch(
      fetchTours({
        page: currentPage,
        limit: 10, // Or whatever your API expects
        ...filters,
      })
    );
  }, [dispatch, currentPage, filters]);

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
    setDdActives(false);

    // Update sort in redux
    dispatch(
      setFilters({
        sort:
          option === "Price Low to High"
            ? "price"
            : option === "Price High to Low"
            ? "-price"
            : option === "Most Popular"
            ? "-ratingCount"
            : option === "Top Rated"
            ? "-rating"
            : "-createdAt",
      })
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <section className='layout-pb-xl'>
      <div className='container'>
        <div className='row'>
          <div className='col-xl-3 col-lg-4'>
            <div className='lg:d-none'>
              <Sidebar />
            </div>

            <div className='accordion d-none mb-30 lg:d-flex js-accordion'>
              <div
                className={`accordion__item col-12 ${
                  sidebarActive ? "is-active" : ""
                } `}>
                <button
                  className='accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1 rounded-12'
                  onClick={() => setSidebarActive((pre) => !pre)}>
                  <i className='icon-sort-down mr-10 text-16'></i>
                  Filter
                </button>

                <div
                  className='accordion__content'
                  style={sidebarActive ? { maxHeight: "2000px" } : {}}>
                  <div className='pt-20'>
                    <Sidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-xl-9 col-lg-8'>
            <div className='row y-gap-5 justify-between'>
              <div className='col-auto'>
                <div>{totalTours || 0} results</div>
              </div>

              <div ref={dropDownContainer} className='col-auto'>
                <div
                  className={`dropdown -type-2 js-dropdown js-form-dd ${
                    ddActives ? "is-active" : ""
                  } `}
                  data-main-value=''>
                  <div
                    className='dropdown__button js-button'
                    onClick={() => setDdActives((pre) => !pre)}>
                    <span>Sort by: </span>
                    <span className='js-title'>
                      {sortOption ? sortOption : "Featured"}
                    </span>
                    <i className='icon-chevron-down'></i>
                  </div>

                  <div className='dropdown__menu js-menu-items'>
                    {speedFeatures.map((elm, i) => (
                      <div
                        onClick={() => handleSortChange(elm)}
                        key={i}
                        className='dropdown__item'
                        data-value='fast'>
                        {elm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='row y-gap-30 pt-30'>
              {loading ? (
                <div className='col-12 text-center'>
                  <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className='col-12 text-center'>
                  <div className='alert alert-danger' role='alert'>
                    {error}
                  </div>
                </div>
              ) : tours && tours.length > 0 ? (
                tours.map((tour, i) => (
                  <div className='col-12' key={i}>
                    <div className='tourCard -type-2'>
                      <div className='tourCard__image tourCard__List__image'>
                        <Image
                          width={280}
                          height={260}
                          src={tour.imageSrc || "/img/tours/default.jpg"}
                          alt={tour.title || "Tour image"}
                        />

                        {tour.badgeText && (
                          <div className='tourCard__badge'>
                            <div className='bg-accent-1 rounded-12 text-white lh-11 text-13 px-15 py-10'>
                              {tour.badgeText}
                            </div>
                          </div>
                        )}

                        {tour.featured && (
                          <div className='tourCard__badge'>
                            <div className='bg-accent-2 rounded-12 text-white lh-11 text-13 px-15 py-10'>
                              FEATURED
                            </div>
                          </div>
                        )}

                        <div className='tourCard__favorite'>
                          <button className='button -accent-1 size-35 bg-white rounded-full flex-center'>
                            <i className='icon-heart text-15'></i>
                          </button>
                        </div>
                      </div>

                      <div className='tourCard__content'>
                        <div className='tourCard__location'>
                          <i className='icon-pin'></i>
                          {tour.location}
                        </div>

                        <h3 className='tourCard__title mt-5'>
                          <span>{tour.title}</span>
                        </h3>

                        <div className='d-flex items-center mt-5'>
                          <div className='d-flex items-center x-gap-5'>
                            <Stars star={tour.rating} font={12} />
                          </div>

                          <div className='text-14 ml-10'>
                            <span className='fw-500'>{tour.rating}</span> (
                            {tour.ratingCount})
                          </div>
                        </div>

                        <p className='tourCard__text mt-5'>
                          {truncateDescription(
                            tour.description || tour.overview,
                            15
                          )}
                        </p>

                        <div className='row x-gap-20 y-gap-5 pt-30'>
                          {tour.features?.map((feature, i2) => (
                            <div key={i2} className='col-auto'>
                              <div className='text-14 text-accent-1'>
                                <i className={`${feature.icon} mr-10`}></i>
                                {feature.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='tourCard__info'>
                        <div>
                          <div className='d-flex items-center text-14'>
                            <i className='icon-clock mr-10'></i>
                            {tour.duration}
                          </div>

                          <div className='tourCard__price'>
                            <div>${tour.fromPrice}</div>

                            <div className='d-flex items-center'>
                              From{" "}
                              <span className='text-20 fw-500 ml-5'>
                                ${tour.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button className='button -outline-accent-1 text-accent-1'>
                          <Link href={`/tour-single-1/${tour.id || tour._id}`}>
                            View Details
                            <i className='icon-arrow-top-right ml-10'></i>
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-12 text-center'>
                  <div className='alert alert-info' role='alert'>
                    No tours found. Try adjusting your filters.
                  </div>
                </div>
              )}
            </div>

            <div className='d-flex justify-center flex-column mt-60'>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              <div className='text-14 text-center mt-20'>
                Showing results {tours.length ? (currentPage - 1) * 10 + 1 : 0}-
                {Math.min(currentPage * 10, totalTours)} of {totalTours}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
