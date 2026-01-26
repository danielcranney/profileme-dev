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
import { getFileMeta, upsertFile, getUsername, checkProfileRepo } from "../../../lib/github/repo";
import { profileJsonSchema } from "../../../lib/profile/schema";
import { renderReadme } from "../../../lib/profile/renderer";

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
        error: "Sponsor access required. Please sponsor the project to use sync features.",
      });
    }

    // Require GitHub token
    await requireToken(req, res);

    // Validate incoming JSON
    const profileJson = profileJsonSchema.parse(req.body);

    // Check if profile repo exists
    const repoExists = await checkProfileRepo(req, res);
    if (!repoExists) {
      return res.status(404).json({
        error: "Profile repository not found. Please create a repository with the same name as your GitHub username.",
      });
    }

    const username = await getUsername(req, res);

    // Generate README from JSON
    const readmeMarkdown = renderReadme(profileJson);

    // Get existing file SHAs (if they exist)
    const profileMeta = await getFileMeta(".profile/profile.json", req, res);
    const readmeMeta = await getFileMeta("README.md", req, res);

    // Prepare commits
    const commits: Array<Promise<{ sha: string; commit: any }>> = [];

    // Commit profile.json
    commits.push(
      upsertFile(
        ".profile/profile.json",
        JSON.stringify(profileJson, null, 2),
        `Update profile.json via ProfileMe.dev`,
        req,
        res,
        profileMeta?.sha || null
      )
    );

    // Commit README.md
    commits.push(
      upsertFile(
        "README.md",
        readmeMarkdown,
        `Update README.md via ProfileMe.dev`,
        req,
        res,
        readmeMeta?.sha || null
      )
    );

    // Execute all commits
    const results = await Promise.all(commits);

    // Update LocalStorage cache with new SHA
    // (This will be done client-side)

    return res.status(200).json({
      success: true,
      message: "Profile synced to GitHub successfully",
      commits: results.map((r) => ({
        sha: r.sha,
        url: r.commit.html_url,
      })),
      profileJsonSha: results[0].sha,
      readmeSha: results[1].sha,
    });
  } catch (error: any) {
    console.error("Sync error:", error);

    // Handle specific error cases
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid profile JSON",
        details: error.errors,
      });
    }

    if (error.message?.includes("rate limit")) {
      return res.status(429).json({
        error: "GitHub API rate limit exceeded. Please try again later.",
      });
    }

    if (error.message?.includes("permission") || error.message?.includes("403")) {
      return res.status(403).json({
        error: "Permission denied. Please ensure your GitHub token has repository write access.",
      });
    }

    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return res.status(404).json({
        error: "Repository or file not found. Please ensure your profile repository exists.",
      });
    }

    return res.status(500).json({
      error: error.message || "Failed to sync to GitHub",
    });
  }
}
