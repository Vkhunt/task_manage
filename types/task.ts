export type TaskPriority = "low" | "medium" | "high";


export type TaskStatus = "todo" | "in-progress" | "done";


export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  tags: string[];
  assignedTo: string;
}


export interface TaskFilters {
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  search: string;
}


export type CreateTaskInput = Omit<Task, "id" | "createdAt">;


export type UpdateTaskInput = Partial<CreateTaskInput>;
