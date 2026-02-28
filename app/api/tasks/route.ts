import { NextRequest, NextResponse } from "next/server";
import { Task } from "@/types/task";
import { getTasks, addTask } from "@/lib/taskStore";


export async function GET(request: NextRequest) {

  let tasks: Task[] = getTasks();


  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search");




  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }


  if (priority) {
    tasks = tasks.filter((task) => task.priority === priority);
  }


  if (search) {
    const keyword = search.toLowerCase();
    tasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(keyword) ||
        task.description.toLowerCase().includes(keyword) ||
        task.tags.some((tag) => tag.toLowerCase().includes(keyword)),
    );
  }


  return NextResponse.json(tasks, { status: 200 });
}


export async function POST(request: NextRequest) {
  try {

    const body: Omit<Task, "id" | "createdAt"> = await request.json();




    if (!body.title || body.title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required and cannot be empty" },
        { status: 400 },
      );
    }


    if (!body.dueDate || isNaN(new Date(body.dueDate).getTime())) {

      return NextResponse.json(
        {
          error:
            "dueDate is required and must be a valid date string (e.g. 2025-03-15)",
        },
        { status: 400 },
      );
    }


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


    const newTask: Task = {

      id: crypto.randomUUID(),


      title: body.title.trim(),
      description: body.description || "",
      priority: body.priority,
      status: body.status,
      dueDate: body.dueDate,


      createdAt: new Date().toISOString(),

      tags: body.tags || [],
      assignedTo: body.assignedTo || "",
    };


    addTask(newTask);


    return NextResponse.json(newTask, { status: 201 });
  } catch {

    return NextResponse.json(
      { error: "Invalid request body. Please send valid JSON." },
      { status: 500 },
    );
  }
}
