"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { setCurrentPage } from "../../app/store/slices/toursSlice";

export default function Pagination() {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages } = useAppSelector((state) => state.tours);

  // Calculate the range based on totalPages
  const range = totalPages || 1;

  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    // If you have a fetchTours action that should be called when page changes
    // you can dispatch it here, or leave it in the parent component's useEffect
  };

  return (
    <div className='pagination justify-center'>
      <button
        onClick={() => {
          if (currentPage > 1) {
            handlePageChange(currentPage - 1);
          }
        }}
        className='pagination__button customStylePaginationPre button -accent-1 mr-15 -prev'>
        <i className='icon-arrow-left text-15'></i>
      </button>

      <div className='pagination__count'>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handlePageChange(1)}
          className={currentPage === 1 ? `is-active` : ""}>
          1
        </div>

        {range > 1 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(2)}
            className={currentPage === 2 ? `is-active` : ""}>
            2
          </div>
        )}

        {range > 2 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(3)}
            className={currentPage === 3 ? `is-active` : ""}>
            3
          </div>
        )}

        {range > 3 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(4)}
            className={currentPage === 4 ? `is-active` : ""}>
            4
          </div>
        )}

        {currentPage === 5 && range !== 5 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(5)}
            className='is-active'>
            5
          </div>
        )}

        {range > 5 && <div>...</div>}

        {currentPage > 5 && currentPage < range && (
          <div style={{ cursor: "pointer" }} className='is-active'>
            {currentPage}
          </div>
        )}

        {range > 4 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(range)}
            className={currentPage === range ? `is-active` : ""}>
            {range}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (currentPage < range) {
            handlePageChange(currentPage + 1);
          }
        }}
        className='pagination__button customStylePaginationNext button -accent-1 ml-15 -next'>
        <i className='icon-arrow-right text-15'></i>
      </button>
    </div>
  );
}
