/**
 * Sync Button Component (Sponsors Only)
 * 
 * Button to sync profile JSON to GitHub.
 * Only visible to sponsors.
 */

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { stateToProfileJson } from "../../lib/profile/stateBridge";

export default function SyncButton() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state } = useContext(StateContext);
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState(null);

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  const handleSync = async () => {
    setSyncing(true);
    setStatus(null);

    try {
      // Convert state to profile JSON
      const profileJson = stateToProfileJson(state);

      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileJson),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sync failed");
      }

      setStatus({ type: "success", message: "Profile synced to GitHub successfully!" });
      
      // Update LocalStorage cache with new SHA
      if (data.profileJsonSha) {
        const { setLastKnownSha, setLastGitHubCheckAt } = require("../../lib/profile");
        setLastKnownSha(data.profileJsonSha);
        setLastGitHubCheckAt(Date.now());
      }
    } catch (error) {
      console.error("Sync error:", error);
      setStatus({ type: "error", message: error.message || "Failed to sync to GitHub" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="btn-sm btn-brand"
      >
        {syncing ? "Syncing..." : "Sync to GitHub"}
      </button>
      {status && (
        <div
          className={`absolute top-full mt-2 p-2 rounded text-xs ${
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
