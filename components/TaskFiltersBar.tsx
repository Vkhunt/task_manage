"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setFilters, clearFilters } from "@/store/taskSlice";
import { TaskStatus, TaskPriority } from "@/types/task";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { cn } from "@/lib/utils";
import { Search, X, SlidersHorizontal } from "lucide-react";


interface TaskFiltersBarProps {
  className?: string;
}

export default function TaskFiltersBar({ className }: TaskFiltersBarProps) {

  const dispatch = useDispatch<AppDispatch>();


  const filters = useSelector((state: RootState) => state.tasks.filters);


  const { isFiltered, filteredTasks, totalCount } = useTaskFilters();




  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value }));
  };


  const handleStatus = (value: string) => {
    dispatch(setFilters({ status: value as TaskStatus | "all" }));
  };


  const handlePriority = (value: string) => {
    dispatch(setFilters({ priority: value as TaskPriority | "all" }));
  };


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

      <div className="flex items-center gap-1.5 text-gray-500 shrink-0">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:block">Filters</span>
      </div>


      <div className="relative flex-1 min-w-0 w-full sm:w-auto">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>


      <select
        value={filters.status}
        onChange={(e) => handleStatus(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
      >
        <option value="all">All Statuses</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>


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


      <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
        {filteredTasks.length} / {totalCount}
      </span>


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
