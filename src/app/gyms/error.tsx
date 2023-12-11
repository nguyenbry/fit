"use client"; // Error components must be Client Components

import type { ErrorPageComponent } from "@/lib/types";
import { useEffect } from "react";

const ErrorPage: ErrorPageComponent = ({ error, reset }) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <span>{error.message}</span>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorPage;
