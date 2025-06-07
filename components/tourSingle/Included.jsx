import { excluded, included } from "@/data/tourSingleContent";
import React from "react";

export default function Included({ tour }) {
  // Process tour data if available, otherwise use the default data
  let includedItems = included;
  let excludedItems = excluded;

  if (tour?.includedItems && tour.includedItems.length > 0) {
    // Filter the tour includedItems array into included and excluded items
    includedItems = tour.includedItems
      .filter((item) => item.included)
      .map((item) => ({ text: item.name }));

    excludedItems = tour.includedItems
      .filter((item) => !item.included)
      .map((item) => ({ text: item.name }));
  }

  return (
    <div className='row x-gap-130 y-gap-20 pt-20'>
      <div className='col-lg-6'>
        <div className='y-gap-15'>
          {includedItems.map((elm, i) => (
            <div key={i} className='d-flex'>
              <i className='icon-check flex-center text-10 size-24 rounded-full text-green-2 bg-green-1 mr-15'></i>
              {elm.text}
            </div>
          ))}
        </div>
      </div>

      <div className='col-lg-6'>
        <div className='y-gap-15'>
          {excludedItems.map((elm, i) => (
            <div key={i} className='d-flex'>
              <i className='icon-cross flex-center text-10 size-24 rounded-full text-red-3 bg-red-4 mr-15'></i>
              {elm.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
