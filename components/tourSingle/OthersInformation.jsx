import React from "react";

export default function OthersInformation({ tour }) {
  // Format age range
  const ageRangeText = tour?.ageRange
    ? `${tour.ageRange.min}-${tour.ageRange.max} yrs`
    : "18-99 yrs";

  // Format languages
  const languagesText = tour?.languages
    ? tour.languages.join(", ")
    : "English, Japanese";

  return (
    <>
      <div className='col-lg-3 col-6'>
        <div className='d-flex items-center'>
          <div className='flex-center size-50 rounded-12 border-1'>
            <i className='text-20 icon-clock'></i>
          </div>

          <div className='ml-10'>
            <div className='lh-16'>Duration</div>
            <div className='text-14 text-light-2 lh-16'>
              {tour?.duration ? `${tour.duration} days` : "3 days"}
            </div>
          </div>
        </div>
      </div>

      <div className='col-lg-3 col-6'>
        <div className='d-flex items-center'>
          <div className='flex-center size-50 rounded-12 border-1'>
            <i className='text-20 icon-teamwork'></i>
          </div>

          <div className='ml-10'>
            <div className='lh-16'>Group Size</div>
            <div className='text-14 text-light-2 lh-16'>
              {tour?.groupSize ? `${tour.groupSize} people` : "10 people"}
            </div>
          </div>
        </div>
      </div>

      <div className='col-lg-3 col-6'>
        <div className='d-flex items-center'>
          <div className='flex-center size-50 rounded-12 border-1'>
            <i className='text-20 icon-birthday-cake'></i>
          </div>

          <div className='ml-10'>
            <div className='lh-16'>Ages</div>
            <div className='text-14 text-light-2 lh-16'>{ageRangeText}</div>
          </div>
        </div>
      </div>

      <div className='col-lg-3 col-6'>
        <div className='d-flex items-center'>
          <div className='flex-center size-50 rounded-12 border-1'>
            <i className='text-20 icon-translate'></i>
          </div>

          <div className='ml-10'>
            <div className='lh-16'>Languages</div>
            <div className='text-14 text-light-2 lh-16'>{languagesText}</div>
          </div>
        </div>
      </div>
    </>
  );
}
