"use client";

import React, { useState } from "react";
import { durations, toursTypes, rating } from "@/data/tourFilteringOptions";
import RangeSlider from "../common/RangeSlider";
import Stars from "../common/Stars";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { resetFilters, setFilters } from "../../app/store/slices/toursSlice";

const durationMappings = {
  "0-3 hours": { minDuration: 0, maxDuration: 3 },
  "3-5 hours": { minDuration: 3, maxDuration: 5 },
  "5-7 hours": { minDuration: 5, maxDuration: 7 },
  "Full day (7+ hours)": { minDuration: 7, maxDuration: 24 },
  "Multi-day": { minDuration: 24, maxDuration: null },
};

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.tours);
  const [ddActives, setDdActives] = useState([
    "tourtype",
    "pricerange",
    "duration",
    "rating",
  ]);

  const selectedDurationLabel =
    Object.entries(durationMappings).find(
      ([, range]) =>
        filters.minDuration === range.minDuration &&
        filters.maxDuration === range.maxDuration
    )?.[0] || "";

  const toggleSection = (key) => {
    setDdActives((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  };

  const toggleTourType = (value) => {
    const currentValues = filters.tourTypes || [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    dispatch(setFilters({ tourTypes: nextValues }));
  };

  const toggleDuration = (label) => {
    if (selectedDurationLabel === label) {
      dispatch(setFilters({ minDuration: null, maxDuration: null }));
      return;
    }

    dispatch(setFilters(durationMappings[label]));
  };

  const toggleRating = (value) => {
    if (filters.minRating === value) {
      dispatch(setFilters({ minRating: null, maxRating: null }));
      return;
    }

    dispatch(
      setFilters({
        minRating: value,
        maxRating: value === 5 ? 5 : value + 1,
      })
    );
  };

  return (
    <div className='sidebar -type-1 rounded-12'>
      <div className='sidebar__header bg-accent-1'>
        <div className='text-15 text-white fw-500'>Filter Tours</div>
      </div>

      <div className='sidebar__content'>
        <div className='sidebar__item'>
          <button
            className='button -sm -outline-accent-1 text-accent-1 w-100'
            onClick={() => dispatch(resetFilters())}>
            Clear All Filters
          </button>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item ${
                ddActives.includes("tourtype") ? "is-active" : ""
              }`}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() => toggleSection("tourtype")}>
                <h5 className='text-18 fw-500'>Tour Type</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes("tourtype") ? { maxHeight: "300px" } : {}}>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {toursTypes.map((item) => (
                      <label key={item} className='d-flex items-center'>
                        <div className='form-checkbox'>
                          <input
                            type='checkbox'
                            name='tourType'
                            checked={(filters.tourTypes || []).includes(item)}
                            onChange={() => toggleTourType(item)}
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

                        <div className='lh-11 ml-10'>{item}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item ${
                ddActives.includes("pricerange") ? "is-active" : ""
              }`}>
              <div
                className='accordion__button mb-10 d-flex items-center justify-between'
                onClick={() => toggleSection("pricerange")}>
                <h5 className='text-18 fw-500'>Filter Price</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={
                  ddActives.includes("pricerange") ? { maxHeight: "300px" } : {}
                }>
                <div className='pt-15'>
                  <RangeSlider
                    value={[filters.minPrice ?? 0, filters.maxPrice ?? 100000]}
                    min={0}
                    max={100000}
                    onChangeCommitted={(value) =>
                      dispatch(
                        setFilters({
                          minPrice: value[0],
                          maxPrice: value[1],
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item ${
                ddActives.includes("duration") ? "is-active" : ""
              }`}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() => toggleSection("duration")}>
                <h5 className='text-18 fw-500'>Duration</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes("duration") ? { maxHeight: "300px" } : {}}>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {durations.map((item) => (
                      <label key={item} className='d-flex items-center'>
                        <div className='form-checkbox'>
                          <input
                            type='checkbox'
                            name='duration'
                            checked={selectedDurationLabel === item}
                            onChange={() => toggleDuration(item)}
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

                        <div className='lh-11 ml-10'>{item}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item ${
                ddActives.includes("rating") ? "is-active" : ""
              }`}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() => toggleSection("rating")}>
                <h5 className='text-18 fw-500'>Rating</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={ddActives.includes("rating") ? { maxHeight: "300px" } : {}}>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {rating.map((item) => (
                      <label key={item} className='d-flex items-center'>
                        <div className='form-checkbox'>
                          <input
                            type='checkbox'
                            name='rating'
                            checked={filters.minRating === item}
                            onChange={() => toggleRating(item)}
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

                        <div className='d-flex items-center x-gap-5 ml-10'>
                          <Stars star={item} font={13} />
                          <span className='text-13'>{item} stars</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
