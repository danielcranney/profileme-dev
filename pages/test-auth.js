/**
 * Auth Test Page
 * 
 * Simple page to test and verify authentication is working.
 * Shows session info, GitHub token status, and API test results.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function TestAuth() {
  const { user, githubToken, loading, isAuthenticated } = useAuth();
  const [testData, setTestData] = useState(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    try {
      // Run both test and debug endpoints
      const [testResponse, debugResponse] = await Promise.all([
        fetch("/api/auth/test"),
        fetch("/api/auth/debug"),
      ]);
      
      const testData = await testResponse.json();
      const debugData = await debugResponse.json();
      
      setTestData({
        ...testData,
        debug: debugData,
      });
    } catch (error) {
      console.error("Test failed:", error);
      setTestData({ error: error.message });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      runTest();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

      {/* Auth Status */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Auth Status</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Authenticated:</span>
            <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
              {isAuthenticated ? "✅ Yes" : "❌ No"}
            </span>
          </div>
          {user && (
            <>
              <div>
                <span className="font-medium">User ID:</span> {user.id}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email || "N/A"}
              </div>
              <div>
                <span className="font-medium">GitHub Username:</span>{" "}
                {user.user_metadata?.user_name || user.user_metadata?.preferred_username || "N/A"}
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <span className="font-medium">GitHub Token:</span>
            <span className={githubToken ? "text-green-600" : "text-red-600"}>
              {githubToken ? `✅ Present (${githubToken.substring(0, 10)}...)` : "❌ Missing"}
            </span>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testData && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">API Test Results</h2>
            <button
              onClick={runTest}
              disabled={testing}
              className="btn-sm btn-brand"
            >
              {testing ? "Testing..." : "Re-run Test"}
            </button>
          </div>

          {testData.error ? (
            <div className="text-red-600">
              <strong>Error:</strong> {testData.error}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Session Info */}
              <div>
                <h3 className="font-semibold mb-2">Session Info</h3>
                <pre className="bg-gray-100 dark:bg-dark-700 p-3 rounded text-xs overflow-auto">
                  {JSON.stringify(
                    {
                      authenticated: testData.authenticated,
                      hasSession: !!testData.session,
                      sessionExpires: testData.session?.expires_at
                        ? new Date(testData.session.expires_at * 1000).toLocaleString()
                        : null,
                      hasProviderToken: testData.session?.has_provider_token,
                      provider: testData.session?.provider,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              {/* GitHub Token Info */}
              <div>
                <h3 className="font-semibold mb-2">GitHub Token</h3>
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">Present:</span>{" "}
                    {testData.githubToken ? "✅ Yes" : "❌ No"}
                  </div>
                  {testData.githubToken && (
                    <div>
                      <span className="font-medium">Preview:</span> {testData.githubToken}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Length:</span> {testData.githubTokenLength} chars
                  </div>
                </div>
              </div>

              {/* GitHub User */}
              {testData.githubUser && (
                <div>
                  <h3 className="font-semibold mb-2">GitHub User (API Test)</h3>
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">Login:</span> {testData.githubUser.login}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span> {testData.githubUser.name || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Public Repos:</span> {testData.githubUser.public_repos}
                    </div>
                  </div>
                </div>
              )}

              {/* GitHub Repos */}
              {testData.githubRepos && (
                <div>
                  <h3 className="font-semibold mb-2">Your Repositories (Sample)</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {testData.githubRepos.map((repo, idx) => (
                      <li key={idx}>
                        <a
                          href={`https://github.com/${repo.full_name}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand hover:underline"
                        >
                          {repo.full_name}
                        </a>
                        {repo.private && <span className="text-gray-500 ml-2">(private)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Errors */}
              {testData.githubError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                  <strong className="text-red-800 dark:text-red-200">GitHub API Error:</strong>
                  <p className="text-red-700 dark:text-red-300 mt-1">{testData.githubError}</p>
                </div>
              )}

              {/* Debug Info */}
              {testData.debug && (
                <div className="mt-4 border-t border-gray-200 dark:border-dark-700 pt-4">
                  <h3 className="font-semibold mb-2">Debug Info</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">Session Exists:</span>{" "}
                      {testData.debug.session?.exists ? "✅ Yes" : "❌ No"}
                    </div>
                    <div>
                      <span className="font-medium">User Exists:</span>{" "}
                      {testData.debug.user?.exists ? "✅ Yes" : "❌ No"}
                    </div>
                    <div>
                      <span className="font-medium">Has Provider Token:</span>{" "}
                      {testData.debug.session?.has_provider_token ? "✅ Yes" : "❌ No"}
                    </div>
                    <div>
                      <span className="font-medium">Supabase Cookies Found:</span>{" "}
                      {Object.keys(testData.debug.cookies?.supabase_cookies || {}).length}
                    </div>
                    {testData.debug.errors?.session && (
                      <div className="text-red-600">
                        <strong>Session Error:</strong> {testData.debug.errors.session}
                      </div>
                    )}
                    {testData.debug.errors?.user && (
                      <div className="text-red-600">
                        <strong>User Error:</strong> {testData.debug.errors.user}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-sm text-gray-500">
                Last tested: {new Date(testData.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
        <h3 className="font-semibold mb-2">What to Check:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✅ You should see "Authenticated: Yes" if logged in</li>
          <li>✅ GitHub Token should be present and have a length</li>
          <li>✅ GitHub User API call should return your GitHub username</li>
          <li>✅ GitHub Repos should list your repositories (proves repo access works)</li>
          <li>❌ If you see errors, check the browser console and server logs</li>
        </ul>
      </div>
    </div>
  );
}
