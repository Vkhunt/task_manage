// ============================================================
// store/taskSlice.ts
// Redux slice with exact spec-matching thunk names:
//   fetchTasks  → GET  /api/tasks
//   createTask  → POST /api/tasks       → dispatches addTask
//   editTask    → PUT  /api/tasks/[id]  → dispatches updateTask
//   removeTask  → DEL  /api/tasks/[id]  → dispatches deleteTask
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, TaskFilters } from "@/types/task";

// ============================================================
// STATE SHAPE — exactly as specified
// ============================================================
interface TaskState {
  tasks: Task[];
  filters: TaskFilters;
  selectedTask: Task | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// Default filters (show everything, no search text)
const defaultFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
};

const initialState: TaskState = {
  tasks: [],
  filters: defaultFilters,
  selectedTask: null,
  status: "idle", // "idle" = no request has been made yet
  error: null,
};

// ============================================================
// ASYNC THUNKS — createAsyncThunk
// Each thunk:
//   1. Makes an API call
//   2. Returns data on success (goes to .fulfilled)
//   3. Throws on failure (goes to .rejected)
// extraReducers below handles updating state for each outcome.
// ============================================================

// fetchTasks: GET /api/tasks — supports optional query filters
// On success, dispatches setTasks (via extraReducers)
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks", // Unique action type name (shows in Redux DevTools)
  async (filters?: Partial<TaskFilters>) => {
    // Build query string from filters if provided
    // Example result: "?status=todo&priority=high"
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters?.priority && filters.priority !== "all")
      params.set("priority", filters.priority);
    if (filters?.search && filters.search !== "")
      params.set("search", filters.search);

    const qs = params.toString(); // Convert to query string
    const url = `/api/tasks${qs ? `?${qs}` : ""}`; // Append if non-empty

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tasks");

    // Return Task[] — becomes action.payload in .fulfilled
    return (await response.json()) as Task[];
  },
);

// createTask: POST /api/tasks
// Takes task data (id & createdAt are generated server-side)
// On success, dispatches addTask (via extraReducers)
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Omit<Task, "id" | "createdAt">) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData), // JavaScript object → JSON string
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to create task");
    }

    return (await response.json()) as Task; // Returns newly created task
  },
);

// editTask: PUT /api/tasks/[id]
// Takes { id, data } — data is Partial<Task> (only changed fields)
// On success, dispatches updateTask (via extraReducers)
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

    return (await response.json()) as Task; // Returns updated task
  },
);

// removeTask: DELETE /api/tasks/[id]
// Takes just the task id string
// On success, dispatches deleteTask (via extraReducers)
export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return id; // Return id → used in .fulfilled to remove from state
  },
);

// ============================================================
// THE SLICE — 7 required reducers + extraReducers for thunks
// ============================================================
const taskSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    // setTasks: Replace the full tasks array
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },

    // addTask: Add one new task to the beginning of the list
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload); // unshift = add to front
    },

    // updateTask: Update a task by ID using partial data
    updateTask(
      state,
      action: PayloadAction<{ id: string; data: Partial<Task> }>,
    ) {
      const { id, data } = action.payload;
      const index = state.tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        // Spread: keeps existing fields, overwrites only changed ones
        state.tasks[index] = { ...state.tasks[index], ...data };
      }
    },

    // deleteTask: Remove a task by its ID
    deleteTask(state, action: PayloadAction<string>) {
      // filter() returns new array without the deleted task
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    // setSelectedTask: Set the currently focused/viewed task (or clear with null)
    setSelectedTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },

    // setFilters: Update any filter field (partial update)
    setFilters(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // clearFilters: Reset all filters back to defaults
    clearFilters(state) {
      state.filters = defaultFilters;
    },
  },

  // ---- extraReducers: handle async thunk lifecycle ----
  // Every createAsyncThunk creates 3 automatic action types:
  //   thunkName.pending   → request started
  //   thunkName.fulfilled → request succeeded (action.payload = return value)
  //   thunkName.rejected  → request failed (action.error.message = error)
  extraReducers: (builder) => {
    builder
      // ---- fetchTasks ----
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload; // setTasks on success
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch tasks";
      })

      // ---- createTask ----
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks.unshift(action.payload); // addTask on success
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to create task";
      })

      // ---- editTask ----
      .addCase(editTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // updateTask on success
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to update task";
      })

      // ---- removeTask ----
      .addCase(removeTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        // action.payload = the id string we returned from the thunk
        state.tasks = state.tasks.filter((t) => t.id !== action.payload); // deleteTask
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to delete task";
      });
  },
});

// Export the 7 synchronous action creators
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
