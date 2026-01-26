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
import { formatGitHubError } from "../../../lib/utils/errors";

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

    // Format GitHub errors
    const formattedError = formatGitHubError(error);
    
    // Determine status code
    let statusCode = 500;
    if (formattedError.code === "RATE_LIMIT") statusCode = 429;
    else if (formattedError.code === "PERMISSION_DENIED") statusCode = 403;
    else if (formattedError.code === "REPO_NOT_FOUND" || formattedError.code === "FILE_NOT_FOUND") statusCode = 404;

    return res.status(statusCode).json({
      error: formattedError.message,
      code: formattedError.code,
      retry: formattedError.retry,
      action: formattedError.action,
    });
  }
}
