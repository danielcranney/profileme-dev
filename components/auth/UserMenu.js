/**
 * UserMenu Component
 * 
 * Displays user menu with logout option when authenticated via Supabase.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function UserMenu() {
  const { user, githubToken, logout, loading, isAuthenticated, refresh } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  if (!isAuthenticated || !user) {
    return null;
  }

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

  // Get user info from Supabase user metadata or user object
  const userName = user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0891b2&color=fff`;
  const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username || "";
  const githubUrl = githubUsername ? `https://github.com/${githubUsername}` : null;
  const hasGitHubToken = !!githubToken;

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
              <div className="text-xs mt-1">
                <span className={`inline-flex items-center gap-1 ${hasGitHubToken ? 'text-green-600' : 'text-red-600'}`}>
                  {hasGitHubToken ? '✓' : '✗'} GitHub Token: {hasGitHubToken ? 'Available' : 'Missing'}
                </span>
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
