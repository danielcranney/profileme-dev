/**
 * File Meta API Route
 * 
 * Returns file metadata (SHA) for a given path.
 * Used for stale-checking.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { checkSponsorStatus } from "../../../lib/github/sponsor";
import { requireToken } from "../../../lib/github/token";
import { getFileMeta } from "../../../lib/github/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check sponsor status
    const isSponsor = await checkSponsorStatus(req, res);
    if (!isSponsor) {
      return res.status(403).json({ 
        error: "Sponsor access required",
      });
    }

    // Require GitHub token
    await requireToken(req, res);

    const { path } = req.query;

    if (!path || typeof path !== "string") {
      return res.status(400).json({ error: "Path parameter required" });
    }

    const meta = await getFileMeta(path, req, res);

    return res.status(200).json({
      sha: meta?.sha || null,
      exists: !!meta?.sha,
    });
  } catch (error: any) {
    console.error("File meta error:", error);

    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return res.status(404).json({
        error: "File not found",
        sha: null,
        exists: false,
      });
    }

    return res.status(500).json({
      error: error.message || "Failed to get file metadata",
    });
  }
}
