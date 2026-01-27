/**
 * GitHub Pages Settings Component (Sponsors Only)
 * 
 * Displays GitHub Pages URL and allows custom domain configuration.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { stateToProfileJson } from "../../lib/profile/stateBridge";
import PortfolioSettings from "./PortfolioSettings";

export default function GitHubPagesSettings() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state } = useContext(StateContext);
  const [pagesConfig, setPagesConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingPortfolio, setSyncingPortfolio] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isSponsor && isAuthenticated) {
      fetchPagesConfig();
    }
  }, [isSponsor, isAuthenticated]);

  const fetchPagesConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/github/pages");
      const data = await response.json();
      
      // Always set the config, even if there was an error
      // The API returns a config object even on errors
      setPagesConfig(data);
      setCustomDomain(data.customDomain || "");
    } catch (error) {
      console.error("Failed to fetch Pages config:", error);
      // Set default config on error
      setPagesConfig({
        enabled: false,
        htmlUrl: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnablePages = async () => {
    // This is actually a "refresh status" button now
    setSaving(true);
    setStatus(null);

    try {
      // Just refresh the config
      await fetchPagesConfig();
      setStatus({ type: "success", message: "Status refreshed!" });
    } catch (error) {
      console.error("Failed to refresh Pages status:", error);
      setStatus({ type: "error", message: error.message || "Failed to refresh status" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDomain = async () => {
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch("/api/github/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDomain: customDomain || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update custom domain");
      }

      setPagesConfig(data);
      setStatus({ type: "success", message: "Custom domain updated successfully!" });
    } catch (error) {
      console.error("Failed to update domain:", error);
      setStatus({ type: "error", message: error.message || "Failed to update custom domain" });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncPortfolio = async () => {
    setSyncingPortfolio(true);
    setStatus(null);

    try {
      // Load saved profile JSON (to preserve portfolio template and other JSON-only settings)
      const { loadProfileJson } = require("../../lib/profile");
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
        message: "Portfolio synced! Your portfolio site has been regenerated from your profile JSON." 
      });
      
      // Refresh Pages config after sync
      setTimeout(() => {
        fetchPagesConfig();
      }, 2000);
    } catch (error) {
      console.error("Portfolio sync error:", error);
      setStatus({ type: "error", message: error.message || "Failed to sync portfolio" });
    } finally {
      setSyncingPortfolio(false);
    }
  };

  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm fixed top-16 right-4 z-50 w-80">
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm fixed top-16 right-4 z-50 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <h3 className="text-sm font-semibold mb-2">GitHub Pages</h3>
      
      {/* Portfolio Template Settings */}
      <PortfolioSettings />

      {pagesConfig?.enabled ? (
        <>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Portfolio URL</label>
            <a
              href={pagesConfig.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
            >
              {pagesConfig.url}
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <div className="mb-3 p-2 bg-gray-50 dark:bg-dark-900 rounded border border-gray-200 dark:border-dark-700">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Update Portfolio Site
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Sync your portfolio to GitHub Pages. This regenerates your portfolio site from your profile JSON.
            </p>
            <button
              onClick={handleSyncPortfolio}
              disabled={syncingPortfolio}
              className="btn-sm btn-brand w-full text-xs"
            >
              {syncingPortfolio ? "Syncing..." : "Sync Portfolio"}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Note: The main "Sync to GitHub" button also updates your portfolio site
            </p>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Custom Domain</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="example.com"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleUpdateDomain}
                disabled={saving}
                className="btn-sm btn-brand text-xs px-2 py-1"
              >
                {saving ? "..." : "✓"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Enable GitHub Pages to publish your portfolio.
            </p>
            <code className="block p-1.5 bg-gray-100 dark:bg-dark-900 rounded text-xs mb-2 break-all text-gray-800 dark:text-gray-200">
              {pagesConfig?.htmlUrl || "https://your-username.github.io/your-username/"}
            </code>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 mb-2">
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                ⓘ Enable Pages Manually First
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                GitHub's API requires Pages to be enabled manually first. After enabling, you can manage settings here.
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Once enabled, syncing your profile will automatically regenerate your portfolio site (index.html) from your profile JSON and update README.md.
              </p>
            </div>
          </div>

          <a
            href={`https://github.com/${pagesConfig?.htmlUrl?.match(/github\.io\/([^\/]+)/)?.[1] || "your-username"}/${pagesConfig?.htmlUrl?.match(/github\.io\/([^\/]+)/)?.[1] || "your-username"}/settings/pages`}
            target="_blank"
            rel="noopener noreferrer"
            className="block btn-sm btn-brand w-full text-xs mb-2 text-center"
          >
            Enable Pages on GitHub →
          </a>
          
          <button
            onClick={handleEnablePages}
            disabled={saving || loading}
            className="btn-sm btn-gray w-full text-xs"
            title="Refresh Pages status"
          >
            {saving || loading ? "Checking..." : "Refresh Status"}
          </button>
        </>
      )}

      {status && (
        <div
          className={`mt-2 p-1.5 rounded text-xs ${
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
