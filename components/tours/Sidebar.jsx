"use client";

import React, { useState } from "react";
import Calender from "../common/dropdownSearch/Calender";
import {
  durations,
  languages,
  toursTypes,
  features,
  rating,
} from "@/data/tourFilteringOptions";
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
  const [ddActives, setDdActives] = useState(["tourtype"]);
  const selectedDurationLabel =
    Object.entries(durationMappings).find(
      ([, range]) =>
        filters.minDuration === range.minDuration &&
        filters.maxDuration === range.maxDuration
    )?.[0] || "";

  const toggleMultiValue = (key, value) => {
    const currentValues = filters[key] || [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    dispatch(setFilters({ [key]: nextValues }));
  };

  const toggleDuration = (label) => {
    if (selectedDurationLabel === label) {
      dispatch(setFilters({ minDuration: null, maxDuration: null }));
      return;
    }

    dispatch(setFilters(durationMappings[label]));
  };

  const updateRating = (value) => {
    const currentRatings = filters.ratings || [];
    const nextRatings = currentRatings.includes(value)
      ? currentRatings.filter((item) => item !== value)
      : [...currentRatings, value];

    dispatch(setFilters({ ratings: nextRatings }));
  };

  return (
    <div className='sidebar -type-1 rounded-12'>
      <div className='sidebar__header bg-accent-1'>
        <div className='text-15 text-white fw-500'>When are you traveling?</div>

        <div className='mt-10'>
            <div className='searchForm -type-1 -col-1 -narrow'>
            <div className='searchForm__form'>
              <div className='searchFormItem js-select-control js-form-dd js-calendar'>
                <div className='searchFormItem__button' data-x-click='calendar'>
                  <div className='pl-calendar d-flex items-center'>
                    <i className='icon-calendar text-20 mr-15'></i>
                    <div>
                      <span className='js-first-date'>
                        <Calender />
                      </span>
                      <span className='js-last-date'></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='text-12 text-white mt-10 opacity-75'>
          Date filtering is not available yet for this tour dataset.
        </div>
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
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("tourtype") ? "is-active" : ""
              } `}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("tourtype")
                      ? [...pre.filter((elm) => elm != "tourtype")]
                      : [...pre, "tourtype"]
                  )
                }>
                <h5 className='text-18 fw-500'>Tour Type</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={
                  ddActives.includes("tourtype") ? { maxHeight: "300px" } : {}
                }>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {toursTypes.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox '>
                            <input
                              type='checkbox'
                              checked={(filters.tourTypes || []).includes(elm)}
                              onChange={() => toggleMultiValue("tourTypes", elm)}
                              name='tourType'
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

                          <div className='lh-11 ml-10'>{elm}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a
                    href='#'
                    onClick={(event) => event.preventDefault()}
                    className='d-flex text-15 fw-500 text-accent-2 mt-15'>
                    See More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='sidebar__item'>
          <div className='accordion -simple-2 js-accordion'>
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("pricerange") ? "is-active" : ""
              } `}>
              <div
                className='accordion__button mb-10 d-flex items-center justify-between'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("pricerange")
                      ? [...pre.filter((elm) => elm != "pricerange")]
                      : [...pre, "pricerange"]
                  )
                }>
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
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("duration") ? "is-active" : ""
              } `}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("duration")
                      ? [...pre.filter((elm) => elm != "duration")]
                      : [...pre, "duration"]
                  )
                }>
                <h5 className='text-18 fw-500'>Duration</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={
                  ddActives.includes("duration") ? { maxHeight: "300px" } : {}
                }>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {durations.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox '>
                            <input
                              type='checkbox'
                              checked={selectedDurationLabel === elm}
                              onChange={() => toggleDuration(elm)}
                              name='duration'
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

                          <div className='lh-11 ml-10'>{elm}</div>
                        </div>
                      </div>
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
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("language") ? "is-active" : ""
              } `}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("language")
                      ? [...pre.filter((elm) => elm != "language")]
                      : [...pre, "language"]
                  )
                }>
                <h5 className='text-18 fw-500'>Language</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={
                  ddActives.includes("language") ? { maxHeight: "300px" } : {}
                }>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {languages.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox '>
                            <input
                              type='checkbox'
                              checked={(filters.languages || []).includes(elm)}
                              onChange={() => toggleMultiValue("languages", elm)}
                              name='language'
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

                          <div className='lh-11 ml-10'>{elm}</div>
                        </div>
                      </div>
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
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("rating") ? "is-active" : ""
              } `}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("rating")
                      ? [...pre.filter((elm) => elm != "rating")]
                      : [...pre, "rating"]
                  )
                }>
                <h5 className='text-18 fw-500'>Rating</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={
                  ddActives.includes("rating") ? { maxHeight: "300px" } : {}
                }>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {rating.map((elm, i) => (
                      <div key={i} className='d-flex'>
                        <div className='form-checkbox'>
                          <input
                            type='checkbox'
                            name='rating'
                            checked={(filters.ratings || []).includes(elm)}
                            onChange={() => updateRating(elm)}
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
                        <div className='d-flex x-gap-5 ml-10'>
                          <Stars star={elm} font={13} />
                        </div>
                      </div>
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
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("features") ? "is-active" : ""
              } `}>
              <div
                className='accordion__button d-flex items-center justify-between'
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("features")
                      ? [...pre.filter((elm) => elm != "features")]
                      : [...pre, "features"]
                  )
                }>
                <h5 className='text-18 fw-500'>Specials</h5>

                <div className='accordion__icon flex-center'>
                  <i className='icon-chevron-down'></i>
                  <i className='icon-chevron-down'></i>
                </div>
              </div>

              <div
                className='accordion__content'
                style={
                  ddActives.includes("features") ? { maxHeight: "300px" } : {}
                }>
                <div className='pt-15'>
                  <div className='d-flex flex-column y-gap-15'>
                    {features.map((elm, i) => (
                      <div key={i}>
                        <div className='d-flex items-center'>
                          <div className='form-checkbox '>
                            <input
                              type='checkbox'
                              checked={(filters.specials || []).includes(elm)}
                              onChange={() => toggleMultiValue("specials", elm)}
                              name='special'
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

                          <div className='lh-11 ml-10'>{elm}</div>
                        </div>
                      </div>
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
