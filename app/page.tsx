// ============================================================
// app/page.tsx
// DASHBOARD PAGE - the home page of the app.
// This is a SERVER COMPONENT (no "use client" directive).
// Server components fetch data on the server and send HTML to browser.
// ============================================================

import Link from "next/link";
import { Task } from "@/types/task";
import { formatDate } from "@/lib/utils";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

// This function runs on the server to fetch tasks
// No loading states needed - server waits for data then sends complete HTML
async function getTasks(): Promise<Task[]> {
  try {
    // In server components, we use the full URL with localhost
    // process.env.NEXT_PUBLIC_APP_URL defaults to localhost in dev
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/tasks`, {
      // cache: "no-store" = always fetch fresh data (don't use cache)
      cache: "no-store",
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return []; // Return empty array if fetch fails
  }
}

// StatCard component - a small reusable card for showing a stat number
// We define it inside this file since it's only used here
function StatCard({
  title,
  count,
  icon: Icon, // Destructure "icon" and rename to "Icon" (must start with capital)
  color,
}: {
  title: string;
  count: number;
  icon: React.ElementType; // ElementType = any React component (like Lucide icons)
  color: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 flex items-center gap-4 shadow-sm ${color}`}
    >
      <div className="p-3 rounded-lg bg-opacity-20">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}

// The main Dashboard page component
// "async" means this is an async server component - it can await data
export default async function DashboardPage() {
  // Fetch tasks from our API (runs on server)
  const tasks = await getTasks();

  // Calculate statistics from the tasks array
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  // Get the 3 most recently created tasks for the "Recent Tasks" section
  // sort() orders by createdAt date, newest first
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3); // Take first 3

  return (
    <div className="flex flex-col gap-8">
      {/* ---- PAGE HEADER ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of all your tasks
          </p>
        </div>

        {/* Quick action button */}
        <Link
          href="/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Link>
      </div>

      {/* ---- STATS GRID ---- */}
      {/* 4 columns on large screens, 2 on medium, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          count={totalTasks}
          icon={CheckSquare}
          color="border-gray-200"
        />
        <StatCard
          title="To Do"
          count={todoCount}
          icon={AlertCircle}
          color="border-gray-200"
        />
        <StatCard
          title="In Progress"
          count={inProgressCount}
          icon={Clock}
          color="border-blue-200"
        />
        <StatCard
          title="Done"
          count={doneCount}
          icon={CheckSquare}
          color="border-green-200"
        />
      </div>

      {/* ---- RECENT TASKS ---- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
          {/* Link to see all tasks */}
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          // Empty state - shown when there are no tasks
          <div className="text-center py-10">
            <CheckSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No tasks yet. Create your first task!
            </p>
            <Link
              href="/create"
              className="mt-4 inline-block text-sm text-blue-600 hover:underline"
            >
              Create a task →
            </Link>
          </div>
        ) : (
          // Task list
          <div className="flex flex-col gap-3">
            {recentTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {task.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    Created {formatDate(task.createdAt)}
                  </span>
                </div>
                {/* Status badge */}
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${
                    task.status === "done"
                      ? "bg-green-100 text-green-700"
                      : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status.replace("-", " ")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
