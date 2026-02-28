// ============================================================
// app/tasks/TaskListClient.tsx
// Client component for the task list page.
//
// Uses:
//   useTaskFilters() → filtered + sorted tasks from Redux
//   usePagination()  → slice filtered tasks into pages
//   useDispatch()    → send fetchTasks / removeTask thunks
//   ConfirmDialog    → confirmation before deleting
//   TaskFiltersBar   → search + filter dropdowns
//   TaskCard         → individual task card with hover actions
//   LoadingSpinner   → shown while fetching tasks
// ============================================================

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { AppDispatch, RootState } from "@/store";
import { fetchTasks, removeTask } from "@/store/taskSlice";
import { useTaskFilters } from "@/hooks/useTaskFilters"; // ← custom hook
import { usePagination } from "@/hooks/usePagination"; // ← custom hook
import TaskCard from "@/components/TaskCard";
import TaskFiltersBar from "@/components/TaskFiltersBar";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";

// Number of tasks to show per page
const PAGE_SIZE = 6;

// Props: server pre-fetched tasks to seed Redux on first load
interface TaskListClientProps {
  initialTasks: Task[];
}

export default function TaskListClient({ initialTasks }: TaskListClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Read Redux status to know if we're loading or failed
  const { status, error } = useSelector((state: RootState) => state.tasks);

  // ---- useTaskFilters: filtered + sorted tasks ----
  // Reads tasks + filters from Redux, applies all filter logic
  const { filteredTasks, totalCount, isFiltered } = useTaskFilters();

  // ---- usePagination: slice filtered tasks into pages ----
  // filteredTasks.length = total items, PAGE_SIZE = items per page
  const { currentPage, totalPages, nextPage, prevPage, goToPage, pageItems } =
    usePagination(filteredTasks.length, PAGE_SIZE);

  // Get only the tasks for the current page
  const currentPageTasks = pageItems(filteredTasks);

  // ---- Delete confirmation dialog state ----
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({ open: false, taskId: null, taskTitle: "" });

  // ---- Seed Redux from server-fetched initialTasks on mount ----
  // The server already fetched tasks and passed them as props.
  // We sync them into Redux so client-side filtering/pagination works.
  useEffect(() => {
    if (initialTasks.length > 0 && totalCount === 0) {
      // setTasks is a sync reducer — no API call needed (already have the data)
      import("@/store/taskSlice").then(({ setTasks }) => {
        dispatch(setTasks(initialTasks));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Edit handler — navigate to edit page ----
  const handleEdit = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  // ---- Delete handler — opens the confirm dialog ----
  const handleDeleteClick = (id: string) => {
    const task = filteredTasks.find((t) => t.id === id);
    setDeleteDialog({
      open: true,
      taskId: id,
      taskTitle: task?.title ?? "this task",
    });
  };

  // ---- Confirm delete — dispatches removeTask thunk ----
  const handleDeleteConfirm = async () => {
    if (!deleteDialog.taskId) return;
    await dispatch(removeTask(deleteDialog.taskId)); // DELETE /api/tasks/:id
    setDeleteDialog({ open: false, taskId: null, taskTitle: "" });
    // If we deleted the last item on a page, go back one page
    if (currentPageTasks.length === 1 && currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ---- PAGE HEADER ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isFiltered
              ? `${filteredTasks.length} of ${totalCount} tasks match your filters`
              : `${totalCount} total tasks`}
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Link>
      </div>

      {/* ---- FILTERS BAR (uses TaskFiltersBar with Redux dispatch) ---- */}
      <TaskFiltersBar />

      {/* ---- LOADING STATE ---- */}
      {status === "loading" && (
        <div className="py-16">
          <LoadingSpinner size="lg" label="Loading tasks..." />
        </div>
      )}

      {/* ---- ERROR STATE ---- */}
      {status === "failed" && (
        <div className="text-center py-16 text-red-500">
          <p className="font-medium">Failed to load tasks</p>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
          <button
            onClick={() => dispatch(fetchTasks())}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* ---- TASK GRID ---- */}
      {status !== "loading" && (
        <>
          {currentPageTasks.length === 0 ? (
            // Empty state
            <div className="text-center py-20">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-500 font-medium">No tasks found</h3>
              <p className="text-gray-400 text-sm mt-1">
                {isFiltered
                  ? "Try clearing your filters"
                  : "Create your first task to get started"}
              </p>
              <Link
                href="/create"
                className="mt-4 inline-block text-sm text-blue-600 hover:underline"
              >
                Create a task →
              </Link>
            </div>
          ) : (
            // Grid — 3 cols on desktop, 2 on tablet, 1 on mobile
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPageTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit} // ← uses spec's onEdit prop
                  onDelete={handleDeleteClick} // ← uses spec's onDelete prop
                />
              ))}
            </div>
          )}

          {/* ---- PAGINATION CONTROLS ---- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {/* Prev button */}
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                           hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              {/* Page number buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white font-medium" // Active page
                        : "border border-gray-200 hover:bg-gray-50" // Other pages
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next button */}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                           hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ---- CONFIRM DELETE DIALOG ---- */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteDialog.taskTitle}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        destructive={true} // Red confirm button for delete
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteDialog({ open: false, taskId: null, taskTitle: "" })
        }
      />
    </div>
  );
}
