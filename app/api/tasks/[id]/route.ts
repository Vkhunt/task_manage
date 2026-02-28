import { NextRequest, NextResponse } from "next/server";
import { Task } from "@/types/task";
import { findTaskById, updateTask, deleteTask } from "@/lib/taskStore";


type RouteContext = {
  params: Promise<{ id: string }>;
};


export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {

  const { id } = await params;


  const task = findTaskById(id);

  if (!task) {

    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }


  return NextResponse.json(task, { status: 200 });
}


export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;


    const existingTask = findTaskById(id);
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }


    const body: Partial<Task> = await request.json();


    if (body.dueDate !== undefined && isNaN(new Date(body.dueDate).getTime())) {
      return NextResponse.json(
        { error: "dueDate must be a valid date string" },
        { status: 400 },
      );
    }


    if (body.title !== undefined && body.title.trim() === "") {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 },
      );
    }


    const updatedTask = updateTask(id, body);

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }


    return NextResponse.json(updatedTask, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 500 },
    );
  }
}


export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;


  const wasDeleted = deleteTask(id);

  if (!wasDeleted) {

    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }


  return NextResponse.json({ message: "Task deleted" }, { status: 200 });
}
