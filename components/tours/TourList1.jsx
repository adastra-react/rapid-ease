// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Sidebar from "./Sidebar";
// import { speedFeatures } from "@/data/tourFilteringOptions";
// import Stars from "../common/Stars";
// import Pagination from "../common/Pagination";
// import Image from "next/image";
// import Link from "next/link";
// import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
// import {
//   fetchTours,
//   setFilters,
//   setCurrentPage,
// } from "../../app/store/slices/toursSlice";

// export default function TourList1() {
//   const dispatch = useAppDispatch();
//   const {
//     tours,
//     totalTours,
//     totalPages,
//     currentPage,
//     loading,
//     error,
//     filters,
//   } = useAppSelector((state) => state.tours);

//   const [sortOption, setSortOption] = useState("");
//   const [ddActives, setDdActives] = useState(false);
//   const [sidebarActive, setSidebarActive] = useState(false);
//   const dropDownContainer = useRef();
//   const [mounted, setMounted] = useState(false);

//   // Function to truncate description to 15 words with ellipses
//   const truncateDescription = (text, maxWords = 15) => {
//     if (!text) return "";

//     const words = text.trim().split(/\s+/);

//     if (words.length <= maxWords) {
//       return text;
//     }

//     // Take first 15 words and add ellipses
//     return words.slice(0, maxWords).join(" ") + "...";
//   };

//   useEffect(() => {
//     // Fetch tours when component mounts
//     dispatch(fetchTours());
//   }, [dispatch, currentPage, filters]);

//   useEffect(() => {
//     const handleClick = (event) => {
//       if (
//         dropDownContainer.current &&
//         !dropDownContainer.current.contains(event.target)
//       ) {
//         setDdActives(false);
//       }
//     };

//     document.addEventListener("click", handleClick);

//     return () => {
//       document.removeEventListener("click", handleClick);
//     };
//   }, []);

//   useEffect(() => {
//     // Fetch tours when component mounts or when page/filters change
//     dispatch(
//       fetchTours({
//         page: currentPage,
//         limit: 10, // Or whatever your API expects
//         ...filters,
//       })
//     );
//   }, [dispatch, currentPage, filters]);

//   // Handle sort change
//   const handleSortChange = (option) => {
//     setSortOption(option);
//     setDdActives(false);

//     // Update sort in redux
//     dispatch(
//       setFilters({
//         sort:
//           option === "Price Low to High"
//             ? "price"
//             : option === "Price High to Low"
//             ? "-price"
//             : option === "Most Popular"
//             ? "-ratingCount"
//             : option === "Top Rated"
//             ? "-rating"
//             : "-createdAt",
//       })
//     );
//   };

//   // Handle page change
//   const handlePageChange = (page) => {
//     dispatch(setCurrentPage(page));
//   };

//   return (
//     <section className='layout-pb-xl'>
//       <div className='container'>
//         <div className='row'>
//           <div className='col-xl-3 col-lg-4'>
//             <div className='lg:d-none'>
//               <Sidebar />
//             </div>

//             <div className='accordion d-none mb-30 lg:d-flex js-accordion'>
//               <div
//                 className={`accordion__item col-12 ${
//                   sidebarActive ? "is-active" : ""
//                 } `}>
//                 <button
//                   className='accordion__button button -dark-1 bg-light-1 px-25 py-10 border-1 rounded-12'
//                   onClick={() => setSidebarActive((pre) => !pre)}>
//                   <i className='icon-sort-down mr-10 text-16'></i>
//                   Filter
//                 </button>

//                 <div
//                   className='accordion__content'
//                   style={sidebarActive ? { maxHeight: "2000px" } : {}}>
//                   <div className='pt-20'>
//                     <Sidebar />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className='col-xl-9 col-lg-8'>
//             <div className='row y-gap-5 justify-between'>
//               <div className='col-auto'>
//                 <div>{totalTours || 0} results</div>
//               </div>

