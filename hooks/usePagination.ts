"use client";

import { useState, useCallback, useMemo } from "react";


export function usePagination(totalItems: number, pageSize: number) {

  const [currentPage, setCurrentPage] = useState(1);


  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );


  const goToPage = useCallback(
    (page: number) => {

      const safePage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(safePage);
    },
    [totalPages],
  );


  const nextPage = useCallback(() => {
    setCurrentPage(
      (prev) => (prev < totalPages ? prev + 1 : prev),
    );
  }, [totalPages]);


  const prevPage = useCallback(() => {
    setCurrentPage(
      (prev) => (prev > 1 ? prev - 1 : prev),
    );
  }, []);


  const pageItems = useCallback(
    <T>(items: T[]): T[] => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return items.slice(start, end);
    },
    [currentPage, pageSize],
  );

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    pageItems,
  };
}
