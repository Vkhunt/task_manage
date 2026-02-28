// ============================================================
// components/TaskFiltersBar.tsx
// A search + filter toolbar for the task list.
//
// Props (exact interface from spec):
//   className? : string — external CSS class overrides
//
// Features:
//   - Search input (filters by title/description)
//   - Status dropdown
//   - Priority dropdown
//   - "Clear Filters" button (only shown when a filter is active)
//   - All changes dispatch to Redux immediately (no "Apply" button needed)
// ============================================================

"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setFilters, clearFilters } from "@/store/taskSlice";
import { TaskStatus, TaskPriority } from "@/types/task";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { cn } from "@/lib/utils";
import { Search, X, SlidersHorizontal } from "lucide-react";

// ---- Exact props interface from spec ----
interface TaskFiltersBarProps {
  className?: string;
}

export default function TaskFiltersBar({ className }: TaskFiltersBarProps) {
  // dispatch: sends actions to Redux store
  const dispatch = useDispatch<AppDispatch>();

  // Read current filter values from Redux (controlled inputs)
  const filters = useSelector((state: RootState) => state.tasks.filters);

  // isFiltered: true if any filter is currently active (from our hook)
  const { isFiltered, filteredTasks, totalCount } = useTaskFilters();

  // ---- Handlers — dispatch to Redux IMMEDIATELY on every change ----

  // handleSearch: dispatches on every keystroke (no delay)
  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  // handleStatus: dispatches when status dropdown changes
  const handleStatus = (value: string) => {
    dispatch(setFilters({ status: value as TaskStatus | "all" }));
  };

  // handlePriority: dispatches when priority dropdown changes
  const handlePriority = (value: string) => {
    dispatch(setFilters({ priority: value as TaskPriority | "all" }));
  };

  // handleClear: resets all filters to defaults
  const handleClear = () => {
    dispatch(clearFilters());
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm p-3",
        "flex flex-col sm:flex-row items-start sm:items-center gap-3",
        className,
      )}
    >
      {/* ---- Filter icon + label ---- */}
      <div className="flex items-center gap-1.5 text-gray-500 shrink-0">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:block">Filters</span>
      </div>

      {/* ---- SEARCH INPUT ---- */}
      <div className="relative flex-1 min-w-0 w-full sm:w-auto">
        {/* Search icon inside the left side of the input */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={filters.search} // Controlled: value = Redux state
          onChange={(e) => handleSearch(e.target.value)} // Dispatch on keystroke
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* ---- STATUS DROPDOWN ---- */}
      <select
        value={filters.status} // Controlled dropdown
        onChange={(e) => handleStatus(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
      >
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* ---- PRIORITY DROPDOWN ---- */}
      <select
        value={filters.priority}
        onChange={(e) => handlePriority(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
      >
        <option value="all">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      {/* ---- RESULT COUNT ---- */}
      <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
        {filteredTasks.length} / {totalCount}
      </span>

      {/* ---- CLEAR FILTERS BUTTON ----
          Only rendered when isFiltered is true (spec requirement)
          "isFiltered: only appears when at least one filter is active" */}
      {isFiltered && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700
                     shrink-0 whitespace-nowrap transition-colors"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
