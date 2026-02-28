// ============================================================
// lib/utils.ts
// Utility/helper functions used across the whole app.
// "lib" folder = library of reusable helper code
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskPriority, TaskStatus } from "@/types/task";

// cn() = "class names" helper
// Combines Tailwind CSS classes without conflicts
// Example: cn("text-red-500", condition && "font-bold")
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatDate() - converts an ISO date string to a readable format
// Example: "2025-12-31" → "Dec 31, 2025"
export function formatDate(dateString: string): string {
  // Create a Date object from the ISO string
  const date = new Date(dateString);
  // Use built-in Intl.DateTimeFormat for nice formatting
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// getPriorityColor() - returns a Tailwind color class based on priority
// Used to color-code task cards by priority level
export function getPriorityColor(priority: TaskPriority): string {
  // Switch statement checks each case and returns matching color
  switch (priority) {
    case "high":
      return "text-red-500 bg-red-50 border-red-200"; // Red for high
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"; // Yellow for medium
    case "low":
      return "text-green-600 bg-green-50 border-green-200"; // Green for low
    default:
      return "text-gray-500 bg-gray-50 border-gray-200"; // Default gray
  }
}

// getStatusColor() - returns Tailwind color class based on task status
export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "done":
      return "text-green-700 bg-green-100 border-green-300"; // Green for done
    case "in-progress":
      return "text-blue-700 bg-blue-100 border-blue-300"; // Blue for in-progress
    case "todo":
      return "text-gray-700 bg-gray-100 border-gray-300"; // Gray for todo
    default:
      return "text-gray-700 bg-gray-100 border-gray-300";
  }
}

// isOverdue() - checks if a task's due date has passed
// Returns true if past due, false if not
export function isOverdue(dueDate: string): boolean {
  const today = new Date(); // Get today's date
  const due = new Date(dueDate); // Convert due date string to Date
  today.setHours(0, 0, 0, 0); // Strip time from today (compare dates only)
  return due < today; // True if due date is before today
}
