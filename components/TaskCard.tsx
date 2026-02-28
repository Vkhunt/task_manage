// ============================================================
// components/TaskCard.tsx
// Displays a single task's information in a card.
//
// Props (exact interface from spec):
//   task       : Task                      — the task to display
//   onEdit     : (task: Task) => void      — called when Edit is clicked
//   onDelete   : (id: string) => void      — called when Delete is clicked
//   compact?   : boolean                   — compact mode (smaller card)
//   className? : string                    — extra CSS classes
//
// Features:
//   - Priority badges: low=green, medium=yellow, high=red
//   - Status badges:   todo=gray, in-progress=blue, done=green
//   - Overdue indicator (red border + icon) if past dueDate and not done
//   - Edit & Delete buttons visible only on hover
// ============================================================

"use client";

import Link from "next/link";
import { Task } from "@/types/task";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import { Calendar, Tag, User, Trash2, Edit, AlertCircle } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge"; // Reuse our badge component

// ---- Exact props interface from spec ----
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void; // Called with the full Task object
  onDelete: (id: string) => void; // Called with just the task id
  compact?: boolean; // If true, show smaller/minimal card
  className?: string; // External CSS class overrides
}

// ---- Priority badge color helper ----
function getPriorityClasses(priority: Task["priority"]): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200"; // 🔴 red
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"; // 🟡 yellow
    case "low":
      return "bg-green-100 text-green-700 border-green-200"; // 🟢 green
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  compact = false,
  className,
}: TaskCardProps) {
  // Check if this task is overdue (past due date AND not done)
  const overdue = task.dueDate
    ? isOverdue(task.dueDate) && task.status !== "done"
    : false;

  return (
    // "group" allows child elements to react to hover using group-hover:
    <div
      className={cn(
        // Base card styles
        "group relative bg-white rounded-xl border shadow-sm transition-all duration-200",
        "hover:shadow-md",
        // Red border on overdue tasks (and not done)
        overdue ? "border-red-300" : "border-gray-200",
        // Compact mode = smaller padding
        compact ? "p-3" : "p-5",
        className, // Allow external overrides
      )}
    >
      {/* ---- OVERDUE WARNING BANNER ---- */}
      {overdue && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mb-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Overdue
        </div>
      )}

      {/* ---- TOP ROW: Title + Hover Action Buttons ---- */}
      <div className="flex items-start justify-between gap-2">
        {/* Clickable title — links to task detail page */}
        <Link
          href={`/tasks/${task.id}`}
          className={cn(
            "font-semibold text-gray-900 hover:text-blue-600 transition-colors flex-1 leading-snug",
            task.status === "done" && "line-through text-gray-400", // Strikethrough if done
            compact ? "text-sm" : "text-base",
          )}
        >
          {task.title}
        </Link>

        {/* Edit + Delete — only visible on hover using group-hover: */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {/* Edit button — passes the full task to onEdit */}
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            title="Edit task"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>

          {/* Delete button — passes just the id to onDelete */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ---- DESCRIPTION (hidden in compact mode) ---- */}
      {!compact && task.description && (
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
          {/* line-clamp-2 = truncate to 2 lines (spec requirement) */}
          {task.description}
        </p>
      )}

      {/* ---- BADGES ROW: Priority + Status ---- */}
      <div
        className={cn(
          "flex items-center gap-2 flex-wrap",
          compact ? "mt-2" : "mt-3",
        )}
      >
        {/* Priority badge */}
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border capitalize",
            getPriorityClasses(task.priority),
          )}
        >
          {task.priority}
        </span>

        {/* Status badge — uses our dedicated TaskStatusBadge component */}
        <TaskStatusBadge status={task.status} size="sm" />
      </div>

      {/* ---- FOOTER: Due Date, Assigned To, Tags ---- */}
      {!compact && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
          {/* Assigned To */}
          {task.assignedTo && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{task.assignedTo}</span>
            </div>
          )}

          {/* Due Date — red if overdue */}
          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs",
                overdue ? "text-red-500 font-medium" : "text-gray-500",
              )}
            >
              <Calendar className="h-3 w-3" />
              <span>
                {overdue ? "Overdue: " : "Due: "}
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="h-3 w-3 text-gray-400" />
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
