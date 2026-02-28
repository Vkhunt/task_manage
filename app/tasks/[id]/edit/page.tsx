// ============================================================
// app/tasks/[id]/edit/page.tsx
// EDIT TASK PAGE
//
// Spec requirements:
//   - Client Component ("use client")
//   - Fetches the existing task via useEffect
//     (or reads from Redux state if already loaded)
//   - Pre-fills form using useTaskForm({ initialValues: existingTask })
//   - On submit, dispatches editTask Redux thunk
// ============================================================

"use client"; // Must be client — uses hooks, useEffect, dispatch

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Get [id] from URL
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { editTask } from "@/store/taskSlice"; // Async thunk
import { useTaskForm } from "@/hooks/useTaskForm"; // Custom hook
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTaskPage() {
  const params = useParams<{ id: string }>(); // Get task id from URL
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Read tasks already in Redux store (if user came from task list)
  const existingInRedux = useSelector((state: RootState) =>
    state.tasks.tasks.find((t) => t.id === params.id),
  );

  // Loading / error state for fetching
  const [task, setTask] = useState<Task | null>(existingInRedux ?? null);
  const [fetchLoading, setFetchLoading] = useState(!existingInRedux); // Only load if not in Redux
  const [fetchError, setFetchError] = useState<string | null>(null);

  const reduxStatus = useSelector((state: RootState) => state.tasks.status);
  const isSaving = reduxStatus === "loading";

  // ---- useEffect: fetch task if NOT already in Redux ----
  // Spec: "fetches the existing task via useEffect
  //        OR reads from Redux state if already loaded"
  useEffect(() => {
    // If we already have it from Redux, skip fetching
    if (existingInRedux) {
      setTask(existingInRedux);
      setFetchLoading(false);
      return;
    }

    // Otherwise fetch from the API
    const fetchTask = async () => {
      try {
        setFetchLoading(true);
        const res = await fetch(`/api/tasks/${params.id}`);
        if (!res.ok) throw new Error("Task not found");
        const data: Task = await res.json();
        setTask(data);
      } catch (err) {
        setFetchError(
          err instanceof Error ? err.message : "Failed to load task",
        );
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTask();
  }, [params.id, existingInRedux]);

  // ---- useTaskForm with initialValues from the fetched task ----
  // Spec: "Pre-fills the form with existing task data using
  //        useTaskForm({ initialValues: existingTask })"
  // We pass "task ?? undefined" — if task is null, pass undefined (empty form)
  const { values, handleChange, handleSubmit, errors } = useTaskForm(
    task ?? undefined,
  );

  // ---- Submit handler ----
  const onSubmit = () => {
    if (!task) return;

    handleSubmit(async (data) => {
      // Dispatch editTask thunk → PUT /api/tasks/:id
      const result = await dispatch(editTask({ id: task.id, data }));

      // Navigate to task detail after success
      if (editTask.fulfilled.match(result)) {
        router.push(`/tasks/${task.id}`);
      }
    });
  };

  // ---- LOADING STATE ----
  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <LoadingSpinner size="lg" label="Loading task..." />
      </div>
    );
  }

  // ---- ERROR STATE ----
  if (fetchError || !task) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-red-500 font-medium">
          {fetchError ?? "Task not found"}
        </p>
        <Link
          href="/tasks"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* ---- BREADCRUMB ---- */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/tasks" className="hover:text-gray-900">
          Tasks
        </Link>
        <span>/</span>
        <Link
          href={`/tasks/${task.id}`}
          className="hover:text-gray-900 truncate max-w-[180px]"
        >
          {task.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      {/* ---- PAGE CARD ---- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
          <p className="text-sm text-gray-500 mt-1">Update the details below</p>
        </div>

        {/* ---- FORM using values + handleChange from useTaskForm ---- */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={values.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={cn(
                "px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.title ? "border-red-400 bg-red-50" : "border-gray-200",
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={values.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="priority"
                className="text-sm font-medium text-gray-700"
              >
                Priority
              </label>
              <select
                id="priority"
                value={values.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={values.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">📋 Todo</option>
                <option value="in-progress">⏳ In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>
          </div>

          {/* Due Date + Assigned To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="dueDate"
                className="text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={values.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className={cn(
                  "px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                  errors.dueDate
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200",
                )}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500">{errors.dueDate}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="assignedTo"
                className="text-sm font-medium text-gray-700"
              >
                Assigned To
              </label>
              <input
                id="assignedTo"
                type="text"
                value={values.assignedTo}
                onChange={(e) => handleChange("assignedTo", e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags{" "}
              <span className="text-xs text-gray-400 font-normal">
                (comma-separated)
              </span>
            </label>
            <input
              id="tags"
              type="text"
              value={values.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="frontend, bug, urgent..."
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
