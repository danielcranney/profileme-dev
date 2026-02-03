/**
 * JsonViewer - Displays profile JSON (shared data source for profile and Links page)
 */

import React from "react";

export default function JsonViewer({ jsonString, placeholder }) {
  return (
    <article className="relative flex flex-col flex-1 min-h-0">
      {!jsonString ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {placeholder != null ? placeholder : "No JSON to display"}
        </div>
      ) : (
        <pre className="text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-dark-900 rounded border border-gray-200 dark:border-dark-600 p-4 overflow-auto flex-1 min-h-0 font-mono whitespace-pre break-all">
          {jsonString}
        </pre>
      )}
    </article>
  );
}
