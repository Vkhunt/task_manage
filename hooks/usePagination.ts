// ============================================================
// hooks/usePagination.ts
// Custom hook that handles pagination logic for any list of items.
//
// Accepts:
//   totalItems : number  — total number of items in the full list
//   pageSize   : number  — how many items to show per page
//
// Returns:
//   currentPage          — the currently active page number (1-based)
//   totalPages           — total number of pages
//   goToPage(page)       — jump directly to a specific page number
//   nextPage()           — go to the next page (if not on last page)
//   prevPage()           — go to the previous page (if not on first page)
//   pageItems(items)     — takes the full array, returns only the current page slice
// ============================================================

"use client";

import { useState, useCallback, useMemo } from "react";

// Generic type <T> means this hook works with any type of array:
//   usePagination<Task>(tasks.length, 10)  → works for tasks
//   usePagination<string>(tags.length, 5) → works for strings too
export function usePagination(totalItems: number, pageSize: number) {
  // currentPage is 1-based (page 1, 2, 3, ...)
  // We start on page 1
  const [currentPage, setCurrentPage] = useState(1);

  // ---- totalPages ----
  // Math.ceil rounds UP so that remainders get their own page
  // Example: 25 items / 10 per page = Math.ceil(2.5) = 3 pages
  // Math.max ensures totalPages is at least 1 (even if totalItems is 0)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  // ---- goToPage ----
  // Jumps to a specific page number.
  // Clamps the page between 1 and totalPages to prevent going out of bounds.
  const goToPage = useCallback(
    (page: number) => {
      // Math.min prevents going past the last page
      // Math.max prevents going before page 1
      const safePage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(safePage);
    },
    [totalPages],
  );

  // ---- nextPage ----
  // Moves to the next page, but won't go past the last page
  const nextPage = useCallback(() => {
    setCurrentPage(
      (prev) => (prev < totalPages ? prev + 1 : prev), // Only increment if not on last page
    );
  }, [totalPages]);

  // ---- prevPage ----
  // Moves to the previous page, but won't go before page 1
  const prevPage = useCallback(() => {
    setCurrentPage(
      (prev) => (prev > 1 ? prev - 1 : prev), // Only decrement if not on first page
    );
  }, []);

  // ---- pageItems ----
  // Takes the FULL array and returns only the items for the current page.
  // Generic <T> means it works with any array type.
  //
  // How slicing works:
  //   Page 1: start=0,  end=10  → items[0..9]
  //   Page 2: start=10, end=20  → items[10..19]
  //   Page 3: start=20, end=30  → items[20..29]
  //
  // Example:
  //   pageItems(allTasks)  → returns the 10 tasks for the current page
  const pageItems = useCallback(
    <T>(items: T[]): T[] => {
      const start = (currentPage - 1) * pageSize; // First index on this page
      const end = start + pageSize; // One past the last index
      return items.slice(start, end); // Extract the slice
    },
    [currentPage, pageSize],
  );

  return {
    currentPage, // Which page we're on (number, 1-based)
    totalPages, // How many pages total
    goToPage, // Jump to any page: goToPage(3)
    nextPage, // Go forward one page: nextPage()
    prevPage, // Go back one page: prevPage()
    pageItems, // Get current page items: pageItems(allTasks)
  };
}
