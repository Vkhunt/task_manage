import { Task } from "@/types/task";
import TaskListClient from "./TaskListClient";

export default async function TasksPage() {

  let tasks: Task[] = [];


  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/tasks`, {
      cache: "no-store",
    });

    if (res.ok) {
      tasks = await res.json();
    }
  } catch {

    tasks = [];
  }


  return <TaskListClient initialTasks={tasks} />;
}
