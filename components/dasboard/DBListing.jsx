"use client";

import Pagination from "../common/Pagination";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Stars from "../common/Stars";
import { useState, useEffect } from "react";
import Image from "next/image";
import tourService from "@/app/store/services/tourService";
import EditTourModal from "../../components/modals/EditTourModal";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function DBListing() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tours from database
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tourService.getAllTours();

      if (response.data && response.data.tours) {
        setTours(response.data.tours);
      } else if (response.tours) {
        setTours(response.tours);
      } else if (Array.isArray(response)) {
        setTours(response);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError("Failed to load tours");
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleEdit = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  const handleUpdateSuccess = () => {
    fetchTours(); // Refresh the list
  };

  return (
    <ProtectedRoute>
      <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}>
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className='dashboard__content'>
          <Header setSideBarOpen={setSideBarOpen} />

          <div className='dashboard__content_content'>
            <h1 className='text-30'>My Listings</h1>
            <p className=''>Manage and edit your tour listings</p>

            <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:pb-20 mt-60 md:mt-30'>
              {loading ? (
                <div className='text-center py-60'>
                  <p className='mt-20 text-16'>Loading tours...</p>
                </div>
              ) : error ? (
                <div className='py-40 text-center'>
                  <p className='text-red'>{error}</p>
                </div>
              ) : tours.length === 0 ? (
                <div className='text-center py-60'>
                  <h3 className='text-24 fw-600 mt-20'>No tours found</h3>
                  <p className='text-16 mt-10'>
                    Start by adding your first tour listing
                  </p>
                </div>
              ) : (
                <>
                  <div className='row y-gap-30'>
                    {tours.map((elm) => {
                      const tourId = elm.id || elm._id;

                      return (
                        <div key={tourId} className='col-lg-6'>
                          <div className='border-1 rounded-12 px-20 py-20 h-full'>
                            <div className='row x-gap-20 y-gap-20 h-full'>
                              <div className='col-auto h-full'>
                                <img
                                  src={elm.imageSrc}
                                  alt={elm.title}
                                  className='rounded-12 object-cover h-full'
                                  style={{ width: "250px" }}
                                />
                              </div>

                              <div className='col'>
                                <div className='d-flex flex-column h-full justify-between'>
                                  <div>
                                    <div className='d-flex items-center text-14 text-light-2'>
                                      <i className='icon-pin mr-5'></i>
                                      {elm.location}
                                    </div>

                                    <div className='text-18 lh-15 fw-500 mt-10'>
                                      {elm.title}
                                    </div>

                                    <div className='d-flex items-center mt-10'>
                                      <div className='d-flex x-gap-5 text-yellow-2 mr-10'>
                                        <Stars star={elm.rating || 0} />
                                      </div>
                                      <div className='text-14'>
                                        {elm.rating || 0} (
                                        {elm.ratingCount || 0})
                                      </div>
                                    </div>
                                  </div>

                                  <div className='mt-20'>
                                    <div className='d-flex items-center justify-between pt-15 border-top-1'>
                                      <div className='d-flex items-center'>
                                        <i className='icon-clock mr-5 text-16'></i>
                                        <div className='text-14'>
                                          {elm.duration}{" "}
                                          {elm.duration === 1 ? "day" : "days"}
                                        </div>
                                      </div>

                                      <div className='text-right'>
                                        <div className='text-14 text-light-2'>
                                          From
                                        </div>
                                        <div className='text-20 fw-500'>
                                          ${elm.fromPrice || elm.price}
                                        </div>
                                      </div>
                                    </div>

                                    <div className='mt-15'>
                                      <button
                                        onClick={() => handleEdit(elm)}
                                        className='button -sm -outline-accent-1 text-accent-1 w-100'>
                                        <i className='icon-edit mr-5'></i>
                                        Edit Tour
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className='mt-30'>
                    <Pagination />

                    <div className='text-14 text-center mt-20'>
                      Showing results 1-{tours.length} of {tours.length}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className='text-center pt-30'>
              © Copyright Rapid Eases {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditTourModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleUpdateSuccess}
      />
    </ProtectedRoute>
  );
}
