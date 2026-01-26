/**
 * Session API Route
 * 
 * Returns the current user session including GitHub token.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = createClient(req, res);
    
    // Get both user and session
    const userResult = await supabase.auth.getUser();
    const sessionResult = await supabase.auth.getSession();

    if (userResult.error) throw userResult.error;

    const user = userResult.data.user;
    const session = sessionResult.data.session;

    // Extract GitHub token from session if available
    const githubToken = session?.provider_token || null;

    return res.status(200).json({ 
      user: user || null,
      session: session ? {
        access_token: session.access_token,
        expires_at: session.expires_at,
      } : null,
      githubToken, // GitHub access token for API calls
    });
  } catch (error: any) {
    console.error("Session error:", error);
    return res.status(200).json({ user: null, session: null, githubToken: null });
  }
}
