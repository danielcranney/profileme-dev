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
  batchUpdateFiles,
  unifiedBatchSync,
} from "../../../lib/github/repo";
import { profileJsonSchema } from "../../../lib/profile/schema";
import { renderReadme } from "../../../lib/profile/renderer";
import { renderPortfolio } from "../../../lib/profile/portfolio";
import { formatGitHubError } from "../../../lib/utils/errors";
import {
  collectIconsFromProfile,
  uploadIcons,
  updateProfileJsonWithLocalIcons,
  convertIconPathToGitHubPagesUrl,
  cleanupUnusedIcons,
} from "../../../lib/github/icons";

/**
 * Convert icon paths to GitHub Pages URLs for rendering
 */
function convertPathsToGitHubPagesUrls(obj: any, username: string): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertPathsToGitHubPagesUrls(item, username));
  } else if (obj && typeof obj === "object") {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === "path" || key === "darkPath") {
        converted[key] = convertIconPathToGitHubPagesUrl(value as string, username);
      } else {
        converted[key] = convertPathsToGitHubPagesUrls(value, username);
      }
    }
    return converted;
  }
  return obj;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const syncStartTime = Date.now();
  console.log("🔄 Starting sync process...");

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

    // Collect icons from profile
    const iconCollectionStart = Date.now();
    const icons = collectIconsFromProfile(profileJson);
    const iconCollectionTime = Date.now() - iconCollectionStart;
    console.log(`⏱️  Icon collection: ${iconCollectionTime}ms (${icons.length} icons found)`);
    
    // Download icons and identify which ones to upload
    const iconDownloadStart = Date.now();
    // Inline download function (downloadIcon is not exported from icons.ts)
    const downloadIcon = async (url: string): Promise<string> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
        }
        
        return await response.text();
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
          throw new Error("Timeout downloading icon");
        }
        throw error;
      }
    };
    
    const downloadPromises = icons.map(async (icon) => {
      try {
        const content = await downloadIcon(icon.url);
        return { icon, content, error: null };
      } catch (downloadError: any) {
        if (downloadError.message?.includes("404") || downloadError.message?.includes("Failed to download") || downloadError.message?.includes("Timeout")) {
          return { icon, content: null, error: "not_found" };
        }
        return { icon, content: null, error: downloadError };
      }
    });

    const downloadResults = await Promise.all(downloadPromises);
    const downloadTime = Date.now() - iconDownloadStart;
    const validIcons = downloadResults.filter(r => r.content !== null);
    console.log(`⏱️  Icon downloads: ${downloadTime}ms (${validIcons.length}/${icons.length} successful)`);

    // Identify icons to delete (unused icons)
    const { getExistingIcons } = await import("../../../lib/github/icons");
    const existingIcons = await getExistingIcons(req, res);
    const normalizePath = (path: string): string => path.trim().replace(/^\.\//, "");
    const currentPaths = new Set(validIcons.map(({ icon }) => normalizePath(icon.localPath)));
    const iconsToDelete = existingIcons
      .filter(existing => !currentPaths.has(normalizePath(existing.path)))
      .map(icon => ({ path: icon.path }));

    // Update profile JSON to use local icon paths
    const profileJsonWithLocalIcons = updateProfileJsonWithLocalIcons(profileJson);

    // Create a version of profile JSON with GitHub Pages URLs for rendering
    const profileJsonForRendering = JSON.parse(JSON.stringify(profileJsonWithLocalIcons));
    const profileJsonForRenderingConverted = convertPathsToGitHubPagesUrls(profileJsonForRendering, username);

    // Generate README and Portfolio from JSON (with GitHub Pages URLs)
    const readmeMarkdown = renderReadme(profileJsonForRenderingConverted);
    const portfolioHtml = renderPortfolio(profileJsonForRenderingConverted as any);

    // Prepare ALL files for unified batch operation
    const filesToUpdate: Array<{ path: string; content: string }> = [
      {
        path: ".profile/profile.json",
        content: JSON.stringify(profileJsonWithLocalIcons, null, 2),
      },
      {
        path: "README.md",
        content: readmeMarkdown,
      },
      {
        path: "index.html",
        content: portfolioHtml,
      },
      // Add all valid icons
      ...validIcons.map(({ icon, content }) => ({
        path: icon.localPath,
        content: content!,
      })),
    ];

    // Perform unified batch sync: uploads, updates, and deletions in ONE commit
    const unifiedSyncStart = Date.now();
    let profileResult: { sha: string; commit: any };
    let readmeResult: { sha: string; commit: any };
    let indexResult: { sha: string; commit: any };
    let iconUploadResults: Array<{ path: string; sha: string }> = [];
    let iconCleanupResults: Array<{ path: string }> = [];

    try {
      const batchResult = await unifiedBatchSync(
        filesToUpdate,
        iconsToDelete,
        `Update profile via ProfileMe.dev (${validIcons.length} icons, ${iconsToDelete.length} removed)`,
        req,
        res
      );

      // Extract file SHAs
      const [profileMeta, readmeMeta, indexMeta] = await Promise.all([
        getFileMeta(".profile/profile.json", req, res),
        getFileMeta("README.md", req, res),
        getFileMeta("index.html", req, res),
      ]);

      profileResult = {
        sha: profileMeta?.sha || "",
        commit: batchResult.commit,
      };
      readmeResult = {
        sha: readmeMeta?.sha || "",
        commit: batchResult.commit,
      };
      indexResult = {
        sha: indexMeta?.sha || "",
        commit: batchResult.commit,
      };

      // Prepare icon results (we don't have individual SHAs from batch, but that's okay)
      iconUploadResults = validIcons.map(({ icon }) => ({ path: icon.localPath, sha: "" }));
      iconCleanupResults = iconsToDelete;

      const unifiedSyncTime = Date.now() - unifiedSyncStart;
      console.log(`⏱️  Unified batch sync: ${unifiedSyncTime}ms (all operations in one commit)`);
    } catch (unifiedError: any) {
      console.error("Unified batch sync failed, falling back to separate operations:", unifiedError);
      
      // Fallback: try separate operations (slower but more reliable)
      // This is the old approach as a fallback
      if (validIcons.length > 0) {
        try {
          const { uploadIcons } = await import("../../../lib/github/icons");
          iconUploadResults = await uploadIcons(icons, req, res);
        } catch (error: any) {
          console.error("Error uploading icons (fallback):", error);
        }
      }

      try {
        const { cleanupUnusedIcons } = await import("../../../lib/github/icons");
        iconCleanupResults = await cleanupUnusedIcons(icons, req, res);
      } catch (error: any) {
        console.error("Error cleaning up icons (fallback):", error);
      }

      // Fallback file updates
      try {
        const batchFiles = [
          {
            path: ".profile/profile.json",
            content: JSON.stringify(profileJsonWithLocalIcons, null, 2),
          },
          {
            path: "README.md",
            content: readmeMarkdown,
          },
          {
            path: "index.html",
            content: portfolioHtml,
          },
        ];

        const batchResult = await batchUpdateFiles(
          batchFiles,
          `Update profile files via ProfileMe.dev`,
          req,
          res
        );

        const [profileMeta, readmeMeta, indexMeta] = await Promise.all([
          getFileMeta(".profile/profile.json", req, res),
          getFileMeta("README.md", req, res),
          getFileMeta("index.html", req, res),
        ]);

        profileResult = {
          sha: profileMeta?.sha || "",
          commit: batchResult.commit,
        };
        readmeResult = {
          sha: readmeMeta?.sha || "",
          commit: batchResult.commit,
        };
        indexResult = {
          sha: indexMeta?.sha || "",
          commit: batchResult.commit,
        };
      } catch (error: any) {
        throw new Error(`Failed to update files: ${error.message}`);
      }
    }

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
          sha: indexResult.sha,
          url: indexResult.commit.html_url,
          file: "index.html",
        },
      ...iconUploadResults.map((icon) => ({
        sha: icon.sha,
        url: "", // Icons don't have individual commit URLs
        file: icon.path,
      })),
      ...iconCleanupResults.map((icon) => ({
        sha: "",
        url: "",
        file: icon.path,
        deleted: true,
      })),
      ],
      profileJsonSha: profileResult.sha,
      readmeSha: readmeResult.sha,
      indexHtmlSha: indexResult.sha,
      iconsUploaded: iconUploadResults.length,
      iconsDeleted: iconCleanupResults.length,
    });

    const totalSyncTime = Date.now() - syncStartTime;
    console.log(`✅ Sync completed successfully in ${totalSyncTime}ms (${(totalSyncTime / 1000).toFixed(2)}s)`);
  } catch (error: any) {
    const totalSyncTime = Date.now() - syncStartTime;
    console.error(`❌ Sync failed after ${totalSyncTime}ms (${(totalSyncTime / 1000).toFixed(2)}s):`, error);

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
