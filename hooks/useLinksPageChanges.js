/**
 * useLinksPageChanges Hook
 *
 * Tracks when Links page settings have been changed but not synced to GitHub.
 * Provides a way to mark changes and clear them after sync.
 * (Stored JSON key remains "portfolio" for backward compatibility.)
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

export function useLinksPageChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUserMadeChangeRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      checkForUnsavedChanges();
      isInitialLoadRef.current = false;
    }, 500);

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

      if (!lastSynced || !lastSnapshot) {
        setHasUnsavedChanges(false);
        return;
      }

      const normalizedCurrent = normalizePortfolioSettings(
        profileJson.portfolio,
      );
      const currentSnapshot = JSON.stringify(normalizedCurrent);

      let parsedSnapshot;
      let normalizedSnapshot;
      try {
        parsedSnapshot = JSON.parse(lastSnapshot);
        normalizedSnapshot = JSON.stringify(
          normalizePortfolioSettings(parsedSnapshot),
        );
      } catch (e) {
        normalizedSnapshot = "";
      }

      if (currentSnapshot !== normalizedSnapshot) {
        if (isInitialLoadRef.current && !hasUserMadeChangeRef.current) {
          localStorage.setItem(PORTFOLIO_SETTINGS_KEY, currentSnapshot);
          setHasUnsavedChanges(false);
        } else {
          setHasUnsavedChanges(true);
        }
      } else {
        setHasUnsavedChanges(false);
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
        const normalized = normalizePortfolioSettings(profileJson.portfolio);
        const snapshot = JSON.stringify(normalized);
        localStorage.setItem(PORTFOLIO_SETTINGS_KEY, snapshot);
        localStorage.setItem(LAST_SYNCED_KEY, Date.now().toString());
        setHasUnsavedChanges(false);
        hasUserMadeChangeRef.current = false;
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
    try {
      const lastSynced = localStorage.getItem(LAST_SYNCED_KEY);
      const lastSnapshot = localStorage.getItem(PORTFOLIO_SETTINGS_KEY);

      if (!lastSynced && !lastSnapshot) {
        const profileJson = loadProfileJson();
        if (profileJson?.portfolio) {
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
