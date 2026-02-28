// ============================================================
// hooks/useTaskFilters.ts
// Custom hook that reads filter state from Redux and returns
// a filtered (and sorted) list of tasks.
//
// Returns:
//   filteredTasks : Task[]   — tasks after all filters applied
//   totalCount    : number   — total unfiltered task count
//   isFiltered    : boolean  — true if any filter is currently active
// ============================================================

"use client";

import { useMemo } from "react"; // useMemo = cache expensive computation
import { useSelector } from "react-redux"; // Read data from Redux store
import { RootState } from "@/store"; // Root state type
import { Task } from "@/types/task";

export function useTaskFilters() {
  // Read tasks and filters from the Redux "tasks" slice
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filters = useSelector((state: RootState) => state.tasks.filters);

  // useMemo caches the computed value.
  // It ONLY re-calculates when tasks or filters change.
  // Without useMemo, filtering runs on every single re-render (slow).
  const filteredTasks: Task[] = useMemo(() => {
    // Start with all tasks, then narrow them down
    let result = [...tasks]; // Spread to avoid mutating the original array

    // ---- Filter 1: STATUS ----
    // If status filter is NOT "all", keep only tasks with matching status
    if (filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status);
    }

    // ---- Filter 2: PRIORITY ----
    // If priority filter is NOT "all", keep only tasks with matching priority
    if (filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority);
    }

    // ---- Filter 3: SEARCH ----
    // If search text is not empty, filter by title or description
    if (filters.search.trim() !== "") {
      // Convert search to lowercase once (not inside filter to avoid repetition)
      const keyword = filters.search.toLowerCase();

      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(keyword) || // Match in title
          task.description.toLowerCase().includes(keyword), // Match in description
      );
    }

    // ---- Sort: newest tasks first ----
    // Sort by createdAt date, descending (newest at top)
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }, [tasks, filters]); // Recalculate only when tasks or filters change

  // ---- isFiltered: true if ANY filter is currently active ----
  // This tells the UI to show a "Clear Filters" button, etc.
  const isFiltered =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.search.trim() !== "";

  return {
    filteredTasks, // The filtered + sorted task list
    totalCount: tasks.length, // Total tasks BEFORE filtering
    isFiltered, // Whether any filter is currently active
  };
}
