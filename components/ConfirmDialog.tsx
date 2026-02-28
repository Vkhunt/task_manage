// ============================================================
// components/ConfirmDialog.tsx
// A modal dialog that blocks user interaction until the user
// confirms or cancels an action.
//
// Props (exact interface from spec):
//   open          : boolean       — whether the modal is visible
//   title         : string        — dialog title text
//   description   : string        — dialog body text
//   onConfirm     : () => void    — called when user clicks confirm
//   onCancel      : () => void    — called when user clicks cancel
//   confirmLabel? : string        — confirm button text (default "Confirm")
//   cancelLabel?  : string        — cancel button text (default "Cancel")
//   destructive?  : boolean       — if true, confirm button is red
//
// Features:
//   - Overlay blocks all interaction behind the modal
//   - Clicking the overlay also cancels
//   - destructive=true makes the confirm button red (for delete actions)
// ============================================================

"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";

// ---- Exact props interface from spec ----
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string; // Default: "Confirm"
  cancelLabel?: string; // Default: "Cancel"
  destructive?: boolean; // If true, confirm button is red
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm", // Default label
  cancelLabel = "Cancel", // Default label
  destructive = false,
}: ConfirmDialogProps) {
  // If open=false, render nothing (no modal in the DOM)
  if (!open) return null;

  return (
    // ---- OVERLAY ----
    // Fixed = stays in place even when you scroll
    // inset-0 = covers the full viewport (top, right, bottom, left = 0)
    // z-50 = renders above all other content
    // Clicking the overlay calls onCancel (dismiss without confirming)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel} // Click outside to cancel
      role="dialog" // ARIA role for screen readers
      aria-modal="true" // Tells screen readers this is a modal
      aria-labelledby="dialog-title"
    >
      {/* ---- DARK SEMI-TRANSPARENT BACKDROP ---- */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ---- DIALOG BOX ----
          stopPropagation() prevents clicks INSIDE the dialog
          from bubbling up to the overlay and triggering onCancel */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- CLOSE BUTTON (top right) ---- */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ---- ICON + TITLE ---- */}
        <div className="flex items-start gap-3">
          {/* Warning icon for destructive actions */}
          {destructive && (
            <div className="p-2 bg-red-100 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          )}
          <div>
            <h2
              id="dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>

        {/* ---- ACTION BUTTONS ---- */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {/* Cancel button — always neutral gray */}
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200
                       rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>

          {/* Confirm button:
              - destructive=true  → red (for delete/danger actions)
              - destructive=false → blue (for generic confirmations) */}
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors",
              destructive
                ? "bg-red-600 hover:bg-red-700" // 🔴 Red for destructive
                : "bg-blue-600 hover:bg-blue-700", // 🔵 Blue for normal confirm
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
