"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { setCurrentPage } from "../../app/store/slices/toursSlice";

export default function Pagination({
  currentPage: currentPageProp,
  totalPages: totalPagesProp,
  onPageChange,
}) {
  const dispatch = useAppDispatch();
  const { currentPage: storeCurrentPage, totalPages: storeTotalPages } =
    useAppSelector((state) => state.tours);

  const currentPage = currentPageProp ?? storeCurrentPage;
  const totalPages = totalPagesProp ?? storeTotalPages;

  const range = Math.max(totalPages || 1, 1);

  const pages = [];
  const pushPage = (page) => {
    if (page >= 1 && page <= range && !pages.includes(page)) {
      pages.push(page);
    }
  };

  pushPage(1);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    pushPage(page);
  }

  pushPage(range);

  pages.sort((a, b) => a - b);

  const handlePageChange = (page) => {
    if (page < 1 || page > range || page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
      return;
    }

    dispatch(setCurrentPage(page));
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
        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const showGap = previousPage && page - previousPage > 1;

          return (
            <React.Fragment key={page}>
              {showGap && <div>...</div>}
              <div
                style={{ cursor: "pointer" }}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "is-active" : ""}>
                {page}
              </div>
            </React.Fragment>
          );
        })}
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
