// ============================================================
// app/api/tasks/[id]/route.ts
// Route Handler for /api/tasks/:id  (dynamic route)
//
// GET    /api/tasks/:id  → returns one task by ID, or 404
// PUT    /api/tasks/:id  → updates (merges) a task, returns updated
// DELETE /api/tasks/:id  → removes the task, returns success message
//
// [id] in the folder name = the dynamic segment
// Next.js passes the actual id value through the params object
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { Task } from "@/types/task";
import { findTaskById, updateTask, deleteTask } from "@/lib/taskStore"; // Use our shared store helpers

// ---- PARAMS TYPE ----
// In Next.js App Router, dynamic params come wrapped in a Promise
// We must await params before using them
type RouteContext = {
  params: Promise<{ id: string }>;
};

// ============================================================
// GET /api/tasks/:id
// Returns a single task by ID.
// Returns 404 if the task doesn't exist.
// ============================================================
export async function GET(
  _request: NextRequest, // We don't use the request here, so prefix with _
  { params }: RouteContext,
) {
  // Await params to get the id from the URL
  // Example: if URL is /api/tasks/abc-123, id = "abc-123"
  const { id } = await params;

  // Look up the task in our shared store
  const task = findTaskById(id);

  if (!task) {
    // 404 = Not Found — task with this ID doesn't exist
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // 200 = OK — return the found task as JSON
  return NextResponse.json(task, { status: 200 });
}

// ============================================================
// PUT /api/tasks/:id
// Updates an existing task.
// Client sends PARTIAL data — only the fields they want to change.
// We MERGE the partial data into the existing task (Partial<Task>).
// ============================================================
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    // First, check if the task exists
    const existingTask = findTaskById(id);
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Parse the partial update data from the request body
    // Partial<Task> = any subset of Task fields is valid
    const body: Partial<Task> = await request.json();

    // ---- Optional validation for update ----
    // If dueDate is being updated, validate it's a real date
    if (body.dueDate !== undefined && isNaN(new Date(body.dueDate).getTime())) {
      return NextResponse.json(
        { error: "dueDate must be a valid date string" },
        { status: 400 },
      );
    }

    // If title is being updated, it can't be empty
    if (body.title !== undefined && body.title.trim() === "") {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }

    // Merge the partial update into the existing task inside the store
    // updateTask() spreads the body over the existing task
    const updatedTask = updateTask(id, body);

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Return the fully updated Task object
    return NextResponse.json(updatedTask, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 500 },
    );
  }
}

// ============================================================
// DELETE /api/tasks/:id
// Removes a task from the store.
// Returns { message: "Task deleted" } with status 200 on success.
// ============================================================
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  // deleteTask() returns true if found & deleted, false if not found
  const wasDeleted = deleteTask(id);

  if (!wasDeleted) {
    // Task didn't exist — can't delete what's not there
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // 200 = OK — successfully deleted
  // Return the exact message format specified in the requirements
  return NextResponse.json({ message: "Task deleted" }, { status: 200 });
}
