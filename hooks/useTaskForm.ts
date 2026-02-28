"use client";

import { useState, useCallback } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";


interface FormValues {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  tags: string;
}


type FormErrors = Partial<Record<keyof FormValues, string>>;


const defaultValues: FormValues = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
  assignedTo: "",
  tags: "",
};


export function useTaskForm(initialValues?: Partial<Task>) {

  const buildInitial = (): FormValues => ({
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    priority: initialValues?.priority ?? "medium",
    status: initialValues?.status ?? "todo",
    dueDate: initialValues?.dueDate ?? "",
    assignedTo: initialValues?.assignedTo ?? "",

    tags: initialValues?.tags?.join(", ") ?? "",
  });


  const [values, setValues] = useState<FormValues>(buildInitial);
  const [errors, setErrors] = useState<FormErrors>({});


  const handleChange = useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);


  const validate = (): boolean => {
    const newErrors: FormErrors = {};


    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    }


    if (!values.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (isNaN(new Date(values.dueDate).getTime())) {

      newErrors.dueDate = "Due date must be a valid date";
    }


    if (!["low", "medium", "high"].includes(values.priority)) {
      newErrors.priority = "Priority must be low, medium, or high";
    }


    if (!["todo", "in-progress", "done"].includes(values.status)) {
      newErrors.status = "Status must be todo, in-progress, or done";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = useCallback(
    (onSubmit: (data: Omit<Task, "id" | "createdAt">) => void) => {

      if (!validate()) return;


      const tagsArray = values.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);


      const data: Omit<Task, "id" | "createdAt"> = {
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate,
        assignedTo: values.assignedTo.trim(),
        tags: tagsArray,
      };


      onSubmit(data);
    },

    [values],
  );


  const reset = useCallback(() => {
    setValues(buildInitial());
    setErrors({});

  }, []);

  return {
    values,
    handleChange,
    handleSubmit,
    errors,
    reset,
  };
}
