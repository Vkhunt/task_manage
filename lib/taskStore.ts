import { Task } from "@/types/task";


declare global {

  var __taskStore: Task[] | undefined;
}


if (!globalThis.__taskStore) {

  globalThis.__taskStore = [
    {
      id: crypto.randomUUID(),
      title: "Design the homepage UI",
      description: "Create wireframes and mockups for the landing page",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-03-15",
      createdAt: new Date().toISOString(),
      tags: ["design", "frontend"],
      assignedTo: "Alice",
    },
    {
      id: crypto.randomUUID(),
      title: "Set up database schema",
      description: "Design and implement the PostgreSQL database schema",
      priority: "high",
      status: "todo",
      dueDate: "2025-03-10",
      createdAt: new Date().toISOString(),
      tags: ["backend", "database"],
      assignedTo: "Bob",
    },
    {
      id: crypto.randomUUID(),
      title: "Write unit tests",
      description: "Add tests for all utility functions and components",
      priority: "medium",
      status: "todo",
      dueDate: "2025-03-20",
      createdAt: new Date().toISOString(),
      tags: ["testing"],
      assignedTo: "Charlie",
    },
    {
      id: crypto.randomUUID(),
      title: "Deploy to staging server",
      description: "Push latest build to the staging environment",
      priority: "low",
      status: "done",
      dueDate: "2025-02-28",
      createdAt: new Date().toISOString(),
      tags: ["devops"],
      assignedTo: "Alice",
    },
    {
      id: crypto.randomUUID(),
      title: "Fix authentication bug",
      description: "Users are being logged out unexpectedly after 5 minutes",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-03-05",
      createdAt: new Date().toISOString(),
      tags: ["bug", "auth"],
      assignedTo: "Bob",
    },
  ];
}




export function getTasks(): Task[] {
  return globalThis.__taskStore!;
}


export function setTasks(tasks: Task[]): void {
  globalThis.__taskStore = tasks;
}


export function addTask(task: Task): void {
  globalThis.__taskStore!.push(task);
}


export function updateTask(id: string, data: Partial<Task>): Task | null {
  const store = globalThis.__taskStore!;
  const index = store.findIndex((t) => t.id === id);

  if (index === -1) return null;


  store[index] = { ...store[index], ...data, id };
  return store[index];
}


export function deleteTask(id: string): boolean {
  const store = globalThis.__taskStore!;
  const lengthBefore = store.length;


  globalThis.__taskStore = store.filter((t) => t.id !== id);


  return globalThis.__taskStore.length < lengthBefore;
}


export function findTaskById(id: string): Task | undefined {
  return globalThis.__taskStore!.find((t) => t.id === id);
}
