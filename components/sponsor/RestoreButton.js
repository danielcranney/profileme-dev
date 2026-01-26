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
    <div className="relative flex gap-x-2">
      <button
        onClick={handleRestore}
        disabled={restoring}
        className="btn-sm btn-gray"
        title="Replace current profile with GitHub version"
      >
        {restoring ? "Restoring..." : "Restore"}
      </button>
      <button
        onClick={handleRefresh}
        disabled={restoring}
        className="btn-sm btn-gray"
        title="Check for updates from GitHub"
      >
        {restoring ? "Checking..." : "Refresh"}
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
