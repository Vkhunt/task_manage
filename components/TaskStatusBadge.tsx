import { TaskStatus } from "@/types/task";
import { cn } from "@/lib/utils";


interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}


function getStatusClasses(status: TaskStatus): string {
  switch (status) {
    case "todo":

      return "bg-gray-100 text-gray-700 border-gray-300";
    case "in-progress":

      return "bg-blue-100 text-blue-700 border-blue-300";
    case "done":

      return "bg-green-100 text-green-700 border-green-300";
  }
}


function getSizeClasses(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "text-xs px-2 py-0.5";
    case "md":
      return "text-sm px-2.5 py-1";
    case "lg":
      return "text-base px-3 py-1.5";
  }
}


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
  size = "md",
  className,
}: TaskStatusBadgeProps) {
  return (
    <span
      className={cn(

        "inline-flex items-center gap-1 font-medium rounded-full border",
        getStatusClasses(status),
        getSizeClasses(size),

        status === "in-progress" && "animate-pulse",
        className,
      )}
    >

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
