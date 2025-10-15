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

export default function DbBooking() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("Approved");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-purple-1";
      case "pending":
        return "text-yellow-1";
      case "cancelled":
        return "text-red-2";
      default:
        return "text-gray-1";
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

  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await bookingService.deleteBooking(bookingId);
        fetchBookings(pagination.currentPage);
      } catch (err) {
        console.error("Error deleting booking:", err);
        alert("Failed to delete booking");
      }
    }
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
                              {bookings.map((booking, i) => {
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
                                          <div className='fw-500 text-16 mb-5'>
                                            {tour?.title || booking.tourTitle}
                                          </div>
                                          {tour?.location && (
                                            <div className='text-12 text-light-2 mb-5 d-flex items-center'>
                                              <i className='icon-location mr-5'></i>
                                              {tour.location}
                                            </div>
                                          )}
                                          <div className='text-14 text-light-2 mb-5'>
                                            Customer:{" "}
                                            {booking.customerInfo?.firstName}{" "}
                                            {booking.customerInfo?.lastName}
                                          </div>
                                          <div className='text-12 text-light-2'>
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
                                        className={`px-10 py-8 rounded-8 text-12 fw-500 d-inline-flex items-center ${
                                          booking.tripType === "round-trip"
                                            ? "bg-accent-1-05 text-accent-1"
                                            : "bg-light-2 text-dark-1"
                                        }`}>
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
                                      <div className='fw-500 text-15 mb-5'>
                                        {formatDate(booking.startDate)}
                                      </div>
                                      <div className='text-14 text-light-2 d-flex items-center'>
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
                                          <div className='fw-500 text-15 mb-5'>
                                            {formatDate(booking.returnDate)}
                                          </div>
                                          <div className='text-14 text-light-2 d-flex items-center'>
                                            <i className='icon-clock mr-5'></i>
                                            {booking.returnTime}
                                          </div>
                                        </>
                                      ) : (
                                        <span className='text-light-2 text-14'>
                                          Same day
                                        </span>
                                      )}
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "120px",
                                        minWidth: "120px",
                                      }}>
                                      <div className='fw-500 text-15 mb-5'>
                                        {booking.totalGuests} Guest
                                        {booking.totalGuests !== 1 ? "s" : ""}
                                      </div>
                                      <div className='text-12 text-light-2'>
                                        {booking.adults > 0 &&
                                          `${booking.adults} Adults`}
                                        {booking.youth > 0 &&
                                          ` • ${booking.youth} Youth`}
                                        {booking.children > 0 &&
                                          ` • ${booking.children} Children`}
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
                                          className='text-13 text-dark-1'
                                          title={
                                            booking.customerInfo.specialRequests
                                          }
                                          style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            wordBreak: "break-word",
                                            maxWidth: "160px",
                                          }}>
                                          {booking.customerInfo.specialRequests}
                                        </div>
                                      ) : (
                                        <span className='text-light-2 text-14'>
                                          None
                                        </span>
                                      )}
                                    </td>

                                    <td
                                      className='py-20'
                                      style={{
                                        width: "100px",
                                        minWidth: "100px",
                                      }}>
                                      <div className='fw-600 text-18 text-dark-1'>
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
                                        className={`circle fw-500 ${getStatusColor(
                                          booking.status
                                        )}`}>
                                        {getStatusLabel(booking.status)}
                                      </div>
                                      {booking.paymentInfo?.status && (
                                        <div className='text-12 text-light-2 mt-5'>
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
                                      <div className='d-flex items-center gap-10'>
                                        <button
                                          onClick={() => handleEdit(booking)}
                                          className='button -dark-1 size-40 bg-light-1 rounded-full flex-center hover:bg-accent-1 hover:text-white transition-all'
                                          title='Edit booking'>
                                          <i className='icon-pencil text-16'></i>
                                        </button>

                                        <button
                                          onClick={() =>
                                            handleDelete(booking._id)
                                          }
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
      </div>
    </ProtectedRoute>
  );
}
