import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded-md shadow hover:shadow-lg transition"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaArrowLeft />
      </button>
      <button
        className="px-4 py-2 bg-gray-200 rounded-md shadow hover:shadow-lg transition"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;