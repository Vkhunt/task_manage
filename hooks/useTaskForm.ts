// ============================================================
// hooks/useTaskForm.ts
// Custom hook that manages form state for creating or editing a task.
//
// Accepts:
//   initialValues?: Partial<Task>  — pre-fills the form (used in edit mode)
//
// Returns:
//   values         — current form values
//   handleChange   — updates a single field by name
//   handleSubmit   — validates form then calls onSubmit callback
//   errors         — field-level validation error messages
//   reset          — resets all fields back to initial values
// ============================================================

"use client";

import { useState, useCallback } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";

// ---- FormValues type ----
// All the fields inside our form.
// tags is a string in the form (comma-separated), converted to string[] on submit.
interface FormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  tags: string; // "frontend, bug" — joined as a string for the <input>
}

// ---- FormErrors type ----
// Each key matches a FormValues key, value is an error string or undefined.
// Partial<> means not every field needs an error — only the invalid ones.
type FormErrors = Partial<Record<keyof FormValues, string>>;

// ---- Default empty form values ----
const defaultValues: FormValues = {
  title: "",
  description: "",
  priority: "medium", // Sensible default
  status: "todo", // Sensible default
  dueDate: "",
  assignedTo: "",
  tags: "",
};

// ---- The hook ----
// initialValues: optional Partial<Task> to pre-fill the form
export function useTaskForm(initialValues?: Partial<Task>) {
  // Build starting form values from initialValues (edit mode) or defaults (create mode)
  const buildInitial = (): FormValues => ({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    priority: initialValues?.priority ?? "medium",
    status: initialValues?.status ?? "todo",
    dueDate: initialValues?.dueDate ?? "",
    assignedTo: initialValues?.assignedTo ?? "",
    // Convert string[] tags array → comma-separated string for the input
    // ["frontend", "bug"] → "frontend, bug"
    tags: initialValues?.tags?.join(", ") ?? "",
  });

  // ---- State ----
  const [values, setValues] = useState<FormValues>(buildInitial);
  const [errors, setErrors] = useState<FormErrors>({});

  // ---- handleChange ----
  // Updates a single field in the form values.
  // "field" is a key of FormValues (e.g. "title", "priority")
  // "value" is the new value for that field
  const handleChange = useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field when the user starts typing
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // ---- validate ----
  // Runs all validation rules and sets errors state.
  // Returns true if the form is valid, false if there are errors.
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Rule 1: title must not be empty
    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Rule 2: dueDate must be provided and be a valid date string
    if (!values.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (isNaN(new Date(values.dueDate).getTime())) {
      // isNaN(new Date(...).getTime()) = true when date is invalid
      newErrors.dueDate = "Due date must be a valid date";
    }

    // Rule 3: priority must be one of the allowed values
    if (!["low", "medium", "high"].includes(values.priority)) {
      newErrors.priority = "Priority must be low, medium, or high";
    }

    // Rule 4: status must be one of the allowed values
    if (!["todo", "in-progress", "done"].includes(values.status)) {
      newErrors.status = "Status must be todo, in-progress, or done";
    }

    setErrors(newErrors);
    // Form is valid if there are zero error keys
    return Object.keys(newErrors).length === 0;
  };

  // ---- handleSubmit ----
  // Validates the form, then calls the onSubmit callback with cleaned data.
  // onSubmit receives Omit<Task, "id" | "createdAt"> — ready to POST/PUT.
  //
  // Usage: handleSubmit(async (data) => { await createTask(data) })
  const handleSubmit = useCallback(
    (onSubmit: (data: Omit<Task, "id" | "createdAt">) => void) => {
      // Run validation first
      if (!validate()) return; // Stop if invalid

      // Convert tags string back to array:
      // "frontend, bug fix" → ["frontend", "bug fix"]
      const tagsArray = values.tags
        .split(",")
        .map((t) => t.trim()) // Remove whitespace
        .filter((t) => t.length > 0); // Remove empty strings

      // Build the clean task data object
      const data: Omit<Task, "id" | "createdAt"> = {
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate,
        assignedTo: values.assignedTo.trim(),
        tags: tagsArray,
      };

      // Call the callback with the clean data
      onSubmit(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values], // Recreate only when form values change
  );

  // ---- reset ----
  // Resets all form fields back to the initial values
  const reset = useCallback(() => {
    setValues(buildInitial()); // Go back to initial (or defaults)
    setErrors({}); // Clear all errors
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    values, // Current form field values
    handleChange, // Update a single field: handleChange("title", "New title")
    handleSubmit, // Validate + submit: handleSubmit((data) => createTask(data))
    errors, // Field errors: { title: "Title is required", ... }
    reset, // Reset to initial: reset()
  };
}
