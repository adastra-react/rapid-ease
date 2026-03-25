"use client";

import { useEffect, useRef, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function Calender({
  onDateChange,
  allowCurrentDate = true,
  singleDateSelection = true,
  isOpen,
  onOpenChange,
  minDate,
}) {
  const datePickerRef = useRef(null);
  // Initialize with null for single date selection
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (typeof isOpen !== "boolean") return;

    if (isOpen) {
      datePickerRef.current?.openCalendar?.();
    } else {
      datePickerRef.current?.closeCalendar?.();
    }
  }, [isOpen]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Call the parent callback with the selected date
    if (onDateChange && date) {
      // Convert DateObject to YYYY-MM-DD format
      const formattedDate = date.format("YYYY-MM-DD");
      onDateChange(formattedDate);
    } else if (onDateChange && !date) {
      // Handle clearing the date
      onDateChange(null);
    }
  };

  // Get minimum date based on allowCurrentDate prop
  const getMinDate = () => {
    const today = new DateObject();
    if (allowCurrentDate) {
      return today; // Allow today
    } else {
      return today.add(1, "day"); // Only allow tomorrow onwards
    }
  };

  return (
    <DatePicker
      ref={datePickerRef}
      inputClass='custom_input-picker tour-modern-calendar__input'
      containerClassName='custom_container-picker tour-modern-calendar__container'
      calendarClassName='tour-modern-calendar'
      value={selectedDate}
      onChange={handleDateChange}
      open={typeof isOpen === "boolean" ? isOpen : undefined}
      onOpen={() => onOpenChange?.(true)}
      onClose={() => onOpenChange?.(false)}
      numberOfMonths={1} // Show only one month for single date selection
      offsetY={10}
      range={false} // Disable range selection
      minDate={minDate || getMinDate()} // Restrict to current/future dates
      format='MMMM DD, YYYY' // Better format for single date
      placeholder='Choose date'
      // Remove rangeHover since we're not using range
    />
  );
}
