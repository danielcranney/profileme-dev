/**
 * Logout API Route
 * 
 * Handles Supabase authentication logout.
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
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(400).json({ error: error.message || "Logout failed" });
  }
}
