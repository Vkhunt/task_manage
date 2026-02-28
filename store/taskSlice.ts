import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskFilters } from "@/types/task";


interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  selectedTask: Task | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}


const defaultFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
};

const initialState: TaskState = {
  tasks: [],
  filters: defaultFilters,
  selectedTask: null,
  status: "idle",
  error: null,
};




export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters?: Partial<TaskFilters>) => {

    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters?.priority && filters.priority !== "all")
      params.set("priority", filters.priority);
    if (filters?.search && filters.search !== "")
      params.set("search", filters.search);

    const qs = params.toString();
    const url = `/api/tasks${qs ? `?${qs}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tasks");


    return (await response.json()) as Task[];
  },
);


export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Omit<Task, "id" | "createdAt">) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to create task");
    }

    return (await response.json()) as Task;
  },
);


export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, data }: { id: string; data: Partial<Task> }) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to update task");
    }

    return (await response.json()) as Task;
  },
);


export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return id;
  },
);


const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {

    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },


    addTask(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload);
    },


    updateTask(
      state,
      action: PayloadAction<{ id: string; data: Partial<Task> }>,
    ) {
      const { id, data } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {

        state.tasks[index] = { ...state.tasks[index], ...data };
      }
    },


    deleteTask(state, action: PayloadAction<string>) {

      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },


    setSelectedTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },


    setFilters(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },


    clearFilters(state) {
      state.filters = defaultFilters;
    },
  },


  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch tasks";
      })


      .addCase(createTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to create task";
      })


      .addCase(editTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update task";
      })


      .addCase(removeTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to delete task";
      });
  },
});


export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSelectedTask,
  setFilters,
  clearFilters,
} = taskSlice.actions;

export default taskSlice.reducer;
