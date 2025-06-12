// "use client";

// import React, { useEffect, useState } from "react";
// import Calender from "../common/dropdownSearch/Calender";
// import Image from "next/image";
// import { times } from "@/data/tourSingleContent";

// // Import the BookingModal component
// import BookingModal from "../../components/modals/BookingModal";

// export default function TourSingleSidebar({ tour }) {
//   // Use prices from tour data instead of hardcoded values
//   const prices = {
//     adultPrice: tour.pricing.adultPrice || 94,
//     youthPrice: tour.pricing.youthPrice || 84,
//     childrenPrice: tour.pricing.childPrice || 20,
//     extraService: 40, // Keep these as defaults since they're not in tour data
//     servicePerPerson: 40,
//   };

//   // Start all quantities at 0
//   const [adultNumber, setAdultNumber] = useState(0);
//   const [youthNumber, setYouthNumber] = useState(0);
//   const [childrenNumber, setChildrenNumber] = useState(0);
//   const [isExtraService, setisExtraService] = useState(false);
//   const [isServicePerPerson, setIsServicePerPerson] = useState(false);
//   const [extraCharge, setExtraCharge] = useState(0);

//   // Modal state
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

//   // Date and time state - you'll need to integrate these with your actual date/time pickers
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState("");
//   const [activeTimeDD, setActiveTimeDD] = useState(false);

//   useEffect(() => {
//     setExtraCharge(0);
//     if (isExtraService) {
//       setExtraCharge((pre) => pre + prices.extraService);
//     }
//     if (isServicePerPerson) {
//       setExtraCharge((pre) => pre + prices.servicePerPerson);
//     }
//   }, [
//     isExtraService,
//     isServicePerPerson,
//     setExtraCharge,
//     prices.extraService,
//     prices.servicePerPerson,
//   ]);

//   // Calculate total amount
//   const totalAmount =
//     prices.adultPrice * adultNumber +
//     prices.youthPrice * youthNumber +
//     prices.childrenPrice * childrenNumber +
//     extraCharge;

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
//   };

//   const handleBookNow = () => {
//     // Check if at least one person is selected
//     if (adultNumber === 0 && youthNumber === 0 && childrenNumber === 0) {
//       alert("Please select at least one guest before booking.");
//       return;
//     }

//     // Check if time is selected (optional check)
//     if (!selectedTime) {
//       alert("Please select a time for your tour.");
//       return;
//     }

//     setIsBookingModalOpen(true);
//   };

//   const handleBookingSuccess = async (bookingPayload) => {
//     try {
//       console.log("Processing booking:", bookingPayload);

//       // Here you would make the actual API call to your backend
//       const response = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingPayload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Booking created successfully:", result);

//         // Reset the form
//         setAdultNumber(0);
//         setYouthNumber(0);
//         setChildrenNumber(0);
//         setisExtraService(false);
//         setIsServicePerPerson(false);
//         setSelectedTime("");
//         setSelectedDate(null);

//         // You could redirect to a success page or show a success message
//         // window.location.href = `/booking-confirmation/${result.data.booking._id}`;
//       } else {
//         const error = await response.json();
//         console.error("Booking failed:", error);
//         alert("Booking failed: " + error.message);
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
//           <div className='text-20 fw-500 ml-10'>${tour.pricing.basePrice}</div>
//         </div>

//         <div className='searchForm -type-1 -sidebar mt-20'>
//           <div className='searchForm__form'>
//             <div className='searchFormItem js-select-control js-form-dd js-calendar'>
//               <div className='searchFormItem__button' data-x-click='calendar'>
//                 <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
//                   <i className='text-20 icon-calendar'></i>
//                 </div>
//                 <div className='searchFormItem__content'>
//                   <h5>From</h5>
//                   <div>
//                     <span className='js-first-date'>
//                       <Calender onDateChange={setSelectedDate} />
//                     </span>
//                     <span className='js-last-date'></span>
//                   </div>
//                 </div>
//                 <div className='searchFormItem__icon_chevron'>
//                   <i className='icon-chevron-down d-flex text-18'></i>
//                 </div>
//               </div>
//             </div>

//             <div className='searchFormItem js-select-control js-form-dd'>
//               <div
//                 className='searchFormItem__button'
//                 onClick={() => setActiveTimeDD((pre) => !pre)}
//                 data-x-click='time'>
//                 <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
//                   <i className='text-20 icon-clock'></i>
//                 </div>
//                 <div className='searchFormItem__content'>
//                   <h5>Time</h5>
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
//           </div>
//         </div>

//         <h5 className='text-18 fw-500 mb-20 mt-20'>Tickets</h5>

//         <div>
//           <div className='d-flex items-center justify-between'>
//             <div className='text-14'>
//               Adult (18+ years){" "}
//               <span className='fw-500'>
//                 ${(prices.adultPrice * adultNumber).toFixed(2)}
//               </span>
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
//               Youth (13-17 years){" "}
//               <span className='fw-500'>
//                 ${(prices.youthPrice * youthNumber).toFixed(2)}
//               </span>
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
//               Children (0-12 years){" "}
//               <span className='fw-500'>
//                 ${(prices.childrenPrice * childrenNumber).toFixed(2)}
//               </span>
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

