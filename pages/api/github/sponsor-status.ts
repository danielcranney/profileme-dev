/**
 * Sponsor Status API Route
 * 
 * Returns whether the current user is a sponsor.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { checkSponsorStatus } from "../../../lib/github/sponsor";
import { getToken } from "../../../lib/github/token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = await getToken(req, res);
    
    if (!token) {
      return res.status(200).json({ 
        isSponsor: false,
        connected: false,
        message: "Not connected to GitHub",
      });
    }

    const isSponsor = await checkSponsorStatus(req, res);

    return res.status(200).json({
      isSponsor,
      connected: true,
    });
  } catch (error: any) {
    console.error("Sponsor status error:", error);
    return res.status(200).json({
      isSponsor: false,
      connected: false,
      error: error.message,
    });
  }
}
