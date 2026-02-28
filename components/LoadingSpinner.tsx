import { cn } from "@/lib/utils";


interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}


function getSizeClass(size: "sm" | "md" | "lg"): string {
  switch (size) {
    case "sm":
      return "h-4 w-4";
    case "md":
      return "h-6 w-6";
    case "lg":
      return "h-10 w-10";
  }
}

export default function LoadingSpinner({
  size = "md",
  label,
  className,
}: LoadingSpinnerProps) {
  return (

    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}

      role="status"
      aria-label={label || "Loading..."}
    >

      <svg
        className={cn("animate-spin text-blue-600", getSizeClass(size))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />

        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"

        />
      </svg>



      {label && (
        <span
          className={cn(
            "text-gray-500 font-medium",
            size === "sm"
              ? "text-xs"
              : size === "md"
                ? "text-sm"
                : "text-base",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
