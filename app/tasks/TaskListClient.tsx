"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { AppDispatch, RootState } from "@/store";
import { fetchTasks, removeTask } from "@/store/taskSlice";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { usePagination } from "@/hooks/usePagination";
import TaskCard from "@/components/TaskCard";
import TaskFiltersBar from "@/components/TaskFiltersBar";
import ConfirmDialog from "@/components/ConfirmDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";


const PAGE_SIZE = 6;


interface TaskListClientProps {
  initialTasks: Task[];
}

export default function TaskListClient({ initialTasks }: TaskListClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();


  const { status, error } = useSelector((state: RootState) => state.tasks);


  const { filteredTasks, totalCount, isFiltered } = useTaskFilters();


  const { currentPage, totalPages, nextPage, prevPage, goToPage, pageItems } =
    usePagination(filteredTasks.length, PAGE_SIZE);


  const currentPageTasks = pageItems(filteredTasks);


  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({ open: false, taskId: null, taskTitle: "" });


  useEffect(() => {
    if (initialTasks.length > 0 && totalCount === 0) {

      import("@/store/taskSlice").then(({ setTasks }) => {
        dispatch(setTasks(initialTasks));
      });
    }

  }, []);


  const handleEdit = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };


  const handleDeleteClick = (id: string) => {
    const task = filteredTasks.find((t) => t.id === id);
    setDeleteDialog({
      open: true,
      taskId: id,
      taskTitle: task?.title ?? "this task",
    });
  };


  const handleDeleteConfirm = async () => {
    if (!deleteDialog.taskId) return;
    await dispatch(removeTask(deleteDialog.taskId));
    setDeleteDialog({ open: false, taskId: null, taskTitle: "" });

    if (currentPageTasks.length === 1 && currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6">

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


      <TaskFiltersBar />


      {status === "loading" && (
        <div className="py-16">
          <LoadingSpinner size="lg" label="Loading tasks..." />
        </div>
      )}


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


      {status !== "loading" && (
        <>
          {currentPageTasks.length === 0 ? (

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPageTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}


          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">

              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg
                           hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>


              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white font-medium"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}


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


      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteDialog.taskTitle}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        destructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteDialog({ open: false, taskId: null, taskTitle: "" })
        }
      />
    </div>
  );
}
