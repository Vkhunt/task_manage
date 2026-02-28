"use client";

import Link from "next/link";
import { Task } from "@/types/task";
import { cn, formatDate, isOverdue } from "@/lib/utils";
import { Calendar, Tag, User, Trash2, Edit, AlertCircle } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";


interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
  className?: string;
}


function getPriorityClasses(priority: Task["priority"]): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-700 border-green-200";
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

  const overdue = task.dueDate
    ? isOverdue(task.dueDate) && task.status !== "done"
    : false;

  return (

    <div
      className={cn(

        "group relative bg-white rounded-xl border shadow-sm transition-all duration-200",
        "hover:shadow-md",

        overdue ? "border-red-300" : "border-gray-200",

        compact ? "p-3" : "p-5",
        className,
      )}
    >

      {overdue && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium mb-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          Overdue
        </div>
      )}


      <div className="flex items-start justify-between gap-2">

        <Link
          href={`/tasks/${task.id}`}
          className={cn(
            "font-semibold text-gray-900 hover:text-blue-600 transition-colors flex-1 leading-snug",
            task.status === "done" && "line-through text-gray-400",
            compact ? "text-sm" : "text-base",
          )}
        >
          {task.title}
        </Link>


        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            title="Edit task"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>


          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>


      {!compact && task.description && (
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">

          {task.description}
        </p>
      )}


      <div
        className={cn(
          "flex items-center gap-2 flex-wrap",
          compact ? "mt-2" : "mt-3",
        )}
      >

        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border capitalize",
            getPriorityClasses(task.priority),
          )}
        >
          {task.priority}
        </span>


        <TaskStatusBadge status={task.status} size="sm" />
      </div>


      {!compact && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1.5">

          {task.assignedTo && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>{task.assignedTo}</span>
            </div>
          )}


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
