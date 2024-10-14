import Link from "next/link";
import React from "react";

interface PaginationBarProps {
  currPage: number;
  totalNumOfPages: number;
}

const PaginationBar = ({ currPage, totalNumOfPages }: PaginationBarProps) => {
  const maxPage = Math.min(totalNumOfPages, Math.max(currPage + 4, 10));
  const minPage = Math.max(1, Math.min(currPage - 5, maxPage - 9));
  const numberedPageItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    numberedPageItems.push(
      <Link
        href={"?page=" + page}
        key={page}
        className={`btn join-item ${currPage === page ? "btn-active pointer-events-none" : ""}`}
      >
        {page}
      </Link>,
    );
  }
  return (
    <>
      <div className="join hidden sm:block">{numberedPageItems}</div>
      <div className="join block sm:hidden">
        {currPage > 1 && (
          <Link href={"?page=" + (currPage - 1)} className="btn join-item">
            «
          </Link>
        )}
        <button className="btn join-item pointer-events-none">
          Page {currPage}
        </button>
        {currPage < totalNumOfPages && (
          <Link href={"?page=" + (currPage + 1)} className="btn join-item">
            »
          </Link>
        )}
      </div>
    </>
  );
};

export default PaginationBar;
