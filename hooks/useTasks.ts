// ============================================================
// hooks/useTasks.ts
// Legacy custom hook — wraps Redux thunks for components that
// don't import dispatch/thunks directly.
//
// NOTE: New pages use Redux thunks directly (createTask, editTask, etc.)
//       This hook is kept for backwards compatibility only.
// ============================================================

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { RootState, AppDispatch } from "@/store";
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilters,
  setSelectedTask,
  // NOTE: setLoading and setError were removed in the new taskSlice.
  // Status is now tracked via status: "idle"|"loading"|"succeeded"|"failed"
} from "@/store/taskSlice";
import { Task, TaskFilters } from "@/types/task";

export function useTasks() {
  const dispatch = useDispatch<AppDispatch>();

  // Read from Redux store — using the new state shape
  // "status" replaces the old "isLoading" boolean
  const { tasks, filters, status, error, selectedTask } = useSelector(
    (state: RootState) => state.tasks,
  );

  // isLoading: derived from status for backwards compatibility
  const isLoading = status === "loading";

  // ---- DERIVED STATE: apply filters client-side ----
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      filters.search === "" ||
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchLower));
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // ---- API FUNCTIONS ----

  // fetchTasks: GET /api/tasks — manually calls API and syncs to Redux
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await response.json();
      dispatch(setTasks(data)); // Use setTasks sync reducer
    } catch (err) {
      console.error("fetchTasks error:", err);
    }
  }, [dispatch]);

  // createTask: POST /api/tasks
  const createTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt">) => {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to create task");
        const newTask: Task = await response.json();
        dispatch(addTask(newTask)); // Sync reducer — add to Redux
        return newTask;
      } catch (err) {
        console.error("createTask error:", err);
        return null;
      }
    },
    [dispatch],
  );

  // editTask: PUT /api/tasks/:id
  // NOTE: updateTask reducer now takes { id, data } not the full task
  const editTask = useCallback(
    async (id: string, taskData: Partial<Task>) => {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to update task");
        const updatedTask: Task = await response.json();
        // Pass { id, data } shape to match new updateTask reducer signature
        dispatch(updateTask({ id, data: updatedTask }));
        return updatedTask;
      } catch (err) {
        console.error("editTask error:", err);
        return null;
      }
    },
    [dispatch],
  );

  // removeTask: DELETE /api/tasks/:id
  const removeTask = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete task");
        dispatch(deleteTask(id)); // Sync reducer — remove from Redux
        return true;
      } catch (err) {
        console.error("removeTask error:", err);
        return false;
      }
    },
    [dispatch],
  );

  // updateFilters: change the active filters
  const updateFilters = useCallback(
    (newFilters: Partial<TaskFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  // selectTask: set which task is currently viewed
  const selectTask = useCallback(
    (task: Task | null) => {
      dispatch(setSelectedTask(task));
    },
    [dispatch],
  );

  return {
    tasks,
    filteredTasks,
    filters,
    isLoading, // Derived from status === "loading"
    error,
    selectedTask,
    fetchTasks,
    createTask,
    editTask,
    removeTask,
    updateFilters,
    selectTask,
  };
}
