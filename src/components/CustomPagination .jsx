"use client";
import React from "react";

export default function CustomPagination({ totalPages, currentPage, onPageChange }) {
  // Function to get the visible page numbers for small screens
  const getVisiblePages = () => {
    if (window.innerWidth < 768) {
      // On small screens, show only 3 page numbers at a time (currentPage +/- 1)
      const visiblePages = [];
      const start = Math.max(1, currentPage - 1); // Start from 1 if we are at the first page
      const end = Math.min(totalPages, currentPage + 1); // End at totalPages if we are at the last page
      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
    }
    return Array.from({ length: totalPages }, (_, i) => i + 1); // For large screens, show all pages
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex space-x-2">
        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-3 py-1 rounded-md text-white text-sm ${
              currentPage === pageNumber
                ? "bg-cyan-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:bg-gray-500"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
