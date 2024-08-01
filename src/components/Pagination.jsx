import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useStateContext } from "../contexts/ContextProvider";
import {useLocation} from "react-router-dom";

const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const {pathname} = useLocation()
  const { currentColor, currentPage, setCurrentPage, setPage } = useStateContext();
  // const [currentPage, setCurrentPage] = useState(
  //   localStorage.getItem("currentPage") ? parseInt(localStorage.getItem("currentPage")) : 1
  // );
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 8;

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  // useEffect(() => {
  //   localStorage.setItem("currentPage", 1)
  //   setCurrentPage(1)
  // }, [pathname, onPageChange]);

  const handlePageChange = (page) => {
    setPage(page)
    onPageChange(page)
    localStorage.setItem("currentPage", page);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        const isActive = currentPage === i;

        paginationItems.push(
          <li
            key={i}
            className="inline-block mx-1 rounded border cursor-pointer"
            style={{
              backgroundColor: isActive ? currentColor : '#fff',
              color: isActive ? '#fff' : currentColor,
            }}
            onClick={() => handlePageChange(i)}
          >
            <button className="py-1 w-8 focus:outline-none">
              {i}
            </button>
          </li>
        );
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      if (startPage > 1) {
        paginationItems.push(
          <li
            key={1}
            className="inline-block mx-1 rounded border cursor-pointer"
            style={{
              backgroundColor: currentPage === 1 ? currentColor : '#fff',
              color: currentPage === 1 ? '#fff' : currentColor,
            }}
            onClick={() => handlePageChange(1)}
          >
            <button className="py-1 w-8 focus:outline-none">
              1
            </button>
          </li>
        );

        if (startPage > 2) {
          paginationItems.push(
            <li key="start-ellipsis">
              <span className="inline-block mx-1">&hellip;</span>
            </li>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        const isActive = currentPage === i;

        paginationItems.push(
          <li
            key={i}
            className="inline-block mx-1 rounded border cursor-pointer"
            style={{
              backgroundColor: isActive ? currentColor : '#fff',
              color: isActive ? '#fff' : currentColor,
            }}
            onClick={() => handlePageChange(i)}
          >
            <button className="py-1 w-8 focus:outline-none">
              {i}
            </button>
          </li>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          paginationItems.push(
            <li key="end-ellipsis">
              <span className="inline-block mx-1">&hellip;</span>
            </li>
          );
        }

        paginationItems.push(
          <li
            key={totalPages}
            className="inline-block mx-1 rounded border cursor-pointer"
            style={{
              backgroundColor: currentPage === totalPages ? currentColor : '#fff',
              color: currentPage === totalPages ? '#fff' : currentColor,
            }}
            onClick={() => handlePageChange(totalPages)}
          >
            <button className="py-1 w-8 focus:outline-none">
              {totalPages}
            </button>
          </li>
        );
      }
    }

    return paginationItems;
  };

  return (
    <ul className="flex items-center mt-8 justify-end">
      <li>
        <button
          className={`focus:outline-none ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FiChevronLeft />
        </button>
      </li>
      {renderPaginationItems()}
      <li>
        <button
          className={`focus:outline-none ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FiChevronRight />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;

