// ============================================================
// app/create/page.tsx
// CREATE TASK PAGE
//
// Spec requirements:
//   - Client Component ("use client")
//   - Uses useTaskForm custom hook for form state
//   - On submit, dispatches createTask Redux thunk
//   - After success, navigates to /tasks using useRouter
// ============================================================

"use client"; // Client component — uses hooks and dispatch

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createTask } from "@/store/taskSlice"; // Async thunk
import { useTaskForm } from "@/hooks/useTaskForm"; // Custom hook
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateTaskPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Read Redux loading status so we can disable the button while saving
  const status = useSelector((state: RootState) => state.tasks.status);
  const isLoading = status === "loading";

  // ---- useTaskForm hook (no initialValues = empty form for create) ----
  // Returns: values, handleChange, handleSubmit, errors, reset
  const { values, handleChange, handleSubmit, errors, reset } = useTaskForm();

  // ---- Form submit ----
  // handleSubmit validates, then calls our callback with clean data
  const onSubmit = () => {
    handleSubmit(async (data) => {
      // Dispatch createTask thunk → POST /api/tasks
      const result = await dispatch(createTask(data));

      // createTask.fulfilled.match() checks if the thunk succeeded
      if (createTask.fulfilled.match(result)) {
        // Navigate to /tasks after successful create (spec requirement)
        router.push("/tasks");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* ---- BREADCRUMB ---- */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/tasks" className="hover:text-gray-900 transition-colors">
          Tasks
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Create</span>
      </div>

      {/* ---- PAGE CARD ---- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to add a new task
          </p>
        </div>

        {/* ---- FORM FIELDS (using values + handleChange from useTaskForm) ---- */}
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
              placeholder="Enter task title..."
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
              placeholder="Describe the task..."
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
                Priority <span className="text-red-500">*</span>
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
                Status <span className="text-red-500">*</span>
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
                Due Date <span className="text-red-500">*</span>
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
                placeholder="Person's name..."
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
            <Link
              href="/tasks"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <div className="flex items-center gap-3">
              {/* Reset — uses reset() from useTaskForm */}
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>

              {/* Submit — dispatches createTask thunk */}
              <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isLoading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
