// ============================================================
// app/tasks/error.tsx
// ERROR BOUNDARY for the /tasks route.
//
// Spec requirements:
//   - Must be a Client Component ("use client")
//   - Receives "error" prop (the Error object) and "reset" function
//   - Displays user-friendly message + "Try Again" button calling reset()
//
// Next.js automatically renders this when an uncaught error occurs
// in the /tasks route segment.
// ============================================================

"use client"; // REQUIRED — error components must be client components

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

// Props that Next.js passes automatically to error.tsx:
//   error  : the Error that was thrown
//   reset  : a function to retry rendering the failed component
interface ErrorProps {
  error: Error & { digest?: string }; // digest = server-side error fingerprint
  reset: () => void; // Call this to retry the page
}

export default function TasksError({ error, reset }: ErrorProps) {
  // Log error to console for debugging (visible in browser DevTools)
  useEffect(() => {
    console.error("[TasksPage Error]", error.message, error.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      {/* Error icon */}
      <div className="p-4 bg-red-50 rounded-full border border-red-100">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>

      {/* Error header + message */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Something went wrong!
        </h2>
        {/* Show the actual error message if available, else a generic one */}
        <p className="text-sm text-gray-500 max-w-md">
          {error.message || "We couldn't load your tasks. Please try again."}
        </p>
        {/* If there's a server-side digest, show it for debugging */}
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mt-1">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* "Try Again" — calls reset() which retries rendering the page */}
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white
                     text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        {/* "Go Home" — escape route if retrying doesn't work */}
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200
                     text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
