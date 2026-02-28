// ============================================================
// app/api/tasks/route.ts
// Route Handler for /api/tasks
//
// GET  /api/tasks          → returns all tasks (with optional filters)
// GET  /api/tasks?status=todo&priority=high&search=keyword → filtered
// POST /api/tasks          → creates a new task
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { Task } from "@/types/task";
import { getTasks, addTask } from "@/lib/taskStore"; // Import from shared store

// ============================================================
// GET /api/tasks
// Supports query parameters:
//   ?status=todo|in-progress|done
//   ?priority=low|medium|high
//   ?search=some keyword
// ============================================================
export async function GET(request: NextRequest) {
  // Get all tasks from the shared in-memory store
  let tasks: Task[] = getTasks();

  // ---- Read query parameters from the URL ----
  // request.nextUrl.searchParams is a URLSearchParams object
  // Example URL: /api/tasks?status=todo&priority=high&search=bug
  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status"); // e.g. "todo" or null
  const priority = searchParams.get("priority"); // e.g. "high" or null
  const search = searchParams.get("search"); // e.g. "bug" or null

  // ---- Apply filters if query params were provided ----

  // Filter by status (only if ?status was passed)
  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }

  // Filter by priority (only if ?priority was passed)
  if (priority) {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  // Filter by search keyword (case-insensitive)
  // Checks title, description, and tags
  if (search) {
    const keyword = search.toLowerCase(); // Convert to lowercase for comparison
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword) || // Match title
        task.description.toLowerCase().includes(keyword) || // Match description
        task.tags.some((tag) => tag.toLowerCase().includes(keyword)), // Match any tag
    );
  }

  // Return the (possibly filtered) tasks as a JSON array
  // TypeScript type: Task[] ensures correct shape
  return NextResponse.json(tasks, { status: 200 });
}

// ============================================================
// POST /api/tasks
// Creates a new task from the request body.
// Validates: title must not be empty, dueDate must be valid.
// Generates: id with crypto.randomUUID(), createdAt with new Date()
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body sent by the client
    // Omit<Task, "id" | "createdAt"> = Task shape WITHOUT id and createdAt
    // (client doesn't send these — server generates them)
    const body: Omit<Task, "id" | "createdAt"> = await request.json();

    // ---- VALIDATION ----

    // 1. Title must not be empty or just whitespace
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required and cannot be empty" },
        { status: 400 }, // 400 = Bad Request
      );
    }

    // 2. dueDate must be provided and be a valid date string
    if (!body.dueDate || isNaN(new Date(body.dueDate).getTime())) {
      // isNaN(new Date(...).getTime()) returns true if the date is invalid
      return NextResponse.json(
        {
          error:
            "dueDate is required and must be a valid date string (e.g. 2025-03-15)",
        },
        { status: 400 },
      );
    }

    // 3. priority and status must be provided and valid
    const validPriorities = ["low", "medium", "high"];
    const validStatuses = ["todo", "in-progress", "done"];

    if (!body.priority || !validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: `priority must be one of: ${validPriorities.join(", ")}` },
        { status: 400 },
      );
    }

    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 },
      );
    }

    // ---- BUILD THE NEW TASK OBJECT ----
    const newTask: Task = {
      // crypto.randomUUID() is built into Node.js 18+ — no package needed!
      // It generates a unique ID like: "a3f9b2c1-1234-4abc-8def-000000000001"
      id: crypto.randomUUID(),

      // Spread the body fields (title, description, priority, etc.)
      title: body.title.trim(), // Remove extra whitespace
      description: body.description || "", // Default to empty string
      priority: body.priority,
      status: body.status,
      dueDate: body.dueDate,

      // new Date().toISOString() = current timestamp in ISO format
      // Example: "2025-03-01T08:30:00.000Z"
      createdAt: new Date().toISOString(),

      tags: body.tags || [], // Default to empty array
      assignedTo: body.assignedTo || "", // Default to empty string
    };

    // Save the new task to our shared in-memory store
    addTask(newTask);

    // Return the created task with 201 Created status
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    // Something went wrong parsing the JSON or processing
    return NextResponse.json(
      { error: "Invalid request body. Please send valid JSON." },
      { status: 500 }, // 500 = Internal Server Error
    );
  }
}
