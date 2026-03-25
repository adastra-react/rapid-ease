"use client";
import React from "react";
import { toursTypes } from "@/data/tourFilteringOptions";

export default function TourType({ active, setTourType }) {
  return (
    <div
      className={`searchFormItemDropdown -tour-type ${
        active ? "is-active" : ""
      } `}
      data-x="tour-type"
      data-x-toggle="is-active"
    >
      <div className="searchFormItemDropdown__container">
        <div className="searchFormItemDropdown__list sroll-bar-1">
          {toursTypes.map((elm, i) => (
            <div
              onClick={() => setTourType((pre) => (pre == elm ? "" : elm))}
              key={i}
              className="searchFormItemDropdown__item"
            >
              <button className="js-select-control-button">
                <span className="js-select-control-choice">{elm}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
