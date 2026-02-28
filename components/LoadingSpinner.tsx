// ============================================================
// components/LoadingSpinner.tsx
// A centered animated spinner with an optional accessible label.
//
// Props (exact interface from spec):
//   size?      : "sm" | "md" | "lg"  — spinner size
//   label?     : string               — accessible text below the spinner
//   className? : string               — external CSS class overrides
//
// Features:
//   - SVG spinner with smooth rotation animation
//   - Three sizes: sm (16px), md (24px), lg (40px)
//   - Optional label text below the spinner for accessibility
//   - Centered both horizontally and vertically in its container
// ============================================================

import { cn } from "@/lib/utils";

// ---- Exact props interface from spec ----
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string; // Shown below spinner AND used for aria-label
  className?: string;
}

// ---- Size pixel values for the SVG ----
function getSizeClass(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "h-4 w-4"; // 16px — for inline spinners (e.g., button)
    case "md":
      return "h-6 w-6"; // 24px — default, for small loading areas
    case "lg":
      return "h-10 w-10"; // 40px — for full-page or large area loading
  }
}

export default function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  return (
    // Outer wrapper: centers the spinner + label in its container
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
      // Accessibility: announce to screen readers that content is loading
      role="status"
      aria-label={label || "Loading..."}
    >
      {/* ---- SVG SPINNER ----
          - animate-spin = Tailwind's spin animation (360° rotation, 1s linear)
          - The circle has a gap at one point (stroke-dasharray trick) to show movement
      */}
      <svg
        className={cn("animate-spin text-blue-600", getSizeClass(size))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true" // Hide from screen readers (parent has aria-label)
      >
        {/* Background circle — light gray track */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        {/* Foreground arc — the spinning part */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          // This path traces a quarter-circle making it look like a spinner arc
        />
      </svg>

      {/* ---- OPTIONAL LABEL ---- */}
      {/* Only render the label element if a label string was provided */}
      {label && (
        <span
          className={cn(
            "text-gray-500 font-medium",
            size === "sm"
              ? "text-xs" // Small text for small spinner
              : size === "md"
                ? "text-sm" // Medium text for medium spinner
                : "text-base", // Base text for large spinner
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
