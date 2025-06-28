"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import tourService from "../../../app/store/services/tourService";
import MainInformation from "../MainInformation";
import OthersInformation from "../OthersInformation";
import Overview from "../Overview";
import Included from "../Included";
import Map from "@/components/tours/Map";
import Faq from "../Faq";
import Rating from "../Rating";
import Reviews from "../Reviews";
import TourSingleSidebar from "../TourSingleSidebar";
import Gallery1 from "../Galleries/Gallery1";
import DateCalender from "../DateCalender";
import RoadMap2 from "../Roadmap2";
import CommentBox from "../CommentBox";
import Head from "next/head";

export default function SingleOne() {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        const tourId = params.id;
        const response = await tourService.getSingleTour(tourId);
        // Extract tour from the nested data structure
        setTour(response.data.tour);
        console.log("Tour data:", response.data.tour);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTourData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className='container py-40'>
        <p className='text-center'>Loading tour information...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className='container py-40'>
        <p className='text-center'>Tour not found</p>
      </div>
    );
  }

  return (
    <>
      <section className=''>
        <div className='container'>
          <MainInformation tour={tour} />
          <Gallery1 tour={tour} />
        </div>
      </section>

      <section className='layout-pt-md js-pin-container'>
        <div className='container'>
          <div className='row y-gap-30 justify-between'>
            <div className='col-lg-8'>
              <div className='row y-gap-20 justify-between items-center layout-pb-md'>
                <OthersInformation tour={tour} />
              </div>

              <Overview tour={tour} />

              {/* <div className='line mt-60 mb-60'></div> */}

              {/* <h2 className='text-30'>What's included</h2> */}

              <Included tour={tour} />

              {/* <div className='line mt-60 mb-60'></div> */}

              {/* <h2 className='text-30'>Itinerary</h2>

              <RoadMap2 tour={tour} />

              <h2 className='text-30 mt-60 mb-30'>Tour Map</h2>
              <div className='mapTourSingle'>
                <Map
                  tourLocation={
                    tour.mapLocation
                      ? {
                          lat: tour.mapLocation.latitude,
                          lng: tour.mapLocation.longitude,
                          zoom: tour.mapLocation.zoom,
                        }
                      : null
                  }
                />
              </div> */}

              {/* <div className='line mt-60 mb-60'></div> */}
              {/* 
              <h2 className='text-30'>Availability Calendar</h2>
              <DateCalender tour={tour} /> */}

              <div className='line mt-60 mb-60'></div>

              <h2 className='text-30'>FAQ</h2>

              <div className='accordion -simple row y-gap-20 mt-30 js-accordion'>
                <Faq tour={tour} />
              </div>

              <div className='line mt-60 mb-60'></div>

              <h2 className='text-30'>Customer Reviews</h2>

              <div className='mt-30'>
                <Rating tour={tour} />
              </div>

              {/* <Reviews tour={tour} /> */}

              {/* <button className='button -md -outline-accent-1 text-accent-1 mt-30'>
                See more reviews
                <i className='icon-arrow-top-right text-16 ml-10'></i>
              </button> */}
              {/* <CommentBox tour={tour} /> */}
            </div>

            <div className='col-lg-4'>
              <div className='d-flex justify-end js-pin-content'>
                <TourSingleSidebar tour={tour} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
