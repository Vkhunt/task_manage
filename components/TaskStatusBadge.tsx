// ============================================================
// components/TaskStatusBadge.tsx
// A color-coded pill badge displaying a task's status.
//
// Props (exact interface from spec):
//   status     : TaskStatus           — "todo" | "in-progress" | "done"
//   size?      : "sm" | "md" | "lg"  — controls text and padding size
//   className? : string               — external CSS overrides
//
// Features:
//   - todo        → gray badge
//   - in-progress → blue badge with subtle pulse animation
//   - done        → green badge
// ============================================================

import { TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";

// ---- Exact props interface from spec ----
interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ---- Color classes per status ----
// Each status gets a unique color combination
function getStatusClasses(status: TaskStatus): string {
  switch (status) {
    case "todo":
      // Gray for "not started yet"
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "in-progress":
      // Blue for "actively working on"
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "done":
      // Green for "completed"
      return "bg-green-100 text-green-700 border-green-300";
  }
}

// ---- Size classes for three size variants ----
function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-0.5"; // Small — used inside cards
    case "md":
      return "text-sm px-2.5 py-1"; // Medium — default
    case "lg":
      return "text-base px-3 py-1.5"; // Large — used on detail pages
  }
}

// ---- Label display text ----
// Convert "in-progress" → "In Progress" for readability
function getLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "Todo";
    case "in-progress":
      return "In Progress";
    case "done":
      return "Done";
  }
}

export default function TaskStatusBadge({
  status,
  size = "md", // Default to medium size
  className,
}: TaskStatusBadgeProps) {
  return (
    <span
      className={cn(
        // Base pill styles
        "inline-flex items-center gap-1 font-medium rounded-full border",
        getStatusClasses(status),
        getSizeClasses(size),
        // Pulse animation ONLY for in-progress tasks (spec requirement)
        // animate-pulse = Tailwind's built-in gentle fade in/out animation
        status === "in-progress" && "animate-pulse",
        className,
      )}
    >
      {/* Small dot indicator beside the text */}
      <span
        className={cn(
          "inline-block rounded-full",
          size === "sm"
            ? "w-1.5 h-1.5"
            : size === "md"
              ? "w-2 h-2"
              : "w-2.5 h-2.5",
          status === "todo"
            ? "bg-gray-400"
            : status === "in-progress"
              ? "bg-blue-500"
              : "bg-green-500",
        )}
      />
      {getLabel(status)}
    </span>
  );
}
