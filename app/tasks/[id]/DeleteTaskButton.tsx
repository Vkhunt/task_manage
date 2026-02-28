"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { removeTask } from "@/store/taskSlice";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Trash2, Loader2 } from "lucide-react";


interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle?: string;
}

export default function DeleteTaskButton({
  taskId,
  taskTitle = "this task",
}: DeleteTaskButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);
    setIsDeleting(true);


    const result = await dispatch(removeTask(taskId));

    if (removeTask.fulfilled.match(result)) {
      router.push("/tasks");
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <>

      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="flex items-center gap-1.5 px-3 py-2 text-sm border border-red-200
                   text-red-600 rounded-lg hover:bg-red-50 transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Deleting...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            Delete
          </>
        )}
      </button>


      <ConfirmDialog
        open={dialogOpen}
        title="Delete Task"
        description={`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        destructive={true}
        onConfirm={handleConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}
