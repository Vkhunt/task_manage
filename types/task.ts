// ============================================================
// types/task.ts
// This file defines all TypeScript types used in the app.
// Think of types as "blueprints" that tell TypeScript
// what shape our data should have.
// ============================================================

// TaskPriority: a task can be "low", "medium", or "high"
// This is a "union type" - it can only be one of these 3 values
export type TaskPriority = "low" | "medium" | "high";

// TaskStatus: a task can be "todo", "in-progress", or "done"
export type TaskStatus = "todo" | "in-progress" | "done";

// Task interface: defines the shape of a single Task object
// An "interface" is like a contract - any Task must have all these fields
export interface Task {
  id: string; // Unique ID for each task (e.g., "abc-123")
  title: string; // The task title (e.g., "Fix login bug")
  description: string; // A longer description of the task
  priority: TaskPriority; // "low" | "medium" | "high"
  status: TaskStatus; // "todo" | "in-progress" | "done"
  dueDate: string; // ISO date string (e.g., "2025-12-31")
  createdAt: string; // ISO date when task was created
  tags: string[]; // Array of tag strings (e.g., ["frontend", "bug"])
  assignedTo: string; // Person assigned to this task
}

// TaskFilters interface: used when filtering the task list
// The " | 'all'" allows "all" as a special value meaning "no filter"
export interface TaskFilters {
  status: TaskStatus | "all"; // Filter by status, or show all
  priority: TaskPriority | "all"; // Filter by priority, or show all
  search: string; // Search text to filter by title/description
}

// CreateTaskInput: the data needed to CREATE a new task
// We use Omit<Task, "id" | "createdAt"> to reuse Task but without id/createdAt
// (those are auto-generated, user doesn't provide them)
export type CreateTaskInput = Omit<Task, "id" | "createdAt">;

// UpdateTaskInput: the data for updating a task
// Partial<> makes all fields optional - you only send what changed
export type UpdateTaskInput = Partial<CreateTaskInput>;
