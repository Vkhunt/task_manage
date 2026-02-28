// ============================================================
// app/tasks/page.tsx
// TASK LIST PAGE — Server Component
//
// Spec requirements:
//   - Fetch task data using fetch() with { cache: "no-store" }
//   - Target the GET /api/tasks route (our own API)
//   - Pass fetched tasks as props to the Client Component (TaskListClient)
//   - Do NOT use useEffect or client-side fetching for initial load
// ============================================================

import { Task } from "@/types/task";
import TaskListClient from "./TaskListClient"; // Client component receives tasks

export default async function TasksPage() {
  // ---- SERVER-SIDE DATA FETCHING ----
  // fetch() here runs on the SERVER before the page is sent to the browser.
  // { cache: "no-store" } = never cache, always fetch fresh data.
  // This is the "no useEffect" approach specified in the requirements.
  let tasks: Task[] = [];

  // NEXT_PUBLIC_BASE_URL is set in .env.local (dev) and Vercel dashboard (prod)
  // On Vercel, Vercel also auto-sets VERCEL_URL — we fallback to that
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      cache: "no-store", // Always fetch fresh — no caching
    });

    if (res.ok) {
      tasks = await res.json();
    }
  } catch {
    // If the API fails, start with an empty array.
    // TaskListClient will handle the empty state gracefully.
    tasks = [];
  }

  // ---- PASS TO CLIENT COMPONENT ----
  // The TaskListClient receives the pre-fetched tasks as props.
  // It then syncs them into Redux for client-side operations (filter, delete, etc.)
  return <TaskListClient initialTasks={tasks} />;
}
