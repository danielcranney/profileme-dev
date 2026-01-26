/**
 * Restore API Route (Sponsors Only)
 * 
 * Restores profile JSON from GitHub repository.
 * Fetches .profile/profile.json and returns it to client.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { checkSponsorStatus } from "../../../lib/github/sponsor";
import { requireToken } from "../../../lib/github/token";
import { getFileContent, getFileMeta, checkProfileRepo } from "../../../lib/github/repo";
import { profileJsonSchema } from "../../../lib/profile/schema";
import { migrateProfileJson } from "../../../lib/profile/migrate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check sponsor status
    const isSponsor = await checkSponsorStatus(req, res);
    if (!isSponsor) {
      return res.status(403).json({ 
        error: "Sponsor access required. Please sponsor the project to use restore features.",
      });
    }

    // Require GitHub token
    await requireToken(req, res);

    // Check if profile repo exists
    const repoExists = await checkProfileRepo(req, res);
    if (!repoExists) {
      return res.status(404).json({
        error: "Profile repository not found. Please create a repository with the same name as your GitHub username.",
      });
    }

    // Get file metadata (for SHA)
    const fileMeta = await getFileMeta(".profile/profile.json", req, res);

    if (!fileMeta || !fileMeta.sha) {
      return res.status(404).json({
        error: "Profile file not found. Please sync your profile first.",
      });
    }

    // Get file content
    const profileJson = await getFileContent(".profile/profile.json", req, res);

    if (!profileJson) {
      return res.status(404).json({
        error: "Profile file is empty or could not be read.",
      });
    }

    // Migrate and validate JSON
    const migratedJson = migrateProfileJson(profileJson);
    const validatedJson = profileJsonSchema.parse(migratedJson);

    return res.status(200).json({
      success: true,
      profileJson: validatedJson,
      sha: fileMeta.sha,
      message: "Profile restored from GitHub successfully",
    });
  } catch (error: any) {
    console.error("Restore error:", error);

    // Handle specific error cases
    if (error.message?.includes("rate limit")) {
      return res.status(429).json({
        error: "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    if (error.message?.includes("permission") || error.message?.includes("403")) {
      return res.status(403).json({
        error: "Permission denied. Please ensure your GitHub token has repository read access.",
      });
    }

    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return res.status(404).json({
        error: "Profile file not found. Please sync your profile first.",
      });
    }

    return res.status(500).json({
      error: error.message || "Failed to restore from GitHub",
    });
  }
}
