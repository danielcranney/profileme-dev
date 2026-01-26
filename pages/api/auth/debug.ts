/**
 * Debug Auth Route
 *
 * Detailed debugging endpoint to see what's happening with auth.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabase = createClient(req, res);

  // Get all auth-related info
  const sessionResult = await supabase.auth.getSession();
  const userResult = await supabase.auth.getUser();

  // Get all cookies
  const allCookies = req.cookies;
  const supabaseCookies = Object.keys(allCookies)
    .filter((key) => key.includes("supabase") || key.includes("auth"))
    .reduce(
      (obj, key) => {
        obj[key] = allCookies[key]?.substring(0, 20) + "...";
        return obj;
      },
      {} as Record<string, string>,
    );

  return res.status(200).json({
    session: {
      exists: !!sessionResult.data.session,
      user: sessionResult.data.session?.user?.id || null,
      expires_at: sessionResult.data.session?.expires_at || null,
      has_provider_token: !!sessionResult.data.session?.provider_token,
      provider: sessionResult.data.session?.provider_token ? "github" : null,
      access_token_preview:
        sessionResult.data.session?.access_token?.substring(0, 20) || null,
    },
    user: {
      exists: !!userResult.data.user,
      id: userResult.data.user?.id || null,
      email: userResult.data.user?.email || null,
      metadata: userResult.data.user?.user_metadata || null,
    },
    cookies: {
      all_count: Object.keys(allCookies).length,
      supabase_cookies: supabaseCookies,
      cookie_names: Object.keys(allCookies),
    },
    errors: {
      session: sessionResult.error?.message || null,
      user: userResult.error?.message || null,
    },
  });
}
