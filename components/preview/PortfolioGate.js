/**
 * PortfolioGate Component
 *
 * Shown when the user selects Portfolio view but is not a GitHub sponsor.
 * Uses isFullyAuthenticated (user + GitHub token) so we only show "Refresh status"
 * when they can actually refresh; otherwise show "Sign in with GitHub" (handles
 * stale Supabase session where user exists but token is gone).
 */

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const SPONSOR_PAGE_URL =
  process.env.NEXT_PUBLIC_GITHUB_SPONSOR_URL ||
  "https://github.com/sponsors/danielcranney";

export default function PortfolioGate() {
  const { isFullyAuthenticated, refresh, loading, loginWithGitHub } = useAuth();
  // Only show "Refresh status" when we're sure the user is fully logged in (session validated via API).
  const showRefreshStatus = isFullyAuthenticated && !loading;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800/50 p-8 text-center max-w-md mx-auto my-auto">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
        <svg
          className="w-6 h-6 text-amber-600 dark:text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Portfolio is for GitHub sponsors
      </h3>
      {!showRefreshStatus ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Sponsor the project on GitHub to unlock the Portfolio feature and
          publish to GitHub Pages. If you&apos;ve already sponsored, sign in
          with GitHub here so we can recognize your account.
        </p>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Your GitHub account is not currently a sponsor. Sponsor the project on
          GitHub to unlock the Portfolio feature and publish to GitHub Pages. If
          you just sponsored, refresh status below.
        </p>
      )}
      <div className="flex flex-col gap-3">
        <a
          href={SPONSOR_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sm btn-brand inline-flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Sponsor on GitHub
        </a>
        {!showRefreshStatus ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already sponsored?{" "}
            <button
              type="button"
              onClick={loginWithGitHub}
              disabled={loading}
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-dark-800 rounded"
            >
              {loading ? "Signing in…" : "Sign in with GitHub"}
            </button>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="btn-sm btn-gray inline-flex items-center justify-center gap-2"
          >
            {refreshing || loading ? (
              "Checking…"
            ) : (
              <>
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
                Already sponsored? Refresh status
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
