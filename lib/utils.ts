import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskPriority, TaskStatus } from "@/types/task";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function formatDate(dateString: string): string {

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}


export function getPriorityColor(priority: TaskPriority): string {

  switch (priority) {
    case "high":
      return "text-red-500 bg-red-50 border-red-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low":
      return "text-green-600 bg-green-50 border-green-200";
    default:
      return "text-gray-500 bg-gray-50 border-gray-200";
  }
}


export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "done":
      return "text-green-700 bg-green-100 border-green-300";
    case "in-progress":
      return "text-blue-700 bg-blue-100 border-blue-300";
    case "todo":
      return "text-gray-700 bg-gray-100 border-gray-300";
    default:
      return "text-gray-700 bg-gray-100 border-gray-300";
  }
}


export function isOverdue(dueDate: string): boolean {
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  return due < today;
}
