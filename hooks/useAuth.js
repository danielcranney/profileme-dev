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
  const [isSponsor, setIsSponsor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check if we're returning from OAuth callback
    const isCallback = window.location.search.includes("connected=github");
    
    // Get initial session from Supabase client
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        
        console.log("Initial session check:", {
          hasSession: !!session,
          userId: session?.user?.id,
          hasProviderToken: !!session?.provider_token,
        });
        
        setUser(session?.user ?? null);
        setGithubToken(session?.provider_token ?? null);
        setLoading(false);
        
        // Also fetch from our API route for consistency
        await fetchSession();
      } catch (error) {
        console.error("Error in initSession:", error);
        setLoading(false);
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setUser(session?.user ?? null);
      setGithubToken(session?.provider_token ?? null);
      setLoading(false);
      
      // If we just got a session (SIGNED_IN event), refresh from API
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await fetchSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSession = async () => {
    try {
      const [sessionResponse, sponsorResponse] = await Promise.all([
        fetch("/api/auth/session"),
        fetch("/api/github/sponsor-status"),
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
    isSponsor,
    refresh: fetchSession,
  };
}
