"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Task } from "@/types/task";

export function useTaskFilters() {

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filters = useSelector((state: RootState) => state.tasks.filters);


  const filteredTasks: Task[] = useMemo(() => {

    let result = [...tasks];


    if (filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status);
    }


    if (filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority);
    }


    if (filters.search.trim() !== "") {

      const keyword = filters.search.toLowerCase();

      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(keyword) ||
          task.description.toLowerCase().includes(keyword),
      );
    }


    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }, [tasks, filters]);


  const isFiltered =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.search.trim() !== "";

  return {
    filteredTasks,
    totalCount: tasks.length,
    isFiltered,
  };
}
