/**
 * Portfolio Button Component (Sponsors Only)
 * 
 * Button to generate and download portfolio HTML.
 * Only visible to sponsors.
 */

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { stateToProfileJson } from "../../lib/profile/stateBridge";

export default function PortfolioButton() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state } = useContext(StateContext);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null);

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  const handleGenerate = async () => {
    setGenerating(true);
    setStatus(null);

    try {
      // Convert state to profile JSON
      const profileJson = stateToProfileJson(state);

      const response = await fetch("/api/github/portfolio", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileJson),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate portfolio");
      }

      // Get HTML content from response
      const data = await response.json();
      const html = data.html;

      // Create blob and download
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus({ type: "success", message: "Portfolio downloaded successfully!" });
    } catch (error) {
      console.error("Portfolio generation error:", error);
      setStatus({ type: "error", message: error.message || "Failed to generate portfolio" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="btn-sm btn-gray"
        title="Download portfolio HTML for GitHub Pages"
      >
        {generating ? "Generating..." : "Download Portfolio"}
      </button>
      {status && (
        <div
          className={`absolute top-full mt-2 p-2 rounded text-xs whitespace-nowrap ${
            status.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
