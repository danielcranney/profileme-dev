/**
 * Restore Button Component (Sponsors Only)
 * 
 * Button to restore profile JSON from GitHub.
 * Only visible to sponsors.
 */

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAutoRestore } from "../../hooks/useAutoRestore";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { profileJsonToState } from "../../lib/profile/stateBridge";

export default function RestoreButton() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { checkAndRestore } = useAutoRestore();
  const { state, dispatch } = useContext(StateContext);
  const [restoring, setRestoring] = useState(false);
  const [status, setStatus] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  const handleRestore = async () => {
    if (!confirm("This will replace your current profile with the version from GitHub. Continue?")) {
      return;
    }

    setRestoring(true);
    setStatus(null);

    try {
      const response = await fetch("/api/github/restore", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Restore failed";
        const action = data.action ? ` ${data.action}` : "";
        throw new Error(`${errorMessage}${action}`);
      }

      // Convert profile JSON to state format
      const restoredState = profileJsonToState(data.profileJson, state);

      // Update state
      dispatch({
        type: ACTIONS.HYDRATE_STORED_STATE,
        value: restoredState,
      });

      // Update LocalStorage cache
      const { saveProfileJson, setLastKnownSha } = require("../../lib/profile");
      saveProfileJson(data.profileJson);
      if (data.sha) {
        setLastKnownSha(data.sha);
      }

      setStatus({ type: "success", message: "Profile restored from GitHub!" });
    } catch (error) {
      console.error("Restore error:", error);
      setStatus({ type: "error", message: error.message || "Failed to restore from GitHub" });
    } finally {
      setRestoring(false);
    }
  };

  const handleRefresh = async () => {
    setRestoring(true);
    setStatus(null);
    
    try {
      await checkAndRestore();
      setStatus({ type: "success", message: "Refreshed from GitHub!" });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Refresh failed" });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleRefresh}
        disabled={restoring}
        className="btn-sm btn-gray flex items-center gap-1.5"
        title="Check for updates from GitHub and restore if changed"
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {restoring ? "Checking..." : "Restore"}
      </button>
      
      {showMenu && (
        <div 
          className="absolute top-full mt-1 left-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-md shadow-lg z-50 min-w-[160px]"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <button
            onClick={handleRefresh}
            disabled={restoring}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50"
          >
            <div className="font-medium">Refresh</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Check for updates</div>
          </button>
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50 border-t border-gray-200 dark:border-dark-700"
          >
            <div className="font-medium">Force Restore</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Replace with GitHub version</div>
          </button>
        </div>
      )}
      
      {status && (
        <div
          className={`absolute top-full mt-2 left-0 p-2 rounded text-xs whitespace-nowrap z-50 ${
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
