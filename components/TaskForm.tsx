"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createTask, editTask } from "@/store/taskSlice";
import { useTaskForm } from "@/hooks/useTaskForm";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import { Save, ArrowLeft } from "lucide-react";

interface TaskFormProps {
  mode: "create" | "edit";
  existingTask?: Task;
}


function FormLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export default function TaskForm({ mode, existingTask }: TaskFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  const status = useSelector((state: RootState) => state.tasks.status);
  const isLoading = status === "loading";


  const { values, handleChange, handleSubmit, errors, reset } = useTaskForm(
    existingTask ? existingTask : undefined,
  );


  const onSubmit = () => {
    handleSubmit(async (data) => {
      if (mode === "create") {

        const result = await dispatch(createTask(data));

        if (createTask.fulfilled.match(result)) {
          router.push("/tasks");
        }
      } else if (existingTask) {

        const result = await dispatch(editTask({ id: existingTask.id, data }));
        if (editTask.fulfilled.match(result)) {
          router.push(`/tasks/${existingTask.id}`);
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">

      <div className="flex flex-col gap-1.5">
        <FormLabel htmlFor="title" required>
          Title
        </FormLabel>
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

        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>


      <div className="flex flex-col gap-1.5">
        <FormLabel htmlFor="description">Description</FormLabel>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe the task..."
          rows={4}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FormLabel htmlFor="priority" required>
            Priority
          </FormLabel>
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
          {errors.priority && (
            <p className="text-xs text-red-500">{errors.priority}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <FormLabel htmlFor="status" required>
            Status
          </FormLabel>
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
          {errors.status && (
            <p className="text-xs text-red-500">{errors.status}</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FormLabel htmlFor="dueDate" required>
            Due Date
          </FormLabel>
          <input
            id="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            className={cn(
              "px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.dueDate ? "border-red-400 bg-red-50" : "border-gray-200",
            )}
          />
          {errors.dueDate && (
            <p className="text-xs text-red-500">{errors.dueDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <FormLabel htmlFor="assignedTo">Assigned To</FormLabel>
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


      <div className="flex flex-col gap-1.5">
        <FormLabel htmlFor="tags">
          Tags{" "}
          <span className="text-xs text-gray-400 font-normal">
            (comma-separated)
          </span>
        </FormLabel>
        <input
          id="tags"
          type="text"
          value={values.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          placeholder="frontend, bug, urgent..."
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      <div className="flex items-center justify-between pt-4 border-t border-gray-100">

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex items-center gap-3">

          {mode === "create" && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}


          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg
                       hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (

              <LoadingSpinner size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading
              ? "Saving..."
              : mode === "create"
                ? "Create Task"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
