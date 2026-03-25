"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Pagination from "../common/Pagination";
import bookingService from "@/app/store/services/bookingService";
import tourService from "@/app/store/services/tourService";
import EditBookingModal from "../modals/EditBookingModal";
import Image from "next/image";

import ProtectedRoute from "../../components/auth/ProtectedRoute";

const tabs = ["Approved", "Pending", "Cancelled"];

const statusMapping = {
  Approved: "confirmed",
  Pending: "pending",
  Cancelled: "cancelled",
};

const bookingCardStyles = {
  label: {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9ca3af",
    fontWeight: 600,
  },
  badgeBase: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1,
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "#f8fafc",
    color: "#526071",
    fontSize: "12px",
    fontWeight: 500,
  },
};

export default function DbBooking() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("Approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tourData, setTourData] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentTab]);

  const fetchTourData = async (tourId) => {
    if (tourData[tourId]) return;

    console.log("🔍 Fetching tour data for ID:", tourId);

    try {
      let response;
      try {
        response = await tourService.getSingleTour(tourId);
        console.log("✅ getSingleTour response:", response);
      } catch (err) {
        console.log("⚠️ getSingleTour failed, trying getTourById:", err);
        response = await tourService.getTourById(tourId);
        console.log("✅ getTourById response:", response);
      }

      const tour = response.data?.tour || response.data;
      console.log("🎯 Extracted tour data:", tour);
      console.log("🖼️ Image source:", tour?.imageSrc);

      setTourData((prev) => ({
        ...prev,
        [tourId]: {
          image:
            tour?.imageSrc || tour?.images?.[0]?.url || tour?.image || null,
          title: tour?.title || null,
          location: tour?.location || null,
        },
      }));
    } catch (error) {
      console.error(`Failed to fetch tour ${tourId}:`, error);
      setTourData((prev) => ({
        ...prev,
        [tourId]: { image: null, title: null, location: null },
      }));
    }
  };

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings({
        status: statusMapping[currentTab],
        page: page,
        limit: 10,
      });

      setBookings(response.data.bookings);
      setPagination(response.data.pagination);

      const uniqueTourIds = [
        ...new Set(response.data.bookings.map((booking) => booking.tour)),
      ];
      uniqueTourIds.forEach((tourId) => {
        if (tourId) fetchTourData(tourId);
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "confirmed":
        return {
          ...bookingCardStyles.badgeBase,
          backgroundColor: "rgba(99, 102, 241, 0.12)",
          color: "#4f46e5",
        };
      case "pending":
        return {
          ...bookingCardStyles.badgeBase,
          backgroundColor: "rgba(245, 158, 11, 0.14)",
          color: "#b45309",
        };
      case "cancelled":
        return {
          ...bookingCardStyles.badgeBase,
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          color: "#dc2626",
        };
      default:
        return {
          ...bookingCardStyles.badgeBase,
          backgroundColor: "#f3f4f6",
          color: "#526071",
        };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Approved";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingUpdated = () => {
    fetchBookings(pagination.currentPage);
  };

  const handleDelete = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBookingToDelete(null);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete?._id) return;

    try {
      setDeleting(true);
      await bookingService.deleteBooking(bookingToDelete._id);
      setShowDeleteModal(false);
      setBookingToDelete(null);
      fetchBookings(pagination.currentPage);
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError("Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBookings = bookings.filter((booking) => {
    if (!normalizedSearch) return true;

    const tour = tourData[booking.tour];
    const haystack = [
      booking.bookingReference,
      booking._id,
      tour?.title || booking.tourTitle,
      tour?.location,
      booking.customerInfo?.firstName,
      booking.customerInfo?.lastName,
      booking.customerInfo?.email,
      booking.customerInfo?.specialRequests,
      booking.tripType,
      booking.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  const getGuestBreakdown = (booking) =>
    [
      { label: "Adults", value: booking.adults || 0 },
      { label: "Youth", value: booking.youth || 0 },
      { label: "Children", value: booking.children || 0 },
    ].filter((guestGroup) => guestGroup.value > 0);

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
            searchPlaceholder='Search bookings by guest, tour, email, or ID'
          />

          <div className='dashboard__content_content'>
            <h1 className='text-30'>My Booking</h1>
            <p>Manage your tour bookings and reservations.</p>

            <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-60'>
              <div className='tabs -underline-2 js-tabs'>
                <div className='tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls'>
                  {tabs.map((elm, i) => (
                    <div
                      key={i}
                      className='col-auto'
                      onClick={() => setCurrentTab(elm)}>
                      <button
                        className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 js-tabs-button ${
                          elm == currentTab ? "is-tab-el-active" : ""
                        }`}>
                        {elm}
                      </button>
                    </div>
                  ))}
                </div>

                <div className='tabs__content js-tabs-content'>
                  <div className='tabs__pane -tab-item-1 is-tab-el-active'>
                    {loading ? (
                      <div className='text-center py-40'>
                        Loading bookings...
                      </div>
                    ) : error ? (
                      <div className='text-center py-40 text-red-1'>
                        {error}
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className='text-center py-40'>
                        No bookings found for {currentTab.toLowerCase()} status.
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className='text-center py-40'>
                        No bookings on this page match your search.
                      </div>
                    ) : (
                      <>
                        <div className='overflowAuto'>
                          <table
                            className='tableTest mb-30'
                            style={{ minWidth: "1300px", width: "100%" }}>
                            <thead className='bg-light-1 rounded-12'>
                              <tr>
                                <th
                                  className='py-20'
                                  style={{ width: "140px", minWidth: "140px" }}>
                                  Booking ID
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "300px", minWidth: "300px" }}>
                                  Tour & Customer
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "120px", minWidth: "120px" }}>
                                  Trip Type
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "130px", minWidth: "130px" }}>
                                  Start Date
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "130px", minWidth: "130px" }}>
                                  End Date
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "120px", minWidth: "120px" }}>
                                  Guests
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "180px", minWidth: "180px" }}>
                                  Special Requests
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "100px", minWidth: "100px" }}>
                                  Price
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "120px", minWidth: "120px" }}>
                                  Status
                                </th>
                                <th
                                  className='py-20'
                                  style={{ width: "100px", minWidth: "100px" }}>
                                  Action
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {filteredBookings.map((booking, i) => {
                                const tour = tourData[booking.tour];

                                return (
                                  <tr
                                    key={booking._id}
                                    className='border-bottom-light'>
                                    <td
                                      className='py-20'
                                      style={{
                                        width: "140px",
                                        minWidth: "140px",
                                      }}>
                                      <div className='fw-600 text-16'>
                                        {booking.bookingReference ||
                                          `#${booking._id
                                            .slice(-6)
                                            .toUpperCase()}`}
                                      </div>
                                      <div className='text-14 text-light-2 mt-5'>
                                        {new Date(
                                          booking.createdAt
                                        ).toLocaleDateString()}
                                      </div>
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "300px",
                                        minWidth: "300px",
                                      }}>
                                      <div className='d-flex items-center'>
                                        <div className='size-80 rounded-12 overflow-hidden mr-15'>
                                          {tour?.image ? (
                                            <Image
                                              width={80}
                                              height={80}
                                              src={tour.image}
                                              alt={
                                                tour.title || booking.tourTitle
                                              }
                                              className='w-full h-full object-cover'
                                              unoptimized={true}
                                            />
                                          ) : (
                                            <div className='w-full h-full bg-light-2 flex-center'>
                                              <i className='icon-destination text-24 text-accent-1'></i>
                                            </div>
                                          )}
                                        </div>
                                        <div className='flex-1'>
                                          <div className='fw-600 text-16 mb-5 text-dark-1'>
                                            {tour?.title || booking.tourTitle}
                                          </div>
                                          {tour?.location && (
                                            <div className='text-12 text-light-2 mb-10 d-flex items-center'>
                                              <i className='icon-location mr-5'></i>
                                              {tour.location}
                                            </div>
                                          )}
                                          <div style={bookingCardStyles.label}>
                                            Customer
                                          </div>
                                          <div className='text-14 text-dark-1 mt-4 mb-4'>
                                            {booking.customerInfo?.firstName}{" "}
                                            {booking.customerInfo?.lastName}
                                          </div>
                                          <div className='text-13 text-light-2'>
                                            {booking.customerInfo?.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "120px",
                                        minWidth: "120px",
                                      }}>
                                      <div
                                        style={{
                                          ...bookingCardStyles.badgeBase,
                                          backgroundColor:
                                            booking.tripType === "round-trip"
                                              ? "rgba(234, 60, 60, 0.1)"
                                              : "#f3f4f6",
                                          color:
                                            booking.tripType === "round-trip"
                                              ? "#ea3c3c"
                                              : "#1f2557",
                                        }}>
                                        <i
                                          className={`${
                                            booking.tripType === "round-trip"
                                              ? "icon-arrow-left-right"
                                              : "icon-arrow-right"
                                          } mr-8`}></i>
                                        {booking.tripType === "round-trip"
                                          ? "Round Trip"
                                          : "One Way"}
                                      </div>
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "130px",
                                        minWidth: "130px",
                                      }}>
                                      <div style={bookingCardStyles.label}>
                                        Starts
                                      </div>
                                      <div className='fw-600 text-15 text-dark-1 mt-6 mb-4'>
                                        {formatDate(booking.startDate)}
                                      </div>
                                      <div className='text-13 text-light-2 d-flex items-center'>
                                        <i className='icon-clock mr-5'></i>
                                        {booking.startTime ||
                                          booking.selectedTime}
                                      </div>
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "130px",
                                        minWidth: "130px",
                                      }}>
                                      {booking.tripType === "round-trip" &&
                                      booking.returnDate ? (
                                        <>
                                          <div style={bookingCardStyles.label}>
                                            Returns
                                          </div>
                                          <div className='fw-600 text-15 text-dark-1 mt-6 mb-4'>
                                            {formatDate(booking.returnDate)}
                                          </div>
                                          <div className='text-13 text-light-2 d-flex items-center'>
                                            <i className='icon-clock mr-5'></i>
                                            {booking.returnTime}
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          style={{
                                            ...bookingCardStyles.badgeBase,
                                            backgroundColor: "#f8fafc",
                                            color: "#64748b",
                                            padding: "8px 10px",
                                          }}>
                                          Same day
                                        </div>
                                      )}
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "120px",
                                        minWidth: "120px",
                                      }}>
                                      <div className='fw-600 text-15 text-dark-1 mb-6'>
                                        {booking.totalGuests} Guest
                                        {booking.totalGuests !== 1 ? "s" : ""}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "6px",
                                        }}>
                                        {getGuestBreakdown(booking).map(
                                          (guestGroup) => (
                                            <div
                                              key={guestGroup.label}
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: "10px",
                                                fontSize: "12px",
                                                lineHeight: 1.2,
                                              }}>
                                              <span className='text-light-2'>
                                                {guestGroup.label}
                                              </span>
                                              <span className='text-dark-1 fw-500'>
                                                {guestGroup.value}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "180px",
                                        minWidth: "180px",
                                      }}>
                                      {booking.customerInfo?.specialRequests ? (
                                        <div
                                          title={
                                            booking.customerInfo.specialRequests
                                          }
                                          style={{
                                            border: "1px solid #e5e7eb",
                                            backgroundColor: "#fafafa",
                                            borderRadius: "14px",
                                            padding: "12px 14px",
                                            maxWidth: "170px",
                                          }}>
                                          <div style={bookingCardStyles.label}>
                                            Request
                                          </div>
                                          <div
                                            className='text-13 text-dark-1 mt-6'
                                            style={{
                                              display: "-webkit-box",
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                              wordBreak: "break-word",
                                            }}>
                                            {booking.customerInfo.specialRequests}
                                          </div>
                                        </div>
                                      ) : (
                                        <span
                                          style={{
                                            ...bookingCardStyles.metaChip,
                                            backgroundColor: "#fafafa",
                                          }}>
                                          No requests
                                        </span>
                                      )}
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "100px",
                                        minWidth: "100px",
                                      }}>
                                      <div style={bookingCardStyles.label}>
                                        Total
                                      </div>
                                      <div className='fw-600 text-18 text-dark-1 mt-6'>
                                        ${booking.totalAmount}
                                      </div>
                                      <div className='text-12 text-light-2'>
                                        {booking.paymentInfo?.currency || "USD"}
                                      </div>
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "120px",
                                        minWidth: "120px",
                                      }}>
                                      <div
                                        style={getStatusBadgeStyle(
                                          booking.status
                                        )}>
                                        {getStatusLabel(booking.status)}
                                      </div>
                                      {booking.paymentInfo?.status && (
                                        <div className='text-12 text-light-2 mt-8'>
                                          Payment: {booking.paymentInfo.status}
                                        </div>
                                      )}
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "100px",
                                        minWidth: "100px",
                                      }}>
                                      <div style={bookingCardStyles.actionRow}>
                                        <button
                                          onClick={() => handleEdit(booking)}
                                          className='button -dark-1 size-40 bg-light-1 rounded-full flex-center hover:bg-accent-1 hover:text-white transition-all'
                                          title='Edit booking'>
                                          <i className='icon-pencil text-16'></i>
                                        </button>

                                        <button
                                          onClick={() => handleDelete(booking)}
                                          className='button -dark-1 size-40 bg-light-1 rounded-full flex-center hover:bg-red-1 hover:text-white transition-all'
                                          title='Delete booking'>
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

                        {!searchTerm && (
                          <>
                            <Pagination
                              currentPage={pagination.currentPage}
                              totalPages={pagination.totalPages}
                              onPageChange={fetchBookings}
                            />

                            <div className='text-14 text-center mt-20'>
                              Showing results{" "}
                              {(pagination.currentPage - 1) * 10 + 1}-
                              {Math.min(
                                pagination.currentPage * 10,
                                pagination.total
                              )}{" "}
                              of {pagination.total}
                            </div>
                          </>
                        )}

                        {searchTerm && (
                          <div className='text-14 text-center mt-20'>
                            Showing {filteredBookings.length} matching booking
                            {filteredBookings.length === 1 ? "" : "s"} on this
                            page
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className='text-center pt-30'>
              © Copyright Rapid Eases {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditBookingModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          booking={selectedBooking}
          onBookingUpdated={handleBookingUpdated}
        />

        {showDeleteModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
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
              }}>
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

              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: "12px",
                  color: "#1f2937",
                }}>
                Delete Booking?
              </h3>

              <p
                style={{
                  fontSize: "16px",
                  textAlign: "center",
                  marginBottom: "8px",
                  color: "#6b7280",
                  lineHeight: "1.5",
                }}>
                Are you sure you want to delete booking{" "}
                <strong style={{ color: "#1f2937" }}>
                  "
                  {bookingToDelete?.bookingReference ||
                    `#${bookingToDelete?._id?.slice(-6)?.toUpperCase() || ""}`}
                  "
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
                    opacity: deleting ? 0.6 : 1,
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
                    opacity: deleting ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
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
                      Delete Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
