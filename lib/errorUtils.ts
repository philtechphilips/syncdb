import axios, { AxiosError } from "axios";

/**
 * Parses an error from the API (Axios error) and returns a human-readable message.
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred.";

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string | string[];
      error?: string;
      description?: string;
    }>;
    const data = axiosError.response?.data;

    // Handle NestJS validation errors (message is often an array)
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message[0];
      }
      return data.message;
    }

    // Handle common error fields
    if (data?.error) return data.error;
    if (data?.description) return data.description;

    // Fallback to HTTP status codes
    switch (axiosError.response?.status) {
      case 401:
        return "Session expired. Please login again.";
      case 403:
        return "Access denied. You don't have permission for this.";
      case 404:
        return "The requested resource was not found.";
      case 429:
        return "Too many requests. Please slow down.";
      case 500:
        return "Internal server error. Our team has been notified.";
      case 502:
        return "Bad gateway. The server is currently unreachable.";
      case 503:
        return "Service unavailable. Please try again in a few minutes.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") return error;

  return "An unexpected error occurred.";
};
