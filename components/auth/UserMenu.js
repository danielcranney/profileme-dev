/**
 * UserMenu Component
 * 
 * Displays user menu with logout option when authenticated via Supabase.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function UserMenu() {
  const { user, githubToken, logout, loading, isAuthenticated, isFullyAuthenticated, isPartiallyAuthenticated, isSponsor, refresh, loginWithGitHub } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  // Refresh user on mount and after callback
  useEffect(() => {
    if (window.location.search.includes("connected=github")) {
      // Refresh user data after OAuth callback
      // Give Supabase a moment to set cookies
      setTimeout(() => {
        window.history.replaceState({}, "", window.location.pathname);
        refresh();
        
        // Also trigger a page reload to ensure cookies are read
        // This is a workaround for cookie sync issues
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 200);
    }
  }, [refresh]);

  if (loading) {
    return null;
  }

  // Don't show UserMenu if not authenticated at all
  if (!isAuthenticated || !user) {
    return null;
  }

  // Get user info from Supabase user metadata or user object
  const userName = user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0891b2&color=fff`;
  const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username || "";
  const githubUrl = githubUsername ? `https://github.com/${githubUsername}` : null;
  const hasGitHubToken = !!githubToken;

  // Define logout handler before early returns
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
      alert(`Failed to logout: ${error.message}`);
    } finally {
      setLoggingOut(false);
    }
  };

  // If partially authenticated (no GitHub token), show reconnect option
  if (isPartiallyAuthenticated) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 btn-sm btn-gray border-yellow-500 dark:border-yellow-600"
          onClick={() => setShowMenu(!showMenu)}
          title="GitHub token expired - click to reconnect"
        >
          <img
            src={userAvatar}
            alt={userName}
            className="w-6 h-6 rounded-full opacity-50"
          />
          <span className="hidden sm:inline text-yellow-600 dark:text-yellow-500">Reconnect GitHub</span>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-800 rounded-md shadow-lg z-50 border border-yellow-200 dark:border-yellow-800">
            <div className="py-1">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-dark-700">
                <div className="font-medium">{userName}</div>
                {userEmail && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</div>
                )}
                <div className="text-xs mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">⚠️ GitHub Token Expired</span>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                    Your GitHub session has expired. Reconnect to access sponsor features.
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    setReconnecting(true);
                    await loginWithGitHub();
                  } catch (error) {
                    console.error("Reconnect error:", error);
                    alert(`Failed to reconnect: ${error.message}`);
                  } finally {
                    setReconnecting(false);
                  }
                }}
                disabled={reconnecting}
                className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50"
              >
                {reconnecting ? "Reconnecting..." : "🔗 Reconnect GitHub"}
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // handleLogout is already defined above, no need to redefine

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 btn-sm btn-gray"
        onClick={() => setShowMenu(!showMenu)}
        disabled={loggingOut}
      >
        <img
          src={userAvatar}
          alt={userName}
          className="w-6 h-6 rounded-full"
        />
        <span className="hidden sm:inline">{userName}</span>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-dark-700">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-dark-700">
              <div className="font-medium">{userName}</div>
              {userEmail && (
                <div className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</div>
              )}
              {githubUsername && (
                <div className="text-xs text-gray-500 dark:text-gray-400">@{githubUsername}</div>
              )}
              <div className="text-xs mt-1 space-y-1">
                <div>
                  <span className={`inline-flex items-center gap-1 ${hasGitHubToken ? 'text-green-600' : 'text-red-600'}`}>
                    {hasGitHubToken ? '✓' : '✗'} GitHub Token: {hasGitHubToken ? 'Available' : 'Missing'}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 ${isSponsor ? 'text-green-600' : 'text-gray-500'}`}>
                    {isSponsor ? '⭐' : '○'} Sponsor: {isSponsor ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                View on GitHub
              </a>
            )}
            <a
              href="/test-auth"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              Test Auth & API
            </a>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
