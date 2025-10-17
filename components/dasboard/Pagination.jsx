// components/common/Pagination.js
"use client";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPageNumbers = 5,
}) {
  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(showPageNumbers / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + showPageNumbers - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < showPageNumbers) {
      start = Math.max(1, end - showPageNumbers + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className='pagination justify-center'>
      <div className='pagination__list'>
        {/* Previous Button */}
        <button
          className={`pagination__button ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <i className='icon-arrow-left'></i>
        </button>

        {/* First page if not visible */}
        {visiblePages[0] > 1 && (
          <>
            <button
              className='pagination__button'
              onClick={() => handlePageChange(1)}>
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className='pagination__button disabled'>...</span>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            className={`pagination__button ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}

        {/* Last page if not visible */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className='pagination__button disabled'>...</span>
            )}
            <button
              className='pagination__button'
              onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          className={`pagination__button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          <i className='icon-arrow-right'></i>
        </button>
      </div>
    </div>
  );
}