//           <div className='text-14'>${prices.extraService}</div>
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

//           <div className='text-14'>${prices.servicePerPerson}</div>
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
  // Use prices from tour data instead of hardcoded values
  const prices = {
    adultPrice: tour.pricing.adultPrice || 94,
    youthPrice: tour.pricing.youthPrice || 84,
    childrenPrice: tour.pricing.childPrice || 20,
    extraService: 40, // Keep these as defaults since they're not in tour data
    servicePerPerson: 40,
  };

  // Start all quantities at 0
  const [adultNumber, setAdultNumber] = useState(0);
  const [youthNumber, setYouthNumber] = useState(0);
  const [childrenNumber, setChildrenNumber] = useState(0);
  const [isExtraService, setisExtraService] = useState(false);
  const [isServicePerPerson, setIsServicePerPerson] = useState(false);
  const [extraCharge, setExtraCharge] = useState(0);

  // Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Date and time state - updated to allow current date
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTimeDD, setActiveTimeDD] = useState(false);

  useEffect(() => {
    setExtraCharge(0);
    if (isExtraService) {
      setExtraCharge((pre) => pre + prices.extraService);
    }
    if (isServicePerPerson) {
      setExtraCharge((pre) => pre + prices.servicePerPerson);
    }
  }, [
    isExtraService,
    isServicePerPerson,
    setExtraCharge,
    prices.extraService,
    prices.servicePerPerson,
  ]);

  // Calculate total amount
  const totalAmount =
    prices.adultPrice * adultNumber +
    prices.youthPrice * youthNumber +
    prices.childrenPrice * childrenNumber +
    extraCharge;

  // Prepare booking data for modal - now includes date and time from sidebar
  const bookingData = {
    adults: adultNumber,
    youth: youthNumber,
    children: childrenNumber,
    isExtraService,
    isServicePerPerson,
    totalAmount,
    selectedTime,
    selectedDate,
  };

  const handleBookNow = () => {
    // Check if at least one person is selected
    if (adultNumber === 0 && youthNumber === 0 && childrenNumber === 0) {
      alert("Please select at least one guest before booking.");
      return;
    }

    // Check if date is selected
    if (!selectedDate) {
      alert("Please select a date for your tour.");
      return;
    }

    // Check if time is selected
    if (!selectedTime) {
      alert("Please select a time for your tour.");
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = async (bookingPayload) => {
    try {
      console.log("Processing booking:", bookingPayload);

      // Here you would make the actual API call to your backend
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Booking created successfully:", result);

        // Reset the form
        setAdultNumber(0);
        setYouthNumber(0);
        setChildrenNumber(0);
        setisExtraService(false);
        setIsServicePerPerson(false);
        setSelectedTime("");
        setSelectedDate(null);

        // You could redirect to a success page or show a success message
        // window.location.href = `/booking-confirmation/${result.data.booking._id}`;
      } else {
        const error = await response.json();
        console.error("Booking failed:", error);
        alert("Booking failed: " + error.message);
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
          <div className='text-20 fw-500 ml-10'>${tour.pricing.basePrice}</div>
        </div>

        <div className='searchForm -type-1 -sidebar mt-20'>
          <div className='searchForm__form'>
            <div className='searchFormItem js-select-control js-form-dd js-calendar'>
              <div className='searchFormItem__button' data-x-click='calendar'>
                <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
                  <i className='text-20 icon-calendar'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>From</h5>
                  <div>
                    <span className='js-first-date'>
                      <Calender
                        onDateChange={setSelectedDate}
                        allowCurrentDate={true}
                        singleDateSelection={true}
                      />
                    </span>
                    <span className='js-last-date'></span>
                  </div>
                </div>
                <div className='searchFormItem__icon_chevron'>
                  <i className='icon-chevron-down d-flex text-18'></i>
                </div>
              </div>
            </div>

            <div className='searchFormItem js-select-control js-form-dd'>
              <div
                className='searchFormItem__button'
                onClick={() => setActiveTimeDD((pre) => !pre)}
                data-x-click='time'>
                <div className='searchFormItem__icon size-50 rounded-12 bg-light-1 flex-center'>
                  <i className='text-20 icon-clock'></i>
                </div>
                <div className='searchFormItem__content'>
                  <h5>Time</h5>
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
          </div>
        </div>

        <h5 className='text-18 fw-500 mb-20 mt-20'>Tickets</h5>

        <div>
          <div className='d-flex items-center justify-between'>
            <div className='text-14'>
              Adult (18+ years){" "}
              <span className='fw-500'>
                ${(prices.adultPrice * adultNumber).toFixed(2)}
              </span>
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
              Youth (13-17 years){" "}
              <span className='fw-500'>
                ${(prices.youthPrice * youthNumber).toFixed(2)}
              </span>
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
              Children (0-12 years){" "}
              <span className='fw-500'>
                ${(prices.childrenPrice * childrenNumber).toFixed(2)}
              </span>
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

          <div className='text-14'>${prices.extraService}</div>
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

          <div className='text-14'>${prices.servicePerPerson}</div>
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
        bookingData={bookingData}
        tour={tour}
        onBookingSuccess={handleBookingSuccess}
      />
    </>
  );
}