//               <div ref={dropDownContainer} className='col-auto'>
//                 <div
//                   className={`dropdown -type-2 js-dropdown js-form-dd ${
//                     ddActives ? "is-active" : ""
//                   } `}
//                   data-main-value=''>
//                   <div
//                     className='dropdown__button js-button'
//                     onClick={() => setDdActives((pre) => !pre)}>
//                     <span>Sort by: </span>
//                     <span className='js-title'>
//                       {sortOption ? sortOption : "Featured"}
//                     </span>
//                     <i className='icon-chevron-down'></i>
//                   </div>

//                   <div className='dropdown__menu js-menu-items'>
//                     {speedFeatures.map((elm, i) => (
//                       <div
//                         onClick={() => handleSortChange(elm)}
//                         key={i}
//                         className='dropdown__item'
//                         data-value='fast'>
//                         {elm}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className='row y-gap-30 pt-30'>
//               {loading ? (
//                 <div className='col-12 text-center'>
//                   <div className='spinner-border' role='status'>
//                     <span className='visually-hidden'>Loading...</span>
//                   </div>
//                 </div>
//               ) : error ? (
//                 <div className='col-12 text-center'>
//                   <div className='alert alert-danger' role='alert'>
//                     {error}
//                   </div>
//                 </div>
//               ) : tours && tours.length > 0 ? (
//                 tours.map((tour, i) => (
//                   <div className='col-12' key={i}>
//                     <div className='tourCard -type-2'>
//                       <div className='tourCard__image tourCard__List__image'>
//                         <Image
//                           width={280}
//                           height={260}
//                           src={tour.imageSrc || "/img/tours/default.jpg"}
//                           alt={tour.title || "Tour image"}
//                         />

//                         {tour.badgeText && (
//                           <div className='tourCard__badge'>
//                             <div className='bg-accent-1 rounded-12 text-white lh-11 text-13 px-15 py-10'>
//                               {tour.badgeText}
//                             </div>
//                           </div>
//                         )}

//                         {tour.featured && (
//                           <div className='tourCard__badge'>
//                             <div className='bg-accent-2 rounded-12 text-white lh-11 text-13 px-15 py-10'>
//                               FEATURED
//                             </div>
//                           </div>
//                         )}

//                         <div className='tourCard__favorite'>
//                           <button className='button -accent-1 size-35 bg-white rounded-full flex-center'>
//                             <i className='icon-heart text-15'></i>
//                           </button>
//                         </div>
//                       </div>

//                       <div className='tourCard__content'>
//                         <div className='tourCard__location'>
//                           <i className='icon-pin'></i>
//                           {tour.location}
//                         </div>

//                         <h3 className='tourCard__title mt-5'>
//                           <span>{tour.title}</span>
//                         </h3>

//                         <div className='d-flex items-center mt-5'>
//                           <div className='d-flex items-center x-gap-5'>
//                             <Stars star={tour.rating} font={12} />
//                           </div>

//                           <div className='text-14 ml-10'>
//                             <span className='fw-500'>{tour.rating}</span> (
//                             {tour.ratingCount})
//                           </div>
//                         </div>

//                         <p className='tourCard__text mt-5'>
//                           {truncateDescription(
//                             tour.description || tour.overview,
//                             15
//                           )}
//                         </p>

//                         <div className='row x-gap-20 y-gap-5 pt-30'>
//                           {tour.features?.map((feature, i2) => (
//                             <div key={i2} className='col-auto'>
//                               <div className='text-14 text-accent-1'>
//                                 <i className={`${feature.icon} mr-10`}></i>
//                                 {feature.name}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className='tourCard__info'>
//                         <div>
//                           <div className='d-flex items-center text-14'>
//                             <i className='icon-clock mr-10'></i>
//                             {tour.duration}
//                           </div>

//                           <div className='tourCard__price'>
//                             <div>${tour.fromPrice}</div>

