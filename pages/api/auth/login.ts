/**
 * Login API Route
 * 
 * Handles Supabase authentication with GitHub OAuth provider.
 * Uses Supabase's built-in GitHub OAuth integration.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createClient(req, res);
    const { provider } = req.body;

    // Only GitHub OAuth is supported
    if (provider !== "github") {
      return res.status(400).json({ error: "Only GitHub provider is supported" });
    }

    // Use Supabase's GitHub OAuth
    // Request minimal scopes: only public repos and user info
    // We only need access to the profile repo (username/username), which is typically public
    const redirectUrl = `${req.headers.origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/callback`;
    
    console.log("Initiating GitHub OAuth, redirectTo:", redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectUrl,
        scopes: "read:user user:email public_repo", // Only public repos, no private repo access
        queryParams: {
          // Ensure we get the provider token
          access_type: "offline",
        },
      },
    });

    if (error) throw error;

    return res.status(200).json({ url: data.url });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(400).json({ error: error.message || "Login failed" });
  }
}
