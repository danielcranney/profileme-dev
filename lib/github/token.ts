/**
 * GitHub Token Helper (Server-side)
 * 
 * Gets GitHub access token from Supabase session.
 * The token is stored in the session's provider_token field.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../supabase/server";

/**
 * Get GitHub access token from Supabase session
 * Returns null if not authenticated or no token available
 */
export async function getToken(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  try {
    const supabase = createClient(req, res);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // GitHub token is stored in provider_token when using GitHub OAuth
    return session.provider_token || null;
  } catch (error) {
    console.error("Failed to get GitHub token from session:", error);
    return null;
  }
}

/**
 * Require GitHub token - throws error if not authenticated
 */
export async function requireToken(req: NextApiRequest, res: NextApiResponse): Promise<string> {
  const token = await getToken(req, res);
  
  if (!token) {
    throw new Error("GitHub not connected. Please login with GitHub.");
  }
  
  return token;
}
