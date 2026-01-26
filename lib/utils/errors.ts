/**
 * Error Utilities
 * 
 * Centralized error handling and user-friendly error messages.
 */

export interface UserFriendlyError {
  message: string;
  code: string;
  retry?: boolean;
  action?: string;
}

/**
 * Convert GitHub API errors to user-friendly messages
 */
export function formatGitHubError(error: any): UserFriendlyError {
  const errorMessage = error.message || String(error);

  // Rate limiting
  if (errorMessage.includes("rate limit") || errorMessage.includes("403")) {
    return {
      message: "GitHub API rate limit exceeded. Please wait a few minutes and try again.",
      code: "RATE_LIMIT",
      retry: true,
      action: "Wait 5-10 minutes before retrying",
    };
  }

  // Permission errors
  if (errorMessage.includes("permission") || errorMessage.includes("403")) {
    return {
      message: "Permission denied. Please ensure your GitHub token has repository access. You may need to re-login.",
      code: "PERMISSION_DENIED",
      retry: true,
      action: "Try logging out and logging back in",
    };
  }

  // Not found errors
  if (errorMessage.includes("404") || errorMessage.includes("not found")) {
    if (errorMessage.includes("repository")) {
      return {
        message: "Profile repository not found. Please create a repository with the same name as your GitHub username.",
        code: "REPO_NOT_FOUND",
        retry: false,
        action: "Create a repository named 'your-username/your-username' on GitHub",
      };
    }
    if (errorMessage.includes("file") || errorMessage.includes(".profile")) {
      return {
        message: "Profile file not found on GitHub. Please sync your profile first.",
        code: "FILE_NOT_FOUND",
        retry: false,
        action: "Use 'Sync to GitHub' to create the profile file",
      };
    }
    return {
      message: "Resource not found. Please check that your repository and files exist.",
      code: "NOT_FOUND",
      retry: false,
    };
  }

  // SHA mismatch (conflict)
  if (errorMessage.includes("but expected") || errorMessage.includes("sha")) {
    return {
      message: "File was modified on GitHub. Please refresh and try again.",
      code: "SHA_MISMATCH",
      retry: true,
      action: "Click 'Refresh from GitHub' then try syncing again",
    };
  }

  // Network errors
  if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
    return {
      message: "Network error. Please check your internet connection and try again.",
      code: "NETWORK_ERROR",
      retry: true,
    };
  }

  // Validation errors
  if (errorMessage.includes("Invalid") || errorMessage.includes("validation")) {
    return {
      message: "Invalid profile data. Please check your profile information.",
      code: "VALIDATION_ERROR",
      retry: false,
    };
  }

  // Generic error
  return {
    message: errorMessage || "An unexpected error occurred. Please try again.",
    code: "UNKNOWN_ERROR",
    retry: true,
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const formatted = formatGitHubError(error);
  return formatted.retry === true;
}
