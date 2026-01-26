/**
 * useAuth Hook
 * 
 * Client-side hook for managing Supabase authentication state.
 * Handles GitHub OAuth through Supabase.
 */

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [githubToken, setGithubToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();

    const supabase = createClient();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setGithubToken(session?.provider_token ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        setGithubToken(data.githubToken);
      } else {
        setUser(null);
        setGithubToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
      setGithubToken(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGitHub = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "github" }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "GitHub login failed");
    }

    const data = await response.json();
    // Redirect to GitHub OAuth
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Logout failed");
    }

    setUser(null);
    setGithubToken(null);
    
    // Refresh session
    await fetchSession();
  };

  return {
    user,
    githubToken,
    loading,
    loginWithGitHub,
    logout,
    isAuthenticated: !!user,
    refresh: fetchSession,
  };
}