//                             <div className='d-flex items-center'>
//                               From{" "}
//                               <span className='text-20 fw-500 ml-5'>
//                                 ${tour?.price || r?.pricing?.basePrice || 0}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <button className='button -outline-accent-1 text-accent-1'>
//                           <Link href={`/tour-single-1/${tour.id || tour._id}`}>
//                             View Details
//                             <i className='icon-arrow-top-right ml-10'></i>
//                           </Link>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className='col-12 text-center'>
//                   <div className='alert alert-info' role='alert'>
//                     No tours found. Try adjusting your filters.
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className='d-flex justify-center flex-column mt-60'>
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />

//               <div className='text-14 text-center mt-20'>
//                 Showing results {tours.length ? (currentPage - 1) * 10 + 1 : 0}-
//                 {Math.min(currentPage * 10, totalTours)} of {totalTours}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import { speedFeatures } from "@/data/tourFilteringOptions";
import Stars from "../common/Stars";
import PriceText from "../common/PriceText";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  defaultTourFilters,
  fetchTours,
  setFilters,
  setCurrentPage,
} from "../../app/store/slices/toursSlice";

const PAGE_SIZE = 10;

export default function TourList1({ searchParams = {} }) {
  const listStyles = {
    toolbarSummary: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#1f2557",
      padding: "10px 14px",
      borderRadius: "999px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e9edf5",
    },
    searchChip: {
      borderRadius: "999px",
      border: "1px solid #e6eaf2",
      backgroundColor: "#ffffff",
      padding: "10px 14px",
      fontSize: "13px",
      fontWeight: 500,
      color: "#526071",
    },
    card: {
      display: "grid",
      gridTemplateColumns: "240px minmax(0, 1fr) minmax(150px, 170px)",
      gap: "0",
      alignItems: "stretch",
      border: "1px solid #e8edf5",
      borderRadius: "24px",
      overflow: "hidden",
      backgroundColor: "#ffffff",
      boxShadow: "0 14px 40px rgba(15, 23, 42, 0.05)",
    },
    imageWrap: {
      position: "relative",
      padding: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(255,255,255,1) 100%)",
    },
    imageInner: {
      position: "relative",
      width: "100%",
      height: "224px",
      minHeight: "224px",
      maxHeight: "224px",
      flex: "0 0 auto",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
    },
    badgeWrap: {
      position: "absolute",
      top: "20px",
      left: "20px",
      zIndex: 2,
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      maxWidth: "calc(100% - 80px)",
    },
    favoriteWrap: {
      position: "absolute",
      top: "20px",
      right: "20px",
      zIndex: 2,
    },
    content: {
      padding: "22px 24px",
      borderLeft: "1px solid #eef2f7",
      borderRight: "1px solid #eef2f7",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minWidth: 0,
    },
    locationRow: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      fontWeight: 600,
      color: "#6b7280",
      marginBottom: "10px",
    },
    title: {
      fontSize: "24px",
      lineHeight: 1.25,
      fontWeight: 700,
      color: "#1f2557",
      marginBottom: "10px",
    },
    ratingRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "14px",
    },
    ratingMeta: {
      fontSize: "13px",
      color: "#6b7280",
      fontWeight: 500,
    },
    description: {
      fontSize: "14px",
      lineHeight: 1.75,
      color: "#526071",
      marginBottom: "18px",
      maxWidth: "540px",
    },
    featuresRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      alignItems: "flex-start",
      alignContent: "flex-start",
      width: "100%",
      paddingTop: "18px",
      marginTop: "auto",
    },
    featureChip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      borderRadius: "999px",
      backgroundColor: "#f8fafc",
      border: "1px solid #ebeff5",
      fontSize: "12px",
      fontWeight: 500,
      color: "#526071",
      minHeight: "36px",
      maxWidth: "100%",
      width: "fit-content",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: "0 0 auto",
      alignSelf: "flex-start",
    },
    sidePanel: {
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "14px",
      background:
        "linear-gradient(180deg, rgba(250,251,255,0.96) 0%, rgba(255,255,255,1) 100%)",
      minWidth: 0,
    },
    durationChip: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minWidth: "116px",
      padding: "8px 14px",
      borderRadius: "999px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e9edf5",
      fontSize: "12px",
      fontWeight: 600,
      color: "#526071",
    },
    priceLabel: {
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "#9ca3af",
      fontWeight: 700,
      marginBottom: "8px",
    },
    strikePrice: {
      fontSize: "14px",
      color: "#c0c6d4",
      textDecoration: "line-through",
      marginBottom: "2px",
    },
    fromRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      gap: "6px",
      color: "#526071",
      fontSize: "14px",
      marginBottom: "18px",
    },
    priceBox: {
      padding: "18px 16px 16px",
      borderRadius: "20px",
      backgroundColor: "#ffffff",
      border: "1px solid #ebeff5",
      boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
      textAlign: "center",
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    },
    buttonLink: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      minHeight: "48px",
      padding: "0 16px",
      borderRadius: "14px",
      border: "1px solid rgba(234, 60, 60, 0.28)",
      color: "#ea3c3c",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: 1,
      backgroundColor: "#fff5f5",
      transition: "all 0.2s ease",
      textDecoration: "none",
      boxSizing: "border-box",
      whiteSpace: "nowrap",
    },
    featuredBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "999px",
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      boxShadow: "0 8px 18px rgba(79, 70, 229, 0.28)",
    },
    subtleBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "999px",
      backgroundColor: "rgba(234, 60, 60, 0.1)",
      color: "#ea3c3c",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  };
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
  const appliedSearchRef = useRef("");
  const travelDate = searchParams.date || "";
  const searchLocation = searchParams.location || "";
  const searchTourType = searchParams.tourType || "";
  const hasExactRatingFilter =
    filters.minRating !== null && filters.maxRating !== null;
  const displayedTours = hasExactRatingFilter
    ? tours.filter((tour) => {
        const tourRating = Number(tour.rating);

        if (Number.isNaN(tourRating)) {
          return false;
        }

        return (
          tourRating >= filters.minRating &&
          (filters.maxRating === 5
            ? tourRating <= 5
            : tourRating < filters.maxRating)
        );
      })
    : tours;
  const displayedTotalTours = hasExactRatingFilter
    ? displayedTours.length
    : totalTours || 0;

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

  const getCurrentPrice = (tour) => {
    const candidates = [tour?.price, tour?.pricing?.basePrice, tour?.fromPrice];
    const numericPrice = candidates.find(
      (value) => Number.isFinite(Number(value)) && Number(value) > 0
    );

    return Number(numericPrice || 0);
  };

  const getOriginalPrice = (tour, currentPrice) => {
    const fromPrice = Number(tour?.fromPrice);

    if (!Number.isFinite(fromPrice) || fromPrice <= currentPrice) {
      return null;
    }

    return fromPrice;
  };

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
    const searchSource = searchParams.search;
    const searchSignature = JSON.stringify(searchParams);

    if (searchSource !== "hero" || appliedSearchRef.current === searchSignature) {
      return;
    }

    appliedSearchRef.current = searchSignature;

    dispatch(
      setFilters({
        ...defaultTourFilters,
        location: searchLocation || "",
        tourTypes: searchTourType ? [searchTourType] : [],
      })
    );
    dispatch(setCurrentPage(1));
  }, [dispatch, searchLocation, searchParams, searchTourType]);

  useEffect(() => {
    dispatch(
      fetchTours({
        page: currentPage,
        limit: PAGE_SIZE,
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
                <div style={listStyles.toolbarSummary}>
                  {displayedTotalTours} results
                </div>
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

            {(searchLocation || searchTourType || travelDate) && (
              <div className='d-flex flex-wrap gap-10 pt-20'>
                {searchLocation && (
                  <div style={listStyles.searchChip}>
                    Location: {searchLocation}
                  </div>
                )}
                {searchTourType && (
                  <div style={listStyles.searchChip}>
                    Tour Type: {searchTourType}
                  </div>
                )}
                {travelDate && (
                  <div style={listStyles.searchChip}>
                    Travel Date: {travelDate}
                  </div>
                )}
              </div>
            )}

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
              ) : displayedTours && displayedTours.length > 0 ? (
                displayedTours.map((tour, i) => (
                  <div
                    className='col-12'
                    key={tour.id || tour._id || `tour-${i}`}>
                    {(() => {
                      const currentPrice = getCurrentPrice(tour);
                      const originalPrice = getOriginalPrice(
                        tour,
                        currentPrice
                      );
                      const visibleFeatures = (tour.features || [])
                        .filter((feature) => feature?.name?.trim())
                        .slice(0, 3);

                      return (
                    <div style={listStyles.card}>
                      <div style={listStyles.imageWrap}>
                        <div style={listStyles.imageInner}>
                          <Image
                            fill
                            src={tour.imageSrc || "/img/tours/default.jpg"}
                            alt={tour.title || "Tour image"}
                            priority={i < 3}
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        {tour.badgeText && (
                          <div style={listStyles.badgeWrap}>
                            <div style={listStyles.subtleBadge}>
                              {tour.badgeText}
                            </div>
                          </div>
                        )}

                        {tour.featured && (
                          <div
                            style={
                              tour.badgeText
                                ? {
                                    ...listStyles.badgeWrap,
                                    top: "56px",
                                  }
                                : listStyles.badgeWrap
                            }>
                            <div style={listStyles.featuredBadge}>
                              FEATURED
                            </div>
                          </div>
                        )}

                        <div style={listStyles.favoriteWrap}>
                          <button className='button -accent-1 size-35 bg-white rounded-full flex-center'>
                            <i className='icon-heart text-15'></i>
                          </button>
                        </div>
                      </div>

                      <div style={listStyles.content}>
                        <div style={listStyles.locationRow}>
                          <i className='icon-pin'></i>
                          {tour.location}
                        </div>

                        <h3 style={listStyles.title}>
                          <span>{tour.title}</span>
                        </h3>

                        <div style={listStyles.ratingRow}>
                          <div className='d-flex items-center x-gap-5'>
                            <Stars star={tour.rating} font={12} />
                          </div>

                          <div className='text-14' style={listStyles.ratingMeta}>
                            <span className='fw-500'>{tour.rating}</span> (
                            {tour.ratingCount})
                          </div>
                        </div>

                        <p style={listStyles.description}>
                          {truncateDescription(
                            tour.description || tour.overview,
                            15
                          )}
                        </p>

                        <div style={listStyles.featuresRow}>
                          {visibleFeatures.map((feature, i2) => (
                            <div
                              key={`${tour.id || tour._id}-feature-${i2}`}
                              style={listStyles.featureChip}>
                              {feature.icon ? (
                                <i className={feature.icon}></i>
                              ) : null}
                              <span>{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={listStyles.sidePanel}>
                        <div style={listStyles.durationChip}>
                          <i className='icon-clock'></i>
                          {tour.duration}
                        </div>

                        <div style={listStyles.priceBox}>
                          <div style={listStyles.priceLabel}>
                            {originalPrice ? "Starting from" : "Price"}
                          </div>
                          {originalPrice ? (
                            <div style={listStyles.strikePrice}>
                              <PriceText as='span' amount={originalPrice} />
                            </div>
                          ) : (
                            <div
                              style={{
                                height: "18px",
                                marginBottom: "2px",
                              }}
                            />
                          )}

                          <div style={listStyles.fromRow}>
                            <span>{originalPrice ? "From" : ""}</span>
                            <PriceText
                              className='text-20 fw-700'
                              amount={currentPrice}
                            />
                          </div>

                          <Link
                            href={`/tour-single-1/${tour.id || tour._id}`}
                            style={listStyles.buttonLink}>
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                      );
                    })()}
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
                Showing results{" "}
                {displayedTours?.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}
                -{Math.min(currentPage * PAGE_SIZE, displayedTotalTours)} of{" "}
                {displayedTotalTours}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
