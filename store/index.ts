// ============================================================
// store/index.ts
// Redux store configuration.
//
// The "store" is a single container that holds ALL global state.
// Any component can:
//   - READ  state using useSelector()
//   - WRITE state using useDispatch()
//
// Exports:
//   store      → the actual Redux store instance
//   RootState  → TypeScript type for reading state
//   AppDispatch → TypeScript type for dispatching actions
// ============================================================

import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice"; // Import our task slice reducer

// configureStore() creates the Redux store.
// The "reducer" object maps state keys to their reducer functions.
// Our app has one slice: "tasks" → managed by taskReducer
export const store = configureStore({
  reducer: {
    // "tasks" is the key we use to access this state:
    // const tasks = useSelector((state: RootState) => state.tasks.tasks)
    tasks: taskReducer,
  },
});

// ---- TYPE EXPORTS ----

// RootState: the TypeScript type of the entire state tree.
// ReturnType<typeof store.getState> = whatever getState() returns.
// Use this in useSelector to get type-safe state access.
// Example:
//   const { tasks } = useSelector((state: RootState) => state.tasks)
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch: the TypeScript type of the dispatch function.
// Use this in useDispatch to get type-safe dispatch.
// This is important for async thunks — plain "Dispatch" doesn't support them.
// Example:
//   const dispatch = useDispatch<AppDispatch>()
//   dispatch(fetchTasksThunk())  ← works correctly with AppDispatch
export type AppDispatch = typeof store.dispatch;
