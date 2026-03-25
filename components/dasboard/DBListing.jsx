"use client";

import Pagination from "../common/Pagination";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Stars from "../common/Stars";
import { useState, useEffect } from "react";
import Image from "next/image";
import tourService from "@/app/store/services/tourService";
import PriceText from "../common/PriceText";
import EditTourModal from "../../components/modals/EditTourModal";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function DBListing() {
  const PAGE_SIZE = 6;
  const actionButtonRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  };
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getTourImage = (tour) =>
    tour.imageSrc ||
    tour.images?.[0]?.url ||
    "/img/tours/default.jpg";

  const getListingReference = (tour) =>
    tour.id
      ? `TOUR-${String(tour.id).padStart(6, "0")}`
      : `#${String(tour._id || "").slice(-6).toUpperCase()}`;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredTours = tours.filter((tour) => {
    if (!normalizedSearch) return true;

    const haystack = [
      getListingReference(tour),
      tour.title,
      tour.location,
      tour.featured ? "featured" : "live",
      `${tour.bookingCount || 0}`,
      `${tour.duration || ""}`,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const totalPages = Math.max(Math.ceil(filteredTours.length / PAGE_SIZE), 1);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTours = filteredTours.slice(startIndex, startIndex + PAGE_SIZE);
  const showingFrom = filteredTours.length ? startIndex + 1 : 0;
  const showingTo = Math.min(startIndex + PAGE_SIZE, filteredTours.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <ProtectedRoute>
      <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}>
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className='dashboard__content'>
          <Header
            setSideBarOpen={setSideBarOpen}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder='Search listings by title, location, or ID'
          />

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
              ) : filteredTours.length === 0 ? (
                <div className='text-center py-60'>
                  <h3 className='text-24 fw-600 mt-20'>
                    No listings match your search
                  </h3>
                  <p className='text-16 mt-10'>
                    Try a different title, location, or listing ID.
                  </p>
                </div>
              ) : (
                <>
                  <div className='overflowAuto'>
                    <table
                      className='tableTest mb-30'
                      style={{ minWidth: "1200px", width: "100%" }}>
                      <thead className='bg-light-1 rounded-12'>
                        <tr>
                          <th
                            className='py-20'
                            style={{ width: "150px", minWidth: "150px" }}>
                            Listing ID
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "360px", minWidth: "360px" }}>
                            Tour
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "150px", minWidth: "150px" }}>
                            Location
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "150px", minWidth: "150px" }}>
                            Rating
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "120px", minWidth: "120px" }}>
                            Duration
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "120px", minWidth: "120px" }}>
                            Bookings
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "120px", minWidth: "120px" }}>
                            Price
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "120px", minWidth: "120px" }}>
                            Status
                          </th>
                          <th
                            className='py-20'
                            style={{ width: "130px", minWidth: "130px" }}>
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedTours.map((tour) => {
                          const tourId = tour.id || tour._id;

                          return (
                            <tr key={tourId} className='border-bottom-light'>
                              <td
                                className='py-20'
                                style={{ width: "150px", minWidth: "150px" }}>
                                <div className='fw-600 text-16'>
                                  {getListingReference(tour)}
                                </div>
                                <div className='text-14 text-light-2 mt-5'>
                                  {tour.createdAt
                                    ? new Date(
                                        tour.createdAt
                                      ).toLocaleDateString()
                                    : "Recently added"}
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "360px", minWidth: "360px" }}>
                                <div className='d-flex items-center'>
                                  <div className='size-80 rounded-12 overflow-hidden mr-15'>
                                    <Image
                                      width={80}
                                      height={80}
                                      src={getTourImage(tour)}
                                      alt={tour.title}
                                      className='w-full h-full object-cover'
                                      unoptimized={true}
                                    />
                                  </div>
                                  <div className='flex-1'>
                                    <div className='fw-500 text-16 mb-5'>
                                      {tour.title}
                                    </div>
                                    <div className='text-12 text-light-2 mb-5 d-flex items-center'>
                                      <i className='icon-location mr-5'></i>
                                      {tour.location || "Jamaica"}
                                    </div>
                                    <div className='text-14 text-light-2'>
                                      {tour.featured
                                        ? "Featured listing"
                                        : "Standard listing"}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "150px", minWidth: "150px" }}>
                                <div className='fw-500 text-15'>
                                  {tour.location || "Jamaica"}
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "150px", minWidth: "150px" }}>
                                <div className='d-flex items-center x-gap-5 text-yellow-2 mb-5'>
                                  <Stars star={tour.rating || 0} />
                                </div>
                                <div className='text-14 text-light-2'>
                                  {tour.rating || 0} ({tour.ratingCount || 0})
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "120px", minWidth: "120px" }}>
                                <div className='fw-500 text-15'>
                                  {tour.duration}{" "}
                                  {tour.duration === 1 ? "day" : "days"}
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "120px", minWidth: "120px" }}>
                                <div className='fw-500 text-15'>
                                  {tour.bookingCount || 0}
                                </div>
                                <div className='text-12 text-light-2'>
                                  Total bookings
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "120px", minWidth: "120px" }}>
                                <PriceText
                                  as='div'
                                  amount={tour.fromPrice || tour.price}
                                  className='fw-600 text-18 text-dark-1'
                                />
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "120px", minWidth: "120px" }}>
                                <div
                                  className={`circle fw-500 ${
                                    tour.featured
                                      ? "text-accent-1"
                                      : "text-light-2"
                                  }`}>
                                  {tour.featured ? "Featured" : "Live"}
                                </div>
                              </td>

                              <td
                                className='py-20'
                                style={{ width: "130px", minWidth: "130px" }}>
                                <div style={actionButtonRowStyle}>
                                  <button
                                    onClick={() => handleEdit(tour)}
                                    className='button -dark-1 size-40 bg-light-1 rounded-full flex-center hover:bg-accent-1 hover:text-white transition-all'
                                    title='Edit listing'>
                                    <i className='icon-pencil text-16'></i>
                                  </button>

                                  <button
                                    onClick={() => handleDelete(tour)}
                                    className='button -dark-1 size-40 bg-light-1 rounded-full flex-center hover:bg-red-1 hover:text-white transition-all'
                                    title='Delete listing'>
                                    <i className='icon-delete text-16'></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className='mt-30'>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />

                    <div className='text-14 text-center mt-20'>
                      Showing results {showingFrom}-{showingTo} of{" "}
                      {filteredTours.length}
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
