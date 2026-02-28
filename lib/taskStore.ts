// ============================================================
// lib/taskStore.ts
// SHARED IN-MEMORY STORE for all tasks.
//
// WHY we need this file:
//   In Next.js, each API route file is a separate module.
//   If we put tasks[] inside route.ts, each route gets its OWN copy.
//   That means GET and DELETE would not share the same array!
//
// The fix: store tasks on the global Node.js object.
//   "global" exists for the entire lifetime of the server process,
//   so all API routes can share the same task list.
// ============================================================

import { Task } from "@/types/task";

// We store tasks on globalThis to share across all API route files.
// globalThis.__taskStore is our in-memory "database".
// It only resets when the Node.js server restarts.
declare global {
  // eslint-disable-next-line no-var
  var __taskStore: Task[] | undefined;
}

// If the store doesn't exist yet, create it with seed data
if (!globalThis.__taskStore) {
  // Seed tasks – so the app isn't empty when it first loads
  globalThis.__taskStore = [
    {
      id: crypto.randomUUID(), // Built-in browser/Node crypto API
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

// ---- Helper functions that other files will import ----

// getTasks() - returns the full task list (the shared array)
export function getTasks(): Task[] {
  return globalThis.__taskStore!; // "!" tells TypeScript it's never undefined
}

// setTasks() - replaces the entire task list
// Used after filtering/modifying the array
export function setTasks(tasks: Task[]): void {
  globalThis.__taskStore = tasks;
}

// addTask() - adds one task to the store
export function addTask(task: Task): void {
  globalThis.__taskStore!.push(task);
}

// updateTask() - finds a task by id and replaces it
// Returns the updated task, or null if not found
export function updateTask(id: string, data: Partial<Task>): Task | null {
  const store = globalThis.__taskStore!;
  const index = store.findIndex((t) => t.id === id); // Find task position

  if (index === -1) return null; // Not found

  // Merge existing task with new data using spread operator
  // Example: { ...oldTask, status: "done" } keeps all fields, updates status
  store[index] = { ...store[index], ...data, id }; // id must never change
  return store[index]; // Return the updated task
}

// deleteTask() - removes a task by id
// Returns true if deleted, false if not found
export function deleteTask(id: string): boolean {
  const store = globalThis.__taskStore!;
  const lengthBefore = store.length;

  // filter() creates a new array WITHOUT the task that matches id
  globalThis.__taskStore = store.filter((t) => t.id !== id);

  // If length decreased, the task was found and deleted
  return globalThis.__taskStore.length < lengthBefore;
}

// findTaskById() - finds and returns one task by id
// Returns undefined if not found
export function findTaskById(id: string): Task | undefined {
  return globalThis.__taskStore!.find((t) => t.id === id);
}
