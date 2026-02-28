// ============================================================
// hooks/useTasks.ts
// Custom React hook for interacting with tasks.
// A "custom hook" groups related logic so components stay clean.
// Components call useTasks() instead of managing state directly.
// ============================================================

"use client"; // This hook runs on the client side (browser)

import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { RootState, AppDispatch } from "@/store";
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setFilters,
  setLoading,
  setError,
  setSelectedTask,
} from "@/store/taskSlice";
import {
  Task,
  TaskFilters,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types/task";

// The hook returns all these values/functions
// This is what components get when they call useTasks()
export function useTasks() {
  // useDispatch: lets us send actions to the Redux store
  const dispatch = useDispatch<AppDispatch>();

  // useSelector: reads data FROM the Redux store
  // We're reading everything from the "tasks" slice of state
  const { tasks, filters, isLoading, error, selectedTask } = useSelector(
    (state: RootState) => state.tasks,
  );

  // ---- DERIVED STATE (computed from tasks + filters) ----

  // filteredTasks: the tasks array after applying all filters
  // This gets recalculated automatically when tasks or filters change
  const filteredTasks = tasks.filter((task) => {
    // Check if task matches the status filter
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    // Check if task matches the priority filter
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    // Check if task matches the search text (case-insensitive)
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      filters.search === "" ||
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    // Task must pass ALL three filters
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // ---- API FUNCTIONS ----
  // useCallback prevents these functions from being recreated on every render

  // fetchTasks: GET all tasks from the API
  const fetchTasks = useCallback(async () => {
    dispatch(setLoading(true)); // Show loading state
    try {
      const response = await fetch("/api/tasks"); // Call our API route
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await response.json(); // Parse JSON response
      dispatch(setTasks(data)); // Save tasks to Redux store
    } catch (err) {
      // If anything goes wrong, save the error message
      dispatch(setError(err instanceof Error ? err.message : "Unknown error"));
    }
  }, [dispatch]);

  // createTask: POST a new task to the API
  const createTask = useCallback(
    async (taskData: CreateTaskInput) => {
      dispatch(setLoading(true));
      try {
        const response = await fetch("/api/tasks", {
          method: "POST", // HTTP POST method
          headers: { "Content-Type": "application/json" }, // Tell API we're sending JSON
          body: JSON.stringify(taskData), // Convert task to JSON string
        });
        if (!response.ok) throw new Error("Failed to create task");
        const newTask: Task = await response.json(); // Get the created task back
        dispatch(addTask(newTask)); // Add to Redux store
        return newTask; // Return it to the caller
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Unknown error"),
        );
        return null;
      }
    },
    [dispatch],
  );

  // editTask: PUT (update) an existing task
  const editTask = useCallback(
    async (id: string, taskData: UpdateTaskInput) => {
      dispatch(setLoading(true));
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          // URL with task ID
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to update task");
        const updatedTask: Task = await response.json();
        dispatch(updateTask(updatedTask)); // Update in Redux store
        return updatedTask;
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Unknown error"),
        );
        return null;
      }
    },
    [dispatch],
  );

  // removeTask: DELETE a task by ID
  const removeTask = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE", // HTTP DELETE method
        });
        if (!response.ok) throw new Error("Failed to delete task");
        dispatch(deleteTask(id)); // Remove from Redux store
        return true;
      } catch (err) {
        dispatch(
          setError(err instanceof Error ? err.message : "Unknown error"),
        );
        return false;
      }
    },
    [dispatch],
  );

  // updateFilters: change the current filters
  const updateFilters = useCallback(
    (newFilters: Partial<TaskFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  // selectTask: set which task is currently selected/viewed
  const selectTask = useCallback(
    (task: Task | null) => {
      dispatch(setSelectedTask(task));
    },
    [dispatch],
  );

  // Return everything the component needs
  return {
    // State
    tasks, // All tasks (unfiltered)
    filteredTasks, // Tasks after applying filters
    filters, // Current filter settings
    isLoading, // Is data loading?
    error, // Error message or null
    selectedTask, // Currently selected task

    // Actions
    fetchTasks, // Load tasks from API
    createTask, // Create a new task
    editTask, // Update existing task
    removeTask, // Delete a task
    updateFilters, // Change filters
    selectTask, // Select a task for viewing
  };
}
