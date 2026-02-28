import { notFound } from "next/navigation";
import Link from "next/link";
import { Task } from "@/types/task";
import { formatDate, isOverdue } from "@/lib/utils";
import TaskStatusBadge from "@/components/TaskStatusBadge";
import {
  Calendar,
  User,
  Tag,
  AlertCircle,
  ArrowLeft,
  Edit2,
  Clock,
} from "lucide-react";
import DeleteTaskButton from "./DeleteTaskButton";

interface PageProps {
  params: Promise<{ id: string }>;
}


function getPriorityClasses(priority: Task["priority"]): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-700 border-green-200";
  }
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;


  let task: Task;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/tasks/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      notFound();
    }

    if (!res.ok) throw new Error("Failed to fetch task");

    task = await res.json();
  } catch {

    notFound();
  }


  const overdue = task.dueDate
    ? isOverdue(task.dueDate) && task.status !== "done"
    : false;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/tasks"
          className="hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Tasks
        </Link>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-xs">{task.title}</span>
      </div>


      <div
        className={`bg-white rounded-xl border shadow-sm overflow-hidden
        ${overdue ? "border-red-300" : "border-gray-200"}`}
      >

        <div className="p-6 pb-4 border-b border-gray-100">

          {overdue && (
            <div
              className="flex items-center gap-2 text-sm text-red-600 font-medium
                            bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              This task is overdue!
            </div>
          )}


          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {task.title}
          </h1>


          <div className="flex items-center gap-2 mt-3 flex-wrap">

            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize
              ${getPriorityClasses(task.priority)}`}
            >
              {task.priority} priority
            </span>


            <TaskStatusBadge status={task.status} size="md" />
          </div>
        </div>


        <div className="p-6 flex flex-col gap-5">

          {task.description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-1.5">
                Description
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

            {task.dueDate && (
              <div className="flex items-start gap-2">
                <Calendar
                  className={`h-4 w-4 mt-0.5 shrink-0 ${overdue ? "text-red-500" : "text-gray-400"}`}
                />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Due Date
                  </p>
                  <p
                    className={`text-sm font-medium ${overdue ? "text-red-600" : "text-gray-700"}`}
                  >
                    {formatDate(task.dueDate)}
                    {overdue && " (overdue)"}
                  </p>
                </div>
              </div>
            )}


            {task.assignedTo && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Assigned To
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {task.assignedTo}
                  </p>
                </div>
              </div>
            )}


            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Created
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            </div>
          </div>


          {task.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1.5">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>


        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/tasks"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Tasks
          </Link>

          <div className="flex items-center gap-2">

            <DeleteTaskButton taskId={task.id} taskTitle={task.title} />


            <Link
              href={`/tasks/${task.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
