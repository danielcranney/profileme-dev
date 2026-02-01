/**
 * Sync Menu Button Component (Sponsors Only)
 *
 * Combined sync button with dropdown menu for restore options.
 * Main button syncs to GitHub, dropdown provides restore options.
 * Only visible to sponsors.
 */

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAutoRestore } from "../../hooks/useAutoRestore";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import {
  stateToProfileJson,
  profileJsonToState,
} from "../../lib/profile/stateBridge";
import {
  loadProfileJson,
  saveProfileJson,
  setLastKnownSha,
  setLastGitHubCheckAt,
} from "../../lib/profile";
import { useLinksPageChanges } from "../../hooks/useLinksPageChanges";

export default function SyncMenuButton() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { checkAndRestore } = useAutoRestore();
  const { state, dispatch } = useContext(StateContext);
  const { hasUnsavedChanges, markAsSynced } = useLinksPageChanges();
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const statusTimeoutRef = useRef(null);

  const TOAST_DURATION_MS = 4000;

  const setStatusWithAutoClear = (statusValue) => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
    setStatus(statusValue);
    if (statusValue) {
      statusTimeoutRef.current = setTimeout(() => {
        setStatus(null);
        statusTimeoutRef.current = null;
      }, TOAST_DURATION_MS);
    }
  };

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, []);

  // Check if we're in Links page mode and have unsaved changes
  const showGlow = state.renderMode === "linksPage" && hasUnsavedChanges;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu]);

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  const handleSync = async () => {
    setSyncing(true);
    setStatus(null);
    setShowMenu(false);

    const syncStartTime = performance.now();
    console.log("🔄 Starting sync to GitHub...");

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

      const apiStartTime = performance.now();
      const response = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileJson),
      });

      const apiEndTime = performance.now();
      const apiDuration = ((apiEndTime - apiStartTime) / 1000).toFixed(2);
      console.log(`⏱️  API call completed in ${apiDuration}s`);

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Sync failed";
        const action = data.action ? ` ${data.action}` : "";
        throw new Error(`${errorMessage}${action}`);
      }

      const syncEndTime = performance.now();
      const totalDuration = ((syncEndTime - syncStartTime) / 1000).toFixed(2);
      
      console.log(`✅ Sync completed successfully in ${totalDuration}s total`);
      if (data.iconsUploaded) {
        console.log(`   📦 ${data.iconsUploaded} icon(s) uploaded`);
      }
      if (data.iconsDeleted) {
        console.log(`   🗑️  ${data.iconsDeleted} unused icon(s) removed`);
      }

      setStatusWithAutoClear({
        type: "success",
        message: "Synced to GitHub: README.md + links page updated!",
      });

      // Mark links page as synced if we're in Links page mode
      if (state.renderMode === "linksPage") {
        markAsSynced();
      }

      // Update LocalStorage cache with new SHA
      if (data.profileJsonSha) {
        setLastKnownSha(data.profileJsonSha);
        setLastGitHubCheckAt(Date.now());
      }
    } catch (error) {
      const syncEndTime = performance.now();
      const totalDuration = ((syncEndTime - syncStartTime) / 1000).toFixed(2);
      console.error(`❌ Sync failed after ${totalDuration}s:`, error);
      setStatusWithAutoClear({
        type: "error",
        message: error.message || "Failed to sync to GitHub",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleRefresh = async () => {
    setSyncing(true);
    setStatus(null);
    setShowMenu(false);

    try {
      await checkAndRestore();
      setStatusWithAutoClear({ type: "success", message: "Refreshed from GitHub!" });
    } catch (error) {
      setStatusWithAutoClear({ type: "error", message: error.message || "Refresh failed" });
    } finally {
      setSyncing(false);
    }
  };

  const handleForceRestore = async () => {
    if (
      !confirm(
        "This will replace your current profile with the version from GitHub. Continue?",
      )
    ) {
      setShowMenu(false);
      return;
    }

    setSyncing(true);
    setStatus(null);
    setShowMenu(false);

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
      saveProfileJson(data.profileJson);
      if (data.sha) {
        setLastKnownSha(data.sha);
      }

      setStatusWithAutoClear({ type: "success", message: "Profile restored from GitHub!" });
    } catch (error) {
      console.error("Restore error:", error);
      setStatusWithAutoClear({
        type: "error",
        message: error.message || "Failed to restore from GitHub",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative flex items-center">
      {/* Main Sync Button */}
      <button
        ref={buttonRef}
        onClick={handleSync}
        disabled={syncing}
        className={`btn-sm btn-brand flex items-center gap-1.5 rounded-r-none border-r border-gray-900/20 dark:border-white/10 transition-all duration-300 ${
          showGlow
            ? "animate-pulse shadow-lg shadow-brand/50 ring-2 ring-brand ring-offset-2 dark:ring-offset-dark-800"
            : ""
        }`}
        title={
          showGlow
            ? "Portfolio settings changed - sync to update your site"
            : "Syncs profile.json, README.md, and portfolio site (index.html) to GitHub"
        }
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        {syncing ? "Syncing..." : "Sync GitHub"}
      </button>

      {/* Dropdown Arrow Button */}
      <button
        onClick={handleDropdownClick}
        disabled={syncing}
        className={`btn-sm btn-brand flex items-center justify-center rounded-l-none px-2 min-w-[2.5rem] transition-all duration-300 ${
          showGlow
            ? "animate-pulse shadow-lg shadow-brand/50 ring-2 ring-brand ring-offset-2 dark:ring-offset-dark-800"
            : ""
        }`}
        title="More sync options"
        aria-label="Sync options menu"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Tooltip on hover */}
      {showTooltip && !syncing && !showMenu && (
        <div className="absolute top-full mt-1 left-0 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 shadow-lg">
          Updates README.md + Links page
          <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45"></div>
        </div>
      )}

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-full mt-1 left-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-md shadow-lg z-50 min-w-[180px]"
        >
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div>
              <div className="font-medium">Refresh</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Check for updates
              </div>
            </div>
          </button>
          <button
            onClick={handleForceRestore}
            disabled={syncing}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50 flex items-center gap-2 border-t border-gray-200 dark:border-dark-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div>
              <div className="font-medium">Force Restore</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Replace with GitHub version
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Status Message */}
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
