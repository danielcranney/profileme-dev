/**
 * Auth Test Route
 * 
 * Debug endpoint to verify authentication and GitHub token are working.
 * Returns detailed info about the current session.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../lib/supabase/server";
import { getToken } from "../../../lib/github/token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createClient(req, res);
    
    // Get session first (this is more reliable)
    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data.session;
    
    // Get user (will use session if available)
    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;
    
    // Debug: Log cookie names
    const cookieNames = Object.keys(req.cookies);
    console.log("Available cookies:", cookieNames.filter(name => name.includes("supabase") || name.includes("auth")));
    
    // Get GitHub token
    const githubToken = await getToken(req, res);
    
    // Test GitHub API call if token exists
    let githubUser = null;
    let githubRepos = null;
    let githubError = null;
    
    if (githubToken) {
      try {
        // Test 1: Get GitHub user info
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        
        if (userResponse.ok) {
          githubUser = await userResponse.json();
        } else {
          githubError = `GitHub API error: ${userResponse.status} ${userResponse.statusText}`;
        }
        
        // Test 2: Get user's repos (to verify repo access)
        const reposResponse = await fetch("https://api.github.com/user/repos?per_page=5&sort=updated", {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        
        if (reposResponse.ok) {
          const repos = await reposResponse.json();
          githubRepos = repos.map((repo: any) => ({
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            default_branch: repo.default_branch,
          }));
        }
      } catch (error: any) {
        githubError = error.message;
      }
    }
    
    return res.status(200).json({
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      } : null,
      session: session ? {
        expires_at: session.expires_at,
        has_provider_token: !!session.provider_token,
        provider: session.provider_token ? "github" : null,
      } : null,
      githubToken: githubToken ? `${githubToken.substring(0, 10)}...` : null,
      githubTokenLength: githubToken?.length || 0,
      githubUser,
      githubRepos,
      githubError,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Auth test error:", error);
    return res.status(500).json({ 
      error: error.message || "Test failed",
      authenticated: false,
    });
  }
}
