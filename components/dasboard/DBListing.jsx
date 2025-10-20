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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = (tour) => {
    setTourToDelete(tour);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;

    try {
      setDeleting(true);
      await tourService.deleteTour(tourToDelete.id || tourToDelete._id);

      // Show success message
      setShowDeleteModal(false);
      setTourToDelete(null);

      // Refresh the list
      fetchTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
      setError("Failed to delete tour");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTourToDelete(null);
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
                                <Image
                                  width='250'
                                  height='160'
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
                                      <div className='row x-gap-10 y-gap-10'>
                                        <div className='col-6'>
                                          <button
                                            onClick={() => handleEdit(elm)}
                                            className='button -sm -outline-accent-1 text-accent-1 w-100'
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              gap: "6px",
                                              padding: "10px 16px",
                                              borderRadius: "8px",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              transition: "all 0.2s ease",
                                            }}>
                                            <i className='icon-edit text-14'></i>
                                            <span>Edit</span>
                                          </button>
                                        </div>

                                        <div className='col-6'>
                                          <button
                                            onClick={() => handleDelete(elm)}
                                            className='button -sm -outline-red-1 text-red-1 w-100'
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              gap: "6px",
                                              padding: "10px 16px",
                                              borderRadius: "8px",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              transition: "all 0.2s ease",
                                              border: "1px solid #ef4444",
                                              color: "#ef4444",
                                              backgroundColor: "transparent",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.target.style.backgroundColor =
                                                "#ef4444";
                                              e.target.style.color = "white";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.target.style.backgroundColor =
                                                "transparent";
                                              e.target.style.color = "#ef4444";
                                            }}>
                                            <i className='icon-delete text-14'></i>
                                            <span>Delete</span>
                                          </button>
                                        </div>
                                      </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "40px",
              maxWidth: "480px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "modalSlideIn 0.3s ease-out",
            }}>
            {/* Warning Icon */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "24px",
              }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <svg
                  width='40'
                  height='40'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z'
                    stroke='#ef4444'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>

            {/* Modal Content */}
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "center",
                marginBottom: "12px",
                color: "#1f2937",
              }}>
              Delete Tour?
            </h3>

            <p
              style={{
                fontSize: "16px",
                textAlign: "center",
                marginBottom: "8px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "#1f2937" }}>
                "{tourToDelete?.title}"
              </strong>
              ?
            </p>

            <p
              style={{
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "32px",
                color: "#ef4444",
                fontWeight: "500",
              }}>
              This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={cancelDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: "10px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: deleting ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!deleting) {
                    e.target.style.backgroundColor = "#f9fafb";
                    e.target.style.borderColor = "#d1d5db";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleting) {
                    e.target.style.backgroundColor = "white";
                    e.target.style.borderColor = "#e5e7eb";
                  }
                }}>
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: deleting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: deleting ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!deleting) {
                    e.target.style.backgroundColor = "#dc2626";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(239, 68, 68, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleting) {
                    e.target.style.backgroundColor = "#ef4444";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}>
                {deleting ? (
                  <>
                    <svg
                      style={{
                        animation: "spin 1s linear infinite",
                        width: "16px",
                        height: "16px",
                      }}
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'>
                      <circle
                        style={{ opacity: 0.25 }}
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'></circle>
                      <path
                        style={{ opacity: 0.75 }}
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className='icon-delete'></i>
                    Delete Tour
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add CSS animations */}
          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                transform: scale(0.95) translateY(-20px);
                opacity: 0;
              }
              to {
                transform: scale(1) translateY(0);
                opacity: 1;
              }
            }

            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </ProtectedRoute>
  );
}
