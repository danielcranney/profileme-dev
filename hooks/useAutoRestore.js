/**
 * useAutoRestore Hook
 * 
 * Handles automatic profile restoration for sponsors:
 * 1. Immediately hydrate from LocalStorage (fast)
 * 2. Background stale-check (throttled to 5 minutes)
 * 3. Auto-update if GitHub version changed
 */

import { useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useContext } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../lib/constants/actions";
import {
  getLastGitHubCheckAt,
  setLastGitHubCheckAt,
  getLastKnownSha,
  setLastKnownSha,
  saveProfileJson,
  profileJsonToState,
} from "../lib/profile";

const CHECK_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

export function useAutoRestore() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state, dispatch } = useContext(StateContext);

  const checkAndRestore = useCallback(async (force = false) => {
    if (!isSponsor || !isAuthenticated) {
      return;
    }

    const lastCheck = getLastGitHubCheckAt();
    const now = Date.now();

    // Throttle: skip if checked recently (unless forced)
    if (!force && lastCheck && now - lastCheck < CHECK_THROTTLE_MS) {
      console.log("Skipping GitHub check (throttled)");
      return;
    }

    try {
      setLastGitHubCheckAt(now);

      // Get current SHA from GitHub
      const metaResponse = await fetch("/api/github/file-meta?path=.profile/profile.json");
      
      if (!metaResponse.ok) {
        // File might not exist yet - that's okay
        if (metaResponse.status === 404) {
          console.log("Profile file doesn't exist on GitHub yet");
          return;
        }
        throw new Error("Failed to check file metadata");
      }

      const metaData = await metaResponse.json();
      const currentSha = metaData.sha;
      const lastKnownSha = getLastKnownSha();

      // If SHA changed, restore from GitHub
      if (currentSha && currentSha !== lastKnownSha) {
        console.log("Profile changed on GitHub, restoring...");

        const restoreResponse = await fetch("/api/github/restore", {
          method: "POST",
        });

        if (!restoreResponse.ok) {
          const error = await restoreResponse.json();
          throw new Error(error.error || "Restore failed");
        }

        const restoreData = await restoreResponse.json();

        // Update state
        const { profileJsonToState } = require("../lib/profile/stateBridge");
        const restoredState = profileJsonToState(restoreData.profileJson, state);

        dispatch({
          type: ACTIONS.HYDRATE_STORED_STATE,
          value: restoredState,
        });

        // Update LocalStorage
        saveProfileJson(restoreData.profileJson);
        setLastKnownSha(restoreData.sha);

        console.log("Profile restored from GitHub");
      } else {
        console.log("Profile is up to date");
      }
    } catch (error) {
      console.error("Auto-restore error:", error);
      // Don't show error to user - this is background operation
    }
  }, [isSponsor, isAuthenticated, state, dispatch]);

  // Auto-check on mount and when sponsor status changes
  useEffect(() => {
    if (isSponsor && isAuthenticated) {
      // Immediate check (throttled)
      checkAndRestore(false);
    }
  }, [isSponsor, isAuthenticated, checkAndRestore]);

  return {
    checkAndRestore: () => checkAndRestore(true), // Force check
  };
}
