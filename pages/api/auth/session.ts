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

    // getSession() first so we don't call getUser() when there's no session
    // (getUser() throws AuthSessionMissingError when not logged in)
    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data.session;

    if (!session) {
      return res.status(200).json({ user: null, session: null, githubToken: null });
    }

    // Verify with server; if no valid session (getUser throws), return nulls so client clears state.
    let user: typeof session.user | null = session.user;
    try {
      const userResult = await supabase.auth.getUser();
      if (userResult.error || !userResult.data.user) {
        return res.status(200).json({ user: null, session: null, githubToken: null });
      }
      user = userResult.data.user;
    } catch {
      // AuthSessionMissingError or invalid/expired session – treat as not logged in
      return res.status(200).json({ user: null, session: null, githubToken: null });
    }

    const githubToken = session.provider_token || null;

    return res.status(200).json({
      user,
      session: {
        access_token: session.access_token,
        expires_at: session.expires_at,
      },
      githubToken,
    });
  } catch (error: unknown) {
    const isMissingSession =
      error &&
      typeof error === "object" &&
      (error as { __isAuthError?: boolean; message?: string }).__isAuthError === true;

    if (!isMissingSession) {
      console.error("Session error:", error);
    }
    return res.status(200).json({ user: null, session: null, githubToken: null });
  }
}
