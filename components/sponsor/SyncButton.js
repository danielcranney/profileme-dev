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
import { loadProfileJson } from "../../lib/profile";

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
      // Load saved profile JSON (to preserve portfolio template and other JSON-only settings)
      let profileJson = loadProfileJson();
      
      if (!profileJson) {
        // If no saved JSON exists, create from current state
        profileJson = stateToProfileJson(state);
      } else {
        // Merge current state's profile data with saved JSON (preserves portfolio template, etc.)
        const stateJson = stateToProfileJson(state);
        profileJson = {
          ...profileJson,
          profile: stateJson.profile, // Update profile data from current state
          updatedAt: stateJson.updatedAt, // Update timestamp
          // Keep portfolio, render, and other JSON-only settings from saved JSON
        };
      }

      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileJson),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Sync failed";
        const action = data.action ? ` ${data.action}` : "";
        throw new Error(`${errorMessage}${action}`);
      }

      setStatus({ 
        type: "success", 
        message: "Synced to GitHub: README.md + portfolio site updated!" 
      });
      
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
        title="Syncs profile.json, README.md, and portfolio site (index.html) to GitHub"
      >
        {syncing ? "Syncing..." : "Sync to GitHub"}
      </button>
      
      {syncing && (
        <div className="absolute top-full mt-1 left-0 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Syncing README + Portfolio Site...
        </div>
      )}
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
