// ============================================================
// components/TaskFilters.tsx
// Filter bar for the task list page.
// Lets users filter tasks by status, priority, and search text.
// ============================================================

"use client";

import { useTasks } from "@/hooks/useTasks"; // Our custom hook
import { TaskStatus, TaskPriority } from "@/types/task";
import { Search, Filter, X } from "lucide-react";

export default function TaskFilters() {
  // Get filters and updateFilters from our custom hook
  const { filters, updateFilters, filteredTasks, tasks } = useTasks();

  // Reset all filters to defaults
  const clearFilters = () => {
    updateFilters({ status: "all", priority: "all", search: "" });
  };

  // Check if any filters are currently active
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.search !== "";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* ---- FILTER ICON ---- */}
      <div className="flex items-center gap-2 text-gray-500 shrink-0">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      {/* ---- SEARCH INPUT ---- */}
      <div className="relative flex-1 min-w-0">
        {/* Search icon inside the input */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks by title, description, or tag..."
          value={filters.search} // Controlled input - value comes from Redux state
          onChange={
            (e) => updateFilters({ search: e.target.value }) // Update search in Redux on every keystroke
          }
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* ---- STATUS FILTER DROPDOWN ---- */}
      <select
        value={filters.status} // Current status filter value
        onChange={(e) =>
          // Cast to correct type - TypeScript needs us to be explicit here
          updateFilters({ status: e.target.value as TaskStatus | "all" })
        }
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
      >
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* ---- PRIORITY FILTER DROPDOWN ---- */}
      <select
        value={filters.priority}
        onChange={(e) =>
          updateFilters({ priority: e.target.value as TaskPriority | "all" })
        }
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* ---- RESULT COUNT ---- */}
      <span className="text-sm text-gray-500 shrink-0">
        {filteredTasks.length} / {tasks.length} tasks
      </span>

      {/* ---- CLEAR FILTERS BUTTON (only shown when filters are active) ---- */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 shrink-0"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}
