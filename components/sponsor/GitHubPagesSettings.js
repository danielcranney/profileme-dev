/**
 * GitHub Pages Settings Component (Sponsors Only)
 * 
 * Displays GitHub Pages URL and allows custom domain configuration.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import PortfolioSettings from "./PortfolioSettings";
import { usePortfolioChanges } from "../../hooks/usePortfolioChanges";

export default function GitHubPagesSettings() {
  const { isSponsor, isAuthenticated } = useAuth();
  const { state } = useContext(StateContext);
  const { hasUnsavedChanges } = usePortfolioChanges();
  const [pagesConfig, setPagesConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [status, setStatus] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

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


  if (!isAuthenticated || !isSponsor) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-3 border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-800 shadow-sm absolute top-24 left-6 z-50 w-80">
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="absolute top-24 left-6 z-40 w-80">
      {/* Collapsed State - Compact Button */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-3 border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 w-full group"
        >
          <svg 
            className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Portfolio Settings</span>
          {hasUnsavedChanges && (
            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
          <svg 
            className="w-4 h-4 text-gray-400 ml-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        /* Expanded State - Full Panel */
        <div className="border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 shadow-lg max-h-[calc(100vh-8rem)] overflow-y-auto animate-fade-in-slide-right">
          <div className="sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 p-4 z-10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Portfolio Settings</h3>
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <svg className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Changes pending</span>
                </div>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors"
                aria-label="Collapse settings"
              >
                <svg 
                  className="w-4 h-4 text-gray-500 dark:text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {/* Portfolio Template Settings */}
            <div className="mb-4">
              <PortfolioSettings />
            </div>

            {/* Sync Reminder */}
            {hasUnsavedChanges && (
              <div className="mb-4 p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                  Ready to publish?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Use the <strong>"Sync with GitHub"</strong> button above to update your portfolio site with these changes.
                </p>
              </div>
            )}

            {pagesConfig?.enabled ? (
              <>
                <div className="mb-4 pt-3 border-t border-gray-200 dark:border-dark-700">
                  <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">Portfolio URL</label>
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

                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">Custom Domain</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="example.com"
                      className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 dark:border-dark-700 rounded bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                    <button
                      onClick={handleUpdateDomain}
                      disabled={saving}
                      className="btn-sm btn-brand text-xs px-3 py-1.5"
                    >
                      {saving ? "..." : "✓"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 pt-3 border-t border-gray-200 dark:border-dark-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Enable GitHub Pages to publish your portfolio.
                  </p>
                  <code className="block p-2 bg-gray-100 dark:bg-dark-900 rounded text-xs mb-3 break-all text-gray-800 dark:text-gray-200">
                    {pagesConfig?.htmlUrl || "https://your-username.github.io/your-username/"}
                  </code>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2.5 mb-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                      ⓘ Enable Pages Manually First
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
                      GitHub's API requires Pages to be enabled manually first. After enabling, you can manage settings here.
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Once enabled, use the "Sync with GitHub" button to publish your portfolio site.
                    </p>
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
                </div>
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
        </div>
      )}
    </div>
  );
}
