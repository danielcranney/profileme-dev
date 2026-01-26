/**
 * Sync API Route (Sponsors Only)
 *
 * Syncs profile JSON to GitHub repository.
 * Commits:
 * - .profile/profile.json
 * - README.md (generated from JSON)
 * - Assets if present
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { checkSponsorStatus } from "../../../lib/github/sponsor";
import { requireToken } from "../../../lib/github/token";
import {
  getFileMeta,
  upsertFile,
  getUsername,
  checkProfileRepo,
} from "../../../lib/github/repo";
import { profileJsonSchema } from "../../../lib/profile/schema";
import { renderReadme } from "../../../lib/profile/renderer";
import { renderPortfolio } from "../../../lib/profile/portfolio";
import { formatGitHubError } from "../../../lib/utils/errors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check sponsor status
    const isSponsor = await checkSponsorStatus(req, res);
    if (!isSponsor) {
      return res.status(403).json({
        error:
          "Sponsor access required. Please sponsor the project to use sync features.",
      });
    }

    // Require GitHub token
    await requireToken(req, res);

    // Validate incoming JSON
    let profileJson = profileJsonSchema.parse(req.body);

    // Check if profile repo exists
    const repoExists = await checkProfileRepo(req, res);
    if (!repoExists) {
      return res.status(404).json({
        error:
          "Profile repository not found. Please create a repository with the same name as your GitHub username.",
      });
    }

    const username = await getUsername(req, res);

    // Ensure animatedHand has a default value if missing
    if (
      profileJson.profile.introduction.animatedHand === undefined ||
      profileJson.profile.introduction.animatedHand === null
    ) {
      profileJson = {
        ...profileJson,
        profile: {
          ...profileJson.profile,
          introduction: {
            ...profileJson.profile.introduction,
            animatedHand: 0,
          },
        },
      };
    }

    // Generate README and Portfolio from JSON
    const readmeMarkdown = renderReadme(profileJson);
    const portfolioHtml = renderPortfolio(profileJson as any);

    // Fetch fresh SHAs right before updating (to avoid race conditions)
    // Update files sequentially to ensure we have the latest SHA for each
    let profileResult, readmeResult;

    // Helper function to update a file with retry on SHA mismatch
    const updateFileWithRetry = async (
      path: string,
      content: string,
      message: string,
      maxRetries = 1,
    ) => {
      let lastError;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          // Fetch fresh SHA right before update
          const fileMeta = await getFileMeta(path, req, res);
          const sha = fileMeta?.sha || undefined; // Use undefined (not null) for new files

          return await upsertFile(path, content, message, req, res, sha);
        } catch (error: any) {
          lastError = error;

          // If SHA mismatch and we have retries left, try again
          if (error.message?.includes("but expected") && attempt < maxRetries) {
            console.log(
              `SHA mismatch for ${path}, retrying (attempt ${attempt + 1}/${maxRetries + 1})...`,
            );
            // Small delay before retry
            await new Promise((resolve) => setTimeout(resolve, 100));
            continue;
          }

          // If it's a different error or we're out of retries, throw
          throw error;
        }
      }

      throw lastError;
    };

    // Update profile.json first
    profileResult = await updateFileWithRetry(
      ".profile/profile.json",
      JSON.stringify(profileJson, null, 2),
      `Update profile.json via ProfileMe.dev`,
    );

    // Update README.md
    readmeResult = await updateFileWithRetry(
      "README.md",
      readmeMarkdown,
      `Update README.md via ProfileMe.dev`,
    );

    // Update portfolio.html (for GitHub Pages)
    const portfolioMeta = await getFileMeta("portfolio.html", req, res);
    const portfolioResult = await updateFileWithRetry(
      "portfolio.html",
      portfolioHtml,
      `Update portfolio.html via ProfileMe.dev`,
    );

    // Update LocalStorage cache with new SHA
    // (This will be done client-side)

    return res.status(200).json({
      success: true,
      message: "Profile synced to GitHub successfully",
      commits: [
        {
          sha: profileResult.sha,
          url: profileResult.commit.html_url,
          file: ".profile/profile.json",
        },
        {
          sha: readmeResult.sha,
          url: readmeResult.commit.html_url,
          file: "README.md",
        },
        {
          sha: portfolioResult.sha,
          url: portfolioResult.commit.html_url,
          file: "portfolio.html",
        },
      ],
      profileJsonSha: profileResult.sha,
      readmeSha: readmeResult.sha,
      portfolioSha: portfolioResult.sha,
    });
  } catch (error: any) {
    console.error("Sync error:", error);

    // Handle validation errors
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid profile JSON",
        message:
          "Please check your profile data. Some fields may be missing or invalid.",
        code: "VALIDATION_ERROR",
        details: error.errors,
      });
    }

    // Format GitHub errors
    const formattedError = formatGitHubError(error);

    // Determine status code
    let statusCode = 500;
    if (formattedError.code === "RATE_LIMIT") statusCode = 429;
    else if (formattedError.code === "PERMISSION_DENIED") statusCode = 403;
    else if (
      formattedError.code === "REPO_NOT_FOUND" ||
      formattedError.code === "FILE_NOT_FOUND"
    )
      statusCode = 404;
    else if (formattedError.code === "SHA_MISMATCH") statusCode = 409;
    else if (formattedError.code === "VALIDATION_ERROR") statusCode = 400;

    return res.status(statusCode).json({
      error: formattedError.message,
      code: formattedError.code,
      retry: formattedError.retry,
      action: formattedError.action,
    });
  }
}
