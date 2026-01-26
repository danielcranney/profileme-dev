/**
 * OAuth Callback Route
 * 
 * Handles OAuth callback from Supabase.
 * This route is called after successful GitHub OAuth authentication.
 * The GitHub access token is stored in the Supabase session.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (code) {
    try {
      const supabase = createClient(req, res);
      const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
      
      if (error) {
        console.error("OAuth callback error:", error);
        return res.redirect(`/?error=${encodeURIComponent(error.message)}`);
      }

      // Session is now stored in cookies
      // GitHub access token is available in data.session.provider_token
      // Redirect to success
      return res.redirect("/?connected=github");
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      return res.redirect(`/?error=${encodeURIComponent(error.message || "OAuth failed")}`);
    }
  }

  // Redirect to home page
  res.redirect("/");
}
