import PropTypes from "prop-types";

const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6">
      {/* Pagination Container */}
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium border border-[#B7B4FF] rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Previous
        </button>

        {[...Array(totalPages)]?.map((_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-4 py-2 text-sm font-medium border border-[#B7B4FF] rounded-lg ${
                currentPage === page
                  ? "bg-[#393185] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium border border-[#B7B4FF] rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>

      {/* Current Page Indicator */}
      <p className="mt-4 text-sm text-gray-600">
        Page <span className="font-bold">{currentPage}</span> of{" "}
        <span className="font-bold">{totalPages}</span>
      </p>
    </div>
  );
};

export default PaginationComponent;

PaginationComponent.propTypes = {
  totalPages: PropTypes.any.isRequired,
  currentPage: PropTypes.any.isRequired,
  setCurrentPage: PropTypes.any.isRequired,
};
