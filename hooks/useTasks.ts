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

} from "@/store/taskSlice";
import { Task, TaskFilters } from "@/types/task";

export function useTasks() {
  const dispatch = useDispatch<AppDispatch>();


  const { tasks, filters, status, error, selectedTask } = useSelector(
    (state: RootState) => state.tasks,
  );


  const isLoading = status === "loading";


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




  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data: Task[] = await response.json();
      dispatch(setTasks(data));
    } catch (err) {
      console.error("fetchTasks error:", err);
    }
  }, [dispatch]);


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
        dispatch(addTask(newTask));
        return newTask;
      } catch (err) {
        console.error("createTask error:", err);
        return null;
      }
    },
    [dispatch],
  );


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

        dispatch(updateTask({ id, data: updatedTask }));
        return updatedTask;
      } catch (err) {
        console.error("editTask error:", err);
        return null;
      }
    },
    [dispatch],
  );


  const removeTask = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete task");
        dispatch(deleteTask(id));
        return true;
      } catch (err) {
        console.error("removeTask error:", err);
        return false;
      }
    },
    [dispatch],
  );


  const updateFilters = useCallback(
    (newFilters: Partial<TaskFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );


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
    isLoading,
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
