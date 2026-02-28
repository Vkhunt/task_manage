"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";


interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TasksError({ error, reset }: ErrorProps) {

  useEffect(() => {
    console.error("[TasksPage Error]", error.message, error.digest);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">

      <div className="p-4 bg-red-50 rounded-full border border-red-100">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>


      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Something went wrong!
        </h2>

        <p className="text-sm text-gray-500 max-w-md">
          {error.message || "We couldn't load your tasks. Please try again."}
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mt-1">
            Error ID: {error.digest}
          </p>
        )}
      </div>


      <div className="flex items-center gap-3">

        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white
                     text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>


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
