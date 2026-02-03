/**
 * OAuth Callback Route
 *
 * Handles OAuth callback from Supabase.
 * Supabase redirects here after GitHub OAuth completes.
 * We need to exchange the code for a session.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error: oauthError } = req.query;

  // Check for OAuth errors from GitHub
  if (oauthError) {
    console.error("OAuth error from provider:", oauthError);
    return res.redirect(`/?error=${encodeURIComponent(oauthError as string)}`);
  }

  try {
    const supabase = createClient(req, res);

    // Check if we have a code to exchange
    if (code) {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        code as string
      );

      if (error) {
        console.error("OAuth callback error:", error);
        return res.redirect(`/?error=${encodeURIComponent(error.message)}`);
      }

      if (!data.session) {
        console.error("No session after code exchange");
        return res.redirect(
          `/?error=${encodeURIComponent("Failed to create session")}`
        );
      }

      console.log("OAuth callback success (code exchange):", {
        userId: data.user?.id,
        hasProviderToken: !!data.session.provider_token,
        providerTokenPreview: data.session.provider_token?.substring(0, 10),
      });

      // Verify session was set in cookies
      const verifySession = await supabase.auth.getSession();
      console.log("Session verification after exchange:", {
        hasSession: !!verifySession.data.session,
        userId: verifySession.data.session?.user?.id,
      });
    } else {
      // No code - check if session already exists (Supabase might have set it)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("OAuth callback success (existing session):", {
          userId: session.user?.id,
          hasProviderToken: !!session.provider_token,
        });
      } else {
        console.warn("OAuth callback: No code and no existing session");
        console.log("Available query params:", Object.keys(req.query));
        return res.redirect(
          `/?error=${encodeURIComponent(
            "No authorization code or session found"
          )}`
        );
      }
    }

    // Session should now be in cookies
    // Redirect to home page - client will detect session
    return res.redirect("/create-profile?connected=github");
  } catch (error: any) {
    console.error("OAuth callback exception:", error);
    return res.redirect(
      `/?error=${encodeURIComponent(error.message || "OAuth failed")}`
    );
  }
}
