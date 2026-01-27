/**
 * usePortfolioChanges Hook
 *
 * Tracks when portfolio settings have been changed but not synced to GitHub.
 * Provides a way to mark changes and clear them after sync.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { loadProfileJson } from "../lib/profile";

const LAST_SYNCED_KEY = "portfolio_last_synced_at";
const PORTFOLIO_SETTINGS_KEY = "portfolio_settings_snapshot";

// Normalize portfolio settings for consistent comparison
function normalizePortfolioSettings(portfolio) {
  if (!portfolio) {
    return { template: "minimal", options: {} };
  }
  return {
    template: portfolio.template || "minimal",
    options: portfolio.options || {},
  };
}

export function usePortfolioChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUserMadeChangeRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // Check for unsaved changes on mount and when profile JSON changes
  useEffect(() => {
    // Wait a bit before first check to allow components to initialize and save defaults
    const initialTimer = setTimeout(() => {
      checkForUnsavedChanges();
      isInitialLoadRef.current = false;
    }, 500);

    // Check periodically (every 2 seconds) for changes
    const interval = setInterval(checkForUnsavedChanges, 2000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const checkForUnsavedChanges = useCallback(() => {
    try {
      const profileJson = loadProfileJson();
      if (!profileJson?.portfolio) {
        setHasUnsavedChanges(false);
        return;
      }

      const lastSynced = localStorage.getItem(LAST_SYNCED_KEY);
      const lastSnapshot = localStorage.getItem(PORTFOLIO_SETTINGS_KEY);

      // Only check for unsaved changes if we have BOTH a snapshot AND a synced timestamp
      // This ensures we've actually synced to GitHub before, not just initialized a baseline
      // If either is missing, don't show "changes pending"
      if (!lastSynced || !lastSnapshot) {
        // No synced timestamp means we've never synced to GitHub
        // Don't show "changes pending" even if a baseline snapshot exists
        setHasUnsavedChanges(false);
        return;
      }

      // Normalize and compare current portfolio settings with last synced snapshot
      const normalizedCurrent = normalizePortfolioSettings(
        profileJson.portfolio,
      );
      const currentSnapshot = JSON.stringify(normalizedCurrent);

      // Also normalize the stored snapshot in case it was saved in a different format
      let parsedSnapshot;
      let normalizedSnapshot;
      try {
        parsedSnapshot = JSON.parse(lastSnapshot);
        normalizedSnapshot = JSON.stringify(
          normalizePortfolioSettings(parsedSnapshot),
        );
      } catch (e) {
        // If snapshot is invalid JSON, treat as no match
        normalizedSnapshot = "";
      }

      if (currentSnapshot !== normalizedSnapshot) {
        // If there's a mismatch, check if it's from initial load (snapshot out of date)
        // vs. user making a change
        if (isInitialLoadRef.current && !hasUserMadeChangeRef.current) {
          // On initial load, if snapshot doesn't match current JSON but user hasn't made changes,
          // update the snapshot to match current state (snapshot was out of date)
          localStorage.setItem(PORTFOLIO_SETTINGS_KEY, currentSnapshot);
          setHasUnsavedChanges(false);
        } else {
          // User has made changes or it's not initial load - show as pending
          setHasUnsavedChanges(true);
        }
      } else {
        setHasUnsavedChanges(false);
        // If normalized versions match but raw strings differ, update the snapshot
        // This "heals" any format differences (e.g., property order, whitespace)
        if (lastSnapshot !== currentSnapshot && parsedSnapshot) {
          localStorage.setItem(PORTFOLIO_SETTINGS_KEY, currentSnapshot);
        }
      }
    } catch (error) {
      console.error("Error checking for unsaved changes:", error);
      setHasUnsavedChanges(false);
    }
  }, []);

  const markAsSynced = useCallback(() => {
    try {
      const profileJson = loadProfileJson();
      if (profileJson?.portfolio) {
        // Normalize before saving snapshot to ensure consistent format
        const normalized = normalizePortfolioSettings(profileJson.portfolio);
        const snapshot = JSON.stringify(normalized);
        localStorage.setItem(PORTFOLIO_SETTINGS_KEY, snapshot);
        localStorage.setItem(LAST_SYNCED_KEY, Date.now().toString());
        setHasUnsavedChanges(false);
        hasUserMadeChangeRef.current = false; // Reset after sync
      }
    } catch (error) {
      console.error("Error marking as synced:", error);
    }
  }, []);

  const markAsChanged = useCallback(() => {
    hasUserMadeChangeRef.current = true;
    setHasUnsavedChanges(true);
  }, []);

  const initializeBaseline = useCallback(() => {
    // Initialize the baseline snapshot if one doesn't exist
    // This sets the current state as the baseline so it won't show as "changes pending"
    try {
      const lastSynced = localStorage.getItem(LAST_SYNCED_KEY);
      const lastSnapshot = localStorage.getItem(PORTFOLIO_SETTINGS_KEY);

      // Only initialize if there's no snapshot AND no synced timestamp
      // If there's a synced timestamp but no snapshot, something's wrong - don't initialize
      // If there's a snapshot, don't overwrite it
      if (!lastSynced && !lastSnapshot) {
        const profileJson = loadProfileJson();
        if (profileJson?.portfolio) {
          // Normalize before saving baseline snapshot
          const normalized = normalizePortfolioSettings(profileJson.portfolio);
          const snapshot = JSON.stringify(normalized);
          localStorage.setItem(PORTFOLIO_SETTINGS_KEY, snapshot);
          setHasUnsavedChanges(false);
        }
      }
    } catch (error) {
      console.error("Error initializing baseline:", error);
    }
  }, []);

  return {
    hasUnsavedChanges,
    markAsSynced,
    markAsChanged,
    checkForUnsavedChanges,
    initializeBaseline,
  };
}
