// "use client";

// import React, { useEffect, useState } from "react";
// import Calender from "../common/dropdownSearch/Calender";
// import Image from "next/image";
// import { times } from "@/data/tourSingleContent";

// // Import the BookingModal component
// import BookingModal from "../../components/modals/BookingModal";

// export default function TourSingleSidebar({ tour }) {
//   // Trip type state
//   const [tripType, setTripType] = useState("one-way"); // 'one-way' or 'round-trip'

//   // Use pricing from tour data - GROUP PRICING STRUCTURE
//   const pricing = {
//     groupBasePrice: tour?.pricing?.basePrice || 85 || 85, // Base price for 1-4 people
//     perPersonRate: tour?.pricing?.perPersonRate || 25 || 25, // Rate per additional person over 4
//     extraService: 40,
//     servicePerPerson: 40,
//   };

//   // Start all quantities at 0
//   const [adultNumber, setAdultNumber] = useState(0);
//   const [youthNumber, setYouthNumber] = useState(0);
//   const [childrenNumber, setChildrenNumber] = useState(0);
//   const [isExtraService, setisExtraService] = useState(false);
//   const [isServicePerPerson, setIsServicePerPerson] = useState(false);

//   // Modal state
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

//   // Date and time state
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [returnDate, setReturnDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState("");
//   const [returnTime, setReturnTime] = useState(""); // Add return time
//   const [activeTimeDD, setActiveTimeDD] = useState(false);
//   const [activeReturnTimeDD, setActiveReturnTimeDD] = useState(false); // Add return time dropdown state

//   // Handle trip type change
//   const handleTripTypeChange = (type) => {
//     setTripType(type);
//     if (type === "one-way") {
//       setReturnDate(null);
//       setReturnTime(""); // Clear return time when switching to one-way
//     }
//   };

//   // Calculate total people
//   const totalPeople = adultNumber + youthNumber + childrenNumber;

//   // Calculate base tour price using group pricing logic
//   const calculateBaseTourPrice = () => {
//     if (totalPeople === 0) return 0;

//     if (totalPeople <= 4) {
//       // Group pricing for 1-4 people - same price regardless of exact count
//       return pricing.groupBasePrice;
//     } else {
//       // Base price for first 4 people + additional per person charges
//       const extraPeople = totalPeople - 4;
//       return pricing.groupBasePrice + extraPeople * pricing.perPersonRate;
//     }
//   };

//   // Calculate total with all factors (trip type, extras)
//   const calculateTotal = () => {
//     let baseTotal = calculateBaseTourPrice();

//     // Apply round trip multiplier
//     if (tripType === "round-trip") {
//       baseTotal *= 2;
//     }

//     // Add extra services
//     let extraCharges = 0;
//     if (isExtraService) {
//       extraCharges += pricing.extraService;
//     }
//     if (isServicePerPerson) {
//       extraCharges += pricing.servicePerPerson;
//     }

//     return baseTotal + extraCharges;
//   };

//   const totalAmount = calculateTotal();

//   // Prepare booking data for modal
//   const bookingData = {
//     adults: adultNumber,
//     youth: youthNumber,
//     children: childrenNumber,
//     isExtraService,
//     isServicePerPerson,
//     totalAmount,
//     selectedTime,
//     selectedDate,
//     tripType,
//     returnDate,
//     returnTime, // Add return time to booking data
//     // Add pricing structure info for the modal
//     pricingType: totalPeople <= 4 ? "group" : "mixed",
//     groupBasePrice: pricing.groupBasePrice,
//     perPersonRate: pricing.perPersonRate,
//   };

//   const handleBookNow = () => {
//     // Add this debugging BEFORE your existing validation
//     console.log("🔍 State values at booking time:");
//     console.log("🔍 tripType:", tripType);
//     console.log("🔍 selectedDate:", selectedDate);
//     console.log("🔍 selectedTime:", selectedTime);
//     console.log("🔍 returnDate:", returnDate);
//     console.log("🔍 returnTime:", returnTime);
//     console.log("🔍 Current bookingData:", {
//       adults: adultNumber,
//       youth: youthNumber,
//       children: childrenNumber,
//       isExtraService,
//       isServicePerPerson,
//       totalAmount,
//       selectedTime,
//       selectedDate,
//       tripType,
//       returnDate,
//       returnTime,
//       pricingType: totalPeople <= 4 ? "group" : "mixed",
//       groupBasePrice: pricing.groupBasePrice,
//       perPersonRate: pricing.perPersonRate,
//     });

//     // Check if at least one person is selected
//     if (totalPeople === 0) {
//       alert("Please select at least one guest before booking.");
//       return;
//     }

//     // Check if date is selected
//     if (!selectedDate) {
//       alert("Please select a pick up date for your tour.");
//       return;
//     }

//     // Check if return date is selected for round trips
//     if (tripType === "round-trip" && !returnDate) {
//       alert("Please select a return date for your round trip.");
//       return;
//     }

//     // Check if time is selected
//     if (!selectedTime) {
//       alert("Please select a pick up time for your tour.");
//       return;
//     }

//     // Check if return time is selected for round trips
//     if (tripType === "round-trip" && !returnTime) {
//       alert("Please select a return time for your round trip.");
//       return;
//     }

//     setIsBookingModalOpen(true);
//   };

//   // const handleBookingSuccess = async (bookingPayload) => {
//   //   try {
//   //     console.log("Processing booking:", bookingPayload);

//   //     const response = await fetch("/api/bookings", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(bookingPayload),
//   //     });

//   //     if (response.ok) {
//   //       const result = await response.json();
//   //       console.log("Booking created successfully:", result);

//   //       // Reset the form
//   //       setAdultNumber(0);
//   //       setYouthNumber(0);
//   //       setChildrenNumber(0);
//   //       setisExtraService(false);
//   //       setIsServicePerPerson(false);
//   //       setSelectedTime("");
//   //       setSelectedDate(null);
//   //       setReturnDate(null);
//   //       setReturnTime(""); // Reset return time
//   //       setTripType("one-way");
//   //     } else {
//   //       const error = await response.json();
//   //       console.error("Booking failed:", error);
//   //       alert("Booking failed: " + error.message);
//   //     }
//   //   } catch (error) {
//   //     console.error("Booking error:", error);
//   //     alert("There was an error processing your booking. Please try again.");
//   //   }
//   // };

//   const handleBookingSuccess = async (result) => {
//     try {
//       console.log("Processing booking result:", result);

//       // The booking has already been created by the modal
//       // Just handle the success case
//       if (result.booking || result.paymentStatus === "completed") {
//         console.log("Booking created successfully:", result);

//         // Reset the form
//         setAdultNumber(0);
//         setYouthNumber(0);
//         setChildrenNumber(0);
//         setisExtraService(false);
//         setIsServicePerPerson(false);
//         setSelectedTime("");
//         setSelectedDate(null);
//         setReturnDate(null);
//         setReturnTime("");
//         setTripType("one-way");
//       }
//     } catch (error) {
//       console.error("Booking error:", error);
//       alert("There was an error processing your booking. Please try again.");
//     }
//   };

//   return (
//     <>
//       <div className='tourSingleSidebar'>
//         <div className='d-flex items-center'>
//           <div>From</div>
//           <div className='text-20 fw-500 ml-10'>${pricing.groupBasePrice}</div>
//           <div className='text-14 text-light-2 ml-5'>(1-4 people)</div>
//         </div>

//         {/* Trip Type Selection */}
//         <div className='mt-20 mb-20'>
//           <h5 className='text-16 fw-500 mb-15'>Trip Type</h5>
//           <div className='d-flex gap-10'>
//             <button
//               onClick={() => handleTripTypeChange("one-way")}
//               className={`button -sm px-15 py-10 rounded-8 ${
//                 tripType === "one-way"
//                   ? "-dark-1 bg-accent-1 text-white"
//                   : "-outline-accent-1 text-accent-1"
//               }`}
//               type='button'>
//               One Way
//             </button>
//             <button
//               onClick={() => handleTripTypeChange("round-trip")}
//               className={`button -sm px-15 py-10 rounded-8 ml-10 ${
//                 tripType === "round-trip"
//                   ? "-dark-1 bg-accent-1 text-white"
//                   : "-outline-accent-1 text-accent-1"
//               }`}
//               type='button'>
//               Round Trip
//             </button>
//           </div>
//         </div>

//         <div className='searchForm -type-1 -sidebar mt-20'>
//           <div className='searchForm__form'>
//             {/* Pick Up Date */}
//             <div className='searchFormItem js-select-control js-form-dd js-calendar'>
//               <div className='searchFormItem__button' data-x-click='calendar'>
//                 <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
//                   <i className='text-20 icon-calendar'></i>
//                 </div>
//                 <div className='searchFormItem__content'>
//                   <h5>
//                     {tripType === "round-trip" ? "Pick Up Date" : "Pick Up"}
//                   </h5>
//                   <div>
//                     <span className='js-first-date'>
//                       <Calender
//                         onDateChange={setSelectedDate}
//                         allowCurrentDate={true}
//                         singleDateSelection={true}
//                       />
//                     </span>
//                   </div>
//                 </div>
//                 <div className='searchFormItem__icon_chevron'>
//                   <i className='icon-chevron-down d-flex text-18'></i>
//                 </div>
//               </div>
//             </div>

//             {/* Return Date (only for round trip) */}
//             {tripType === "round-trip" && (
//               <div className='searchFormItem js-select-control js-form-dd js-calendar mt-15'>
//                 <div className='searchFormItem__button' data-x-click='calendar'>
//                   <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
//                     <i className='text-20 icon-calendar'></i>
//                   </div>
//                   <div className='searchFormItem__content'>
//                     <h5>Return Date</h5>
//                     <div>
//                       <span className='js-first-date'>
//                         <Calender
//                           onDateChange={setReturnDate}
//                           allowCurrentDate={true}
//                           singleDateSelection={true}
//                           minDate={selectedDate}
//                         />
//                       </span>
//                     </div>
//                   </div>
//                   <div className='searchFormItem__icon_chevron'>
//                     <i className='icon-chevron-down d-flex text-18'></i>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Pick Up Time Selection */}
//             <div className='searchFormItem js-select-control js-form-dd mt-15'>
//               <div
//                 className='searchFormItem__button'
//                 onClick={() => setActiveTimeDD((pre) => !pre)}
//                 data-x-click='time'>
//                 <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
//                   <i className='text-20 icon-clock'></i>
//                 </div>
//                 <div className='searchFormItem__content'>
//                   <h5>{tripType === "round-trip" ? "Pick Up Time" : "Time"}</h5>
//                   <div className='js-select-control-chosen'>
//                     {selectedTime ? selectedTime : "Choose time"}
//                   </div>
//                 </div>
//                 <div className='searchFormItem__icon_chevron'>
//                   <i className='icon-chevron-down d-flex text-18'></i>
//                 </div>
//               </div>

//               <div
//                 className={`searchFormItemDropdown -tour-type ${
//                   activeTimeDD ? "is-active" : ""
//                 }`}
//                 data-x='time'
//                 data-x-toggle='is-active'>
//                 <div className='searchFormItemDropdown__container'>
//                   <div className='searchFormItemDropdown__list sroll-bar-1'>
//                     {times.map((elm, i) => (
//                       <div
//                         key={i}
//                         onClick={() => {
//                           setSelectedTime((pre) => (pre == elm ? "" : elm));
//                           setActiveTimeDD(false);
//                         }}
//                         className='searchFormItemDropdown__item'>
//                         <button className='js-select-control-button'>
//                           <span className='js-select-control-choice'>
//                             {elm}
//                           </span>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Return Time Selection (only for round trip) */}
//             {tripType === "round-trip" && (
//               <div className='searchFormItem js-select-control js-form-dd mt-15'>
//                 <div
//                   className='searchFormItem__button'
//                   onClick={() => setActiveReturnTimeDD((pre) => !pre)}
//                   data-x-click='return-time'>
//                   <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
//                     <i className='text-20 icon-clock'></i>
//                   </div>
//                   <div className='searchFormItem__content'>
//                     <h5>Return Time</h5>
//                     <div className='js-select-control-chosen'>
//                       {returnTime ? returnTime : "Choose return time"}
//                     </div>
//                   </div>
//                   <div className='searchFormItem__icon_chevron'>
//                     <i className='icon-chevron-down d-flex text-18'></i>
//                   </div>
//                 </div>

//                 <div
//                   className={`searchFormItemDropdown -tour-type ${
//                     activeReturnTimeDD ? "is-active" : ""
//                   }`}
//                   data-x='return-time'
//                   data-x-toggle='is-active'>
//                   <div className='searchFormItemDropdown__container'>
//                     <div className='searchFormItemDropdown__list sroll-bar-1'>
//                       {times.map((elm, i) => (
//                         <div
//                           key={i}
//                           onClick={() => {
//                             setReturnTime((pre) => (pre == elm ? "" : elm));
//                             setActiveReturnTimeDD(false);
//                           }}
//                           className='searchFormItemDropdown__item'>
//                           <button className='js-select-control-button'>
//                             <span className='js-select-control-choice'>
//                               {elm}
//                             </span>
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <h5 className='text-18 fw-500 mb-20 mt-20'>Guests</h5>

//         {/* Group Pricing Information */}
//         <div className='bg-light-1 rounded-8 p-15 mb-20'>
//           <div className='text-14 fw-500 mb-5'>Pricing Structure:</div>
//           <div className='text-13 text-light-2'>
//             • 1-4 people: ${pricing.groupBasePrice} (group rate)
//             {totalPeople > 4 && (
//               <div className='text-13 text-light-2 mt-5'>
//                 • 5+ people: +${pricing.perPersonRate} per additional person
//               </div>
//             )}
//           </div>
//         </div>

//         <div>
//           <div className='d-flex items-center justify-between'>
//             <div className='text-14'>
//               Adult (18+ years)
//               {totalPeople <= 4 ? (
//                 <span className='text-12 text-light-2 ml-5'>
//                   (included in group rate)
//                 </span>
//               ) : adultNumber > 0 ? (
//                 <span className='fw-500 ml-5'>
//                   {adultNumber <= 4
//                     ? "Included"
//                     : `+$${(
//                         (adultNumber -
//                           Math.min(
//                             4,
//                             totalPeople - youthNumber - childrenNumber
//                           )) *
//                         pricing.perPersonRate *
//                         (tripType === "round-trip" ? 2 : 1)
//                       ).toFixed(2)}`}
//                 </span>
//               ) : null}
//             </div>

//             <div className='d-flex items-center js-counter'>
//               <button
//                 onClick={() =>
//                   setAdultNumber((pre) => (pre > 0 ? pre - 1 : pre))
//                 }
//                 className='button size-30 border-1 rounded-full js-down'>
//                 <i className='icon-minus text-10'></i>
//               </button>

//               <div className='flex-center ml-10 mr-10'>
//                 <div className='text-14 size-20 js-count'>{adultNumber}</div>
//               </div>

//               <button
//                 onClick={() => setAdultNumber((pre) => pre + 1)}
//                 className='button size-30 border-1 rounded-full js-up'>
//                 <i className='icon-plus text-10'></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className='mt-15'>
//           <div className='d-flex items-center justify-between'>
//             <div className='text-14'>
//               Youth (13-17 years)
//               {totalPeople <= 4 ? (
//                 <span className='text-12 text-light-2 ml-5'>
//                   (included in group rate)
//                 </span>
//               ) : youthNumber > 0 ? (
//                 <span className='fw-500 ml-5'>
//                   {youthNumber <= 4
//                     ? "Included"
//                     : `+$${(
//                         (youthNumber -
//                           Math.min(
//                             4,
//                             totalPeople - adultNumber - childrenNumber
//                           )) *
//                         pricing.perPersonRate *
//                         (tripType === "round-trip" ? 2 : 1)
//                       ).toFixed(2)}`}
//                 </span>
//               ) : null}
//             </div>

//             <div className='d-flex items-center js-counter'>
//               <button
//                 onClick={() =>
//                   setYouthNumber((pre) => (pre > 0 ? pre - 1 : pre))
//                 }
//                 className='button size-30 border-1 rounded-full js-down'>
//                 <i className='icon-minus text-10'></i>
//               </button>

//               <div className='flex-center ml-10 mr-10'>
//                 <div className='text-14 size-20 js-count'>{youthNumber}</div>
//               </div>

//               <button
//                 onClick={() => setYouthNumber((pre) => pre + 1)}
//                 className='button size-30 border-1 rounded-full js-up'>
//                 <i className='icon-plus text-10'></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className='mt-15'>
//           <div className='d-flex items-center justify-between'>
//             <div className='text-14'>
//               Children (0-12 years)
//               {totalPeople <= 4 ? (
//                 <span className='text-12 text-light-2 ml-5'>
//                   (included in group rate)
//                 </span>
//               ) : childrenNumber > 0 ? (
//                 <span className='fw-500 ml-5'>
//                   {childrenNumber <= 4
//                     ? "Included"
//                     : `+$${(
//                         (childrenNumber -
//                           Math.min(
//                             4,
//                             totalPeople - adultNumber - youthNumber
//                           )) *
//                         pricing.perPersonRate *
//                         (tripType === "round-trip" ? 2 : 1)
//                       ).toFixed(2)}`}
//                 </span>
//               ) : null}
//             </div>

//             <div className='d-flex items-center js-counter'>
//               <button
//                 onClick={() =>
//                   setChildrenNumber((pre) => (pre > 0 ? pre - 1 : pre))
//                 }
//                 className='button size-30 border-1 rounded-full js-down'>
//                 <i className='icon-minus text-10'></i>
//               </button>

//               <div className='flex-center ml-10 mr-10'>
//                 <div className='text-14 size-20 js-count'>{childrenNumber}</div>
//               </div>

//               <button
//                 onClick={() => setChildrenNumber((pre) => pre + 1)}
//                 className='button size-30 border-1 rounded-full js-up'>
//                 <i className='icon-plus text-10'></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Group Size Indicator */}
//         <div className='mt-15 p-15 bg-light-1 rounded-8'>
//           <div className='text-14 fw-500 d-flex items-center justify-between'>
//             <span>Total Guests: {totalPeople}</span>
//             <span className='text-accent-1'>
//               {totalPeople <= 4
//                 ? "Group Rate"
//                 : `Group + ${totalPeople - 4} Extra`}
//             </span>
//           </div>
//           {totalPeople > 4 && (
//             <div className='text-12 text-light-2 mt-5'>
//               First 4 people: ${pricing.groupBasePrice} | Extra{" "}
//               {totalPeople - 4}: +$
//               {((totalPeople - 4) * pricing.perPersonRate).toFixed(2)}
//             </div>
//           )}
//         </div>

//         {/* Round Trip Indicator */}
//         {tripType === "round-trip" && (
//           <div className='mt-15 p-15 bg-accent-1-05 rounded-8'>
//             <div className='text-14 text-accent-1 fw-500 d-flex items-center'>
//               <i className='icon-arrow-left-right text-16 mr-10'></i>
//               Round Trip - Prices doubled
//             </div>
//           </div>
//         )}

//         <h5 className='text-18 fw-500 mb-20 mt-20'>Add Extra</h5>

//         <div className='d-flex items-center justify-between'>
//           <div className='d-flex items-center'>
//             <div className='form-checkbox'>
//               <input
//                 checked={isExtraService ? true : false}
//                 onChange={() => setisExtraService((pre) => !pre)}
//                 type='checkbox'
//               />
//               <div className='form-checkbox__mark'>
//                 <div className='form-checkbox__icon'>
//                   <Image
//                     width='10'
//                     height='8'
//                     src='/img/icons/check.svg'
//                     alt='icon'
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className='ml-10'>Add Service per booking</div>
//           </div>

//           <div className='text-14'>${pricing.extraService}</div>
//         </div>

//         <div className='d-flex justify-between mt-20'>
//           <div className='d-flex'>
//             <div className='form-checkbox mt-5'>
//               <input
//                 checked={isServicePerPerson ? true : false}
//                 onChange={() => setIsServicePerPerson((pre) => !pre)}
//                 type='checkbox'
//               />
//               <div className='form-checkbox__mark'>
//                 <div className='form-checkbox__icon'>
//                   <Image
//                     width='10'
//                     height='8'
//                     src='/img/icons/check.svg'
//                     alt='icon'
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className='ml-10'>
//               Add Service per person
//               <div className='lh-16'>
//                 Adult: <span className='fw-500'>$17.00</span> - Youth:{" "}
//                 <span className='fw-500'>$14.00</span>
//               </div>
//             </div>
//           </div>

//           <div className='text-14'>${pricing.servicePerPerson}</div>
//         </div>

//         <div className='line mt-20 mb-20'></div>

//         <div className='d-flex items-center justify-between'>
//           <div className='text-18 fw-500'>Total:</div>
//           <div className='text-18 fw-500'>${totalAmount.toFixed(2)}</div>
//         </div>

//         <button
//           onClick={handleBookNow}
//           className='button -md -dark-1 col-12 bg-accent-1 text-white mt-20'>
//           Book Now
//           <i className='icon-arrow-top-right ml-10'></i>
//         </button>
//       </div>

//       {/* Booking Modal */}
//       <BookingModal
//         isOpen={isBookingModalOpen}
//         onClose={() => setIsBookingModalOpen(false)}
//         bookingData={bookingData}
//         tour={tour}
//         onBookingSuccess={handleBookingSuccess}
//       />
//     </>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Calender from "../common/dropdownSearch/Calender";
import Image from "next/image";
import { times } from "@/data/tourSingleContent";

// Import the BookingModal component
import BookingModal from "../../components/modals/BookingModal";

export default function TourSingleSidebar({ tour }) {
  // Trip type state
  const [tripType, setTripType] = useState("one-way"); // 'one-way' or 'round-trip'

  // Use pricing from tour data - GROUP PRICING STRUCTURE
  const pricing = {
    groupBasePrice: tour?.pricing?.basePrice || 85 || 85, // Base price for 1-4 people
    perPersonRate: tour?.pricing?.perPersonRate || 25 || 25, // Rate per additional person over 4
    extraService: 40,
    servicePerPerson: 40,
  };

  // Start all quantities at 0
  const [adultNumber, setAdultNumber] = useState(0);
  const [youthNumber, setYouthNumber] = useState(0);
  const [childrenNumber, setChildrenNumber] = useState(0);
  const [isExtraService, setisExtraService] = useState(false);
  const [isServicePerPerson, setIsServicePerPerson] = useState(false);

  // Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Add state for current booking data
  const [currentBookingData, setCurrentBookingData] = useState(null);

  // Date and time state
  const [selectedDate, setSelectedDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [returnTime, setReturnTime] = useState(""); // Add return time
  const [activeTimeDD, setActiveTimeDD] = useState(false);
  const [activeReturnTimeDD, setActiveReturnTimeDD] = useState(false); // Add return time dropdown state

  // Handle trip type change
  const handleTripTypeChange = (type) => {
    setTripType(type);
    if (type === "one-way") {
      setReturnDate(null);
      setReturnTime(""); // Clear return time when switching to one-way
    }
  };

  // Calculate total people
  const totalPeople = adultNumber + youthNumber + childrenNumber;

  // Calculate base tour price using group pricing logic
  const calculateBaseTourPrice = () => {
    if (totalPeople === 0) return 0;

    if (totalPeople <= 4) {
      // Group pricing for 1-4 people - same price regardless of exact count
      return pricing.groupBasePrice;
    } else {
      // Base price for first 4 people + additional per person charges
      const extraPeople = totalPeople - 4;
      return pricing.groupBasePrice + extraPeople * pricing.perPersonRate;
    }
  };

  // Calculate total with all factors (trip type, extras)
  const calculateTotal = () => {
    let baseTotal = calculateBaseTourPrice();

    // Apply round trip multiplier
    if (tripType === "round-trip") {
      baseTotal *= 2;
    }

    // Add extra services
    let extraCharges = 0;
    if (isExtraService) {
      extraCharges += pricing.extraService;
    }
    if (isServicePerPerson) {
      extraCharges += pricing.servicePerPerson;
    }

    return baseTotal + extraCharges;
  };

  const totalAmount = calculateTotal();

  const handleBookNow = () => {
    // Create booking data with current state values
    const bookingData = {
      adults: adultNumber,
      youth: youthNumber,
      children: childrenNumber,
      isExtraService,
      isServicePerPerson,
      totalAmount,
      selectedTime,
      selectedDate,
      tripType,
      returnDate,
      returnTime,
      pricingType: totalPeople <= 4 ? "group" : "mixed",
      groupBasePrice: pricing.groupBasePrice,
      perPersonRate: pricing.perPersonRate,
    };

    console.log("🔍 Current booking data:", bookingData);

    // Check if at least one person is selected
    if (totalPeople === 0) {
      alert("Please select at least one guest before booking.");
      return;
    }

    // Check if date is selected
    if (!selectedDate) {
      alert("Please select a pick up date for your tour.");
      return;
    }

    // Check if return date is selected for round trips
    if (tripType === "round-trip" && !returnDate) {
      alert("Please select a return date for your round trip.");
      return;
    }

    // Check if time is selected
    if (!selectedTime) {
      alert("Please select a pick up time for your tour.");
      return;
    }

    // Check if return time is selected for round trips
    if (tripType === "round-trip" && !returnTime) {
      alert("Please select a return time for your round trip.");
      return;
    }

    // Store the booking data in state
    setCurrentBookingData(bookingData);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = async (result) => {
    try {
      console.log("Processing booking result:", result);

      // The booking has already been created by the modal
      // Just handle the success case
      if (result.booking || result.paymentStatus === "completed") {
        console.log("Booking created successfully:", result);

        // Reset the form
        setAdultNumber(0);
        setYouthNumber(0);
        setChildrenNumber(0);
        setisExtraService(false);
        setIsServicePerPerson(false);
        setSelectedTime("");
        setSelectedDate(null);
        setReturnDate(null);
        setReturnTime("");
        setTripType("one-way");
        setCurrentBookingData(null);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an error processing your booking. Please try again.");
    }
  };

  return (
    <>
      <div className='tourSingleSidebar'>
        <div className='d-flex items-center'>
          <div>From</div>
          <div className='text-20 fw-500 ml-10'>${pricing.groupBasePrice}</div>
          <div className='text-14 text-light-2 ml-5'>(1-4 people)</div>
        </div>

        {/* Trip Type Selection */}
        <div className='mt-20 mb-20'>
          <h5 className='text-16 fw-500 mb-15'>Trip Type</h5>
          <div className='d-flex gap-10'>
            <button
              onClick={() => handleTripTypeChange("one-way")}
              className={`button -sm px-15 py-10 rounded-8 ${
                tripType === "one-way"
                  ? "-dark-1 bg-accent-1 text-white"
                  : "-outline-accent-1 text-accent-1"
              }`}
              type='button'>
              One Way
            </button>
            <button
              onClick={() => handleTripTypeChange("round-trip")}
              className={`button -sm px-15 py-10 rounded-8 ml-10 ${
                tripType === "round-trip"
                  ? "-dark-1 bg-accent-1 text-white"
                  : "-outline-accent-1 text-accent-1"
              }`}
              type='button'>
              Round Trip
            </button>
          </div>
        </div>

        <div className='searchForm -type-1 -sidebar mt-20'>
          <div className='searchForm__form'>
            {/* Pick Up Date */}
            <div className='searchFormItem js-select-control js-form-dd js-calendar'>
              <div className='searchFormItem__button' data-x-click='calendar'>
                <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
                  <i className='text-20 icon-calendar'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>
                    {tripType === "round-trip" ? "Pick Up Date" : "Pick Up"}
                  </h5>
                  <div>
                    <span className='js-first-date'>
                      <Calender
                        onDateChange={setSelectedDate}
                        allowCurrentDate={true}
                        singleDateSelection={true}
                      />
                    </span>
                  </div>
                </div>
                <div className='searchFormItem__icon_chevron'>
                  <i className='icon-chevron-down d-flex text-18'></i>
                </div>
              </div>
            </div>

            {/* Return Date (only for round trip) */}
            {tripType === "round-trip" && (
              <div className='searchFormItem js-select-control js-form-dd js-calendar mt-15'>
                <div className='searchFormItem__button' data-x-click='calendar'>
                  <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
                    <i className='text-20 icon-calendar'></i>
                  </div>
                  <div className='searchFormItem__content'>
                    <h5>Return Date</h5>
                    <div>
                      <span className='js-first-date'>
                        <Calender
                          onDateChange={setReturnDate}
                          allowCurrentDate={true}
                          singleDateSelection={true}
                          minDate={selectedDate}
                        />
                      </span>
                    </div>
                  </div>
                  <div className='searchFormItem__icon_chevron'>
                    <i className='icon-chevron-down d-flex text-18'></i>
                  </div>
                </div>
              </div>
            )}

            {/* Pick Up Time Selection */}
            <div className='searchFormItem js-select-control js-form-dd mt-15'>
              <div
                className='searchFormItem__button'
                onClick={() => setActiveTimeDD((pre) => !pre)}
                data-x-click='time'>
                <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
                  <i className='text-20 icon-clock'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>{tripType === "round-trip" ? "Pick Up Time" : "Time"}</h5>
                  <div className='js-select-control-chosen'>
                    {selectedTime ? selectedTime : "Choose time"}
                  </div>
                </div>
                <div className='searchFormItem__icon_chevron'>
                  <i className='icon-chevron-down d-flex text-18'></i>
                </div>
              </div>

              <div
                className={`searchFormItemDropdown -tour-type ${
                  activeTimeDD ? "is-active" : ""
                }`}
                data-x='time'
                data-x-toggle='is-active'>
                <div className='searchFormItemDropdown__container'>
                  <div className='searchFormItemDropdown__list sroll-bar-1'>
                    {times.map((elm, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedTime((pre) => (pre == elm ? "" : elm));
                          setActiveTimeDD(false);
                        }}
                        className='searchFormItemDropdown__item'>
                        <button className='js-select-control-button'>
                          <span className='js-select-control-choice'>
                            {elm}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Return Time Selection (only for round trip) */}
            {tripType === "round-trip" && (
              <div className='searchFormItem js-select-control js-form-dd mt-15'>
                <div
                  className='searchFormItem__button'
                  onClick={() => setActiveReturnTimeDD((pre) => !pre)}
                  data-x-click='return-time'>
                  <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
                    <i className='text-20 icon-clock'></i>
                  </div>
                  <div className='searchFormItem__content'>
                    <h5>Return Time</h5>
                    <div className='js-select-control-chosen'>
                      {returnTime ? returnTime : "Choose return time"}
                    </div>
                  </div>
                  <div className='searchFormItem__icon_chevron'>
                    <i className='icon-chevron-down d-flex text-18'></i>
                  </div>
                </div>

                <div
                  className={`searchFormItemDropdown -tour-type ${
                    activeReturnTimeDD ? "is-active" : ""
                  }`}
                  data-x='return-time'
                  data-x-toggle='is-active'>
                  <div className='searchFormItemDropdown__container'>
                    <div className='searchFormItemDropdown__list sroll-bar-1'>
                      {times.map((elm, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setReturnTime((pre) => (pre == elm ? "" : elm));
                            setActiveReturnTimeDD(false);
                          }}
                          className='searchFormItemDropdown__item'>
                          <button className='js-select-control-button'>
                            <span className='js-select-control-choice'>
                              {elm}
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <h5 className='text-18 fw-500 mb-20 mt-20'>Guests</h5>

        {/* Group Pricing Information */}
        <div className='bg-light-1 rounded-8 p-15 mb-20'>
          <div className='text-14 fw-500 mb-5'>Pricing Structure:</div>
          <div className='text-13 text-light-2'>
            • 1-4 people: ${pricing.groupBasePrice} (group rate)
            {totalPeople > 4 && (
              <div className='text-13 text-light-2 mt-5'>
                • 5+ people: +${pricing.perPersonRate} per additional person
              </div>
            )}
          </div>
        </div>

        <div>
          <div className='d-flex items-center justify-between'>
            <div className='text-14'>
              Adult (18+ years)
              {totalPeople <= 4 ? (
                <span className='text-12 text-light-2 ml-5'>
                  (included in group rate)
                </span>
              ) : adultNumber > 0 ? (
                <span className='fw-500 ml-5'>
                  {adultNumber <= 4
                    ? "Included"
                    : `+$${(
                        (adultNumber -
                          Math.min(
                            4,
                            totalPeople - youthNumber - childrenNumber
                          )) *
                        pricing.perPersonRate *
                        (tripType === "round-trip" ? 2 : 1)
                      ).toFixed(2)}`}
                </span>
              ) : null}
            </div>

            <div className='d-flex items-center js-counter'>
              <button
                onClick={() =>
                  setAdultNumber((pre) => (pre > 0 ? pre - 1 : pre))
                }
                className='button size-30 border-1 rounded-full js-down'>
                <i className='icon-minus text-10'></i>
              </button>

              <div className='flex-center ml-10 mr-10'>
                <div className='text-14 size-20 js-count'>{adultNumber}</div>
              </div>

              <button
                onClick={() => setAdultNumber((pre) => pre + 1)}
                className='button size-30 border-1 rounded-full js-up'>
                <i className='icon-plus text-10'></i>
              </button>
            </div>
          </div>
        </div>

        <div className='mt-15'>
          <div className='d-flex items-center justify-between'>
            <div className='text-14'>
              Youth (13-17 years)
              {totalPeople <= 4 ? (
                <span className='text-12 text-light-2 ml-5'>
                  (included in group rate)
                </span>
              ) : youthNumber > 0 ? (
                <span className='fw-500 ml-5'>
                  {youthNumber <= 4
                    ? "Included"
                    : `+$${(
                        (youthNumber -
                          Math.min(
                            4,
                            totalPeople - adultNumber - childrenNumber
                          )) *
                        pricing.perPersonRate *
                        (tripType === "round-trip" ? 2 : 1)
                      ).toFixed(2)}`}
                </span>
              ) : null}
            </div>

            <div className='d-flex items-center js-counter'>
              <button
                onClick={() =>
                  setYouthNumber((pre) => (pre > 0 ? pre - 1 : pre))
                }
                className='button size-30 border-1 rounded-full js-down'>
                <i className='icon-minus text-10'></i>
              </button>

              <div className='flex-center ml-10 mr-10'>
                <div className='text-14 size-20 js-count'>{youthNumber}</div>
              </div>

              <button
                onClick={() => setYouthNumber((pre) => pre + 1)}
                className='button size-30 border-1 rounded-full js-up'>
                <i className='icon-plus text-10'></i>
              </button>
            </div>
          </div>
        </div>

        <div className='mt-15'>
          <div className='d-flex items-center justify-between'>
            <div className='text-14'>
              Children (0-12 years)
              {totalPeople <= 4 ? (
                <span className='text-12 text-light-2 ml-5'>
                  (included in group rate)
                </span>
              ) : childrenNumber > 0 ? (
                <span className='fw-500 ml-5'>
                  {childrenNumber <= 4
                    ? "Included"
                    : `+$${(
                        (childrenNumber -
                          Math.min(
                            4,
                            totalPeople - adultNumber - youthNumber
                          )) *
                        pricing.perPersonRate *
                        (tripType === "round-trip" ? 2 : 1)
                      ).toFixed(2)}`}
                </span>
              ) : null}
            </div>

            <div className='d-flex items-center js-counter'>
              <button
                onClick={() =>
                  setChildrenNumber((pre) => (pre > 0 ? pre - 1 : pre))
                }
                className='button size-30 border-1 rounded-full js-down'>
                <i className='icon-minus text-10'></i>
              </button>

              <div className='flex-center ml-10 mr-10'>
                <div className='text-14 size-20 js-count'>{childrenNumber}</div>
              </div>

              <button
                onClick={() => setChildrenNumber((pre) => pre + 1)}
                className='button size-30 border-1 rounded-full js-up'>
                <i className='icon-plus text-10'></i>
              </button>
            </div>
          </div>
        </div>

        {/* Group Size Indicator */}
        <div className='mt-15 p-15 bg-light-1 rounded-8'>
          <div className='text-14 fw-500 d-flex items-center justify-between'>
            <span>Total Guests: {totalPeople}</span>
            <span className='text-accent-1'>
              {totalPeople <= 4
                ? "Group Rate"
                : `Group + ${totalPeople - 4} Extra`}
            </span>
          </div>
          {totalPeople > 4 && (
            <div className='text-12 text-light-2 mt-5'>
              First 4 people: ${pricing.groupBasePrice} | Extra{" "}
              {totalPeople - 4}: +$
              {((totalPeople - 4) * pricing.perPersonRate).toFixed(2)}
            </div>
          )}
        </div>

        {/* Round Trip Indicator */}
        {tripType === "round-trip" && (
          <div className='mt-15 p-15 bg-accent-1-05 rounded-8'>
            <div className='text-14 text-accent-1 fw-500 d-flex items-center'>
              <i className='icon-arrow-left-right text-16 mr-10'></i>
              Round Trip - Prices doubled
            </div>
          </div>
        )}

        <h5 className='text-18 fw-500 mb-20 mt-20'>Add Extra</h5>

        <div className='d-flex items-center justify-between'>
          <div className='d-flex items-center'>
            <div className='form-checkbox'>
              <input
                checked={isExtraService ? true : false}
                onChange={() => setisExtraService((pre) => !pre)}
                type='checkbox'
              />
              <div className='form-checkbox__mark'>
                <div className='form-checkbox__icon'>
                  <Image
                    width='10'
                    height='8'
                    src='/img/icons/check.svg'
                    alt='icon'
                  />
                </div>
              </div>
            </div>
            <div className='ml-10'>Add Service per booking</div>
          </div>

          <div className='text-14'>${pricing.extraService}</div>
        </div>

        <div className='d-flex justify-between mt-20'>
          <div className='d-flex'>
            <div className='form-checkbox mt-5'>
              <input
                checked={isServicePerPerson ? true : false}
                onChange={() => setIsServicePerPerson((pre) => !pre)}
                type='checkbox'
              />
              <div className='form-checkbox__mark'>
                <div className='form-checkbox__icon'>
                  <Image
                    width='10'
                    height='8'
                    src='/img/icons/check.svg'
                    alt='icon'
                  />
                </div>
              </div>
            </div>

            <div className='ml-10'>
              Add Service per person
              <div className='lh-16'>
                Adult: <span className='fw-500'>$17.00</span> - Youth:{" "}
                <span className='fw-500'>$14.00</span>
              </div>
            </div>
          </div>

          <div className='text-14'>${pricing.servicePerPerson}</div>
        </div>

        <div className='line mt-20 mb-20'></div>

        <div className='d-flex items-center justify-between'>
          <div className='text-18 fw-500'>Total:</div>
          <div className='text-18 fw-500'>${totalAmount.toFixed(2)}</div>
        </div>

        <button
          onClick={handleBookNow}
          className='button -md -dark-1 col-12 bg-accent-1 text-white mt-20'>
          Book Now
          <i className='icon-arrow-top-right ml-10'></i>
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingData={currentBookingData}
        tour={tour}
        onBookingSuccess={handleBookingSuccess}
      />
    </>
  );
}
