/**
 * useAuth Hook & AuthProvider
 *
 * Client-side auth state is shared via React Context so that logout in one
 * component (e.g. UserMenu) updates all consumers (e.g. LoginButton) and the
 * Login button appears after logout.
 */

import React, { createContext, useState, useEffect, useContext } from "react";
import { createClient } from "../lib/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [githubToken, setGithubToken] = useState(null);
  const [isSponsor, setIsSponsor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const initSession = async () => {
      try {
        await fetchSession();
      } catch (error) {
        console.error("Error in initSession:", error);
        setLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setUser(session?.user ?? null);
      setGithubToken(session?.provider_token ?? null);
      setLoading(false);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await fetchSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSession = async () => {
    try {
      const [sessionResponse, sponsorResponse] = await Promise.all([
        fetch("/api/auth/session", { credentials: "include" }),
        fetch("/api/github/sponsor-status", { credentials: "include" }),
      ]);

      const sessionData = await sessionResponse.json();
      const sponsorData = await sponsorResponse.json();

      if (sessionData.user) {
        setUser(sessionData.user);
        setGithubToken(sessionData.githubToken);
      } else {
        setUser(null);
        setGithubToken(null);
      }

      setIsSponsor(sponsorData.isSponsor || false);
    } catch (error) {
      console.error("Failed to fetch session:", error);
      setUser(null);
      setGithubToken(null);
      setIsSponsor(false);
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
    setIsSponsor(false);

    await fetchSession();
  };

  const isFullyAuthenticated = !!user && !!githubToken;
  const isPartiallyAuthenticated = !!user && !githubToken;

  const value = {
    user,
    githubToken,
    loading,
    loginWithGitHub,
    logout,
    isAuthenticated: !!user,
    isFullyAuthenticated,
    isPartiallyAuthenticated,
    isSponsor,
    refresh: fetchSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
