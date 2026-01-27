/**
 * Icon Packaging Utilities
 * 
 * Handles downloading and uploading icons to user's GitHub repository
 * for GitHub Pages hosting.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { requireToken } from "./token";
import { upsertFile, getFileMeta, listDirectory, deleteFile } from "./repo";

const ICONS_DIR = ".profile/assets/icons";
const PRODUCTION_ICON_BASE = "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons";

/**
 * Extract icon URL from path (handles both full URLs and relative paths)
 */
function extractIconUrl(path: string): string | null {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // If it's a relative path, construct full URL
  if (path.startsWith("/icons/")) {
    return `${PRODUCTION_ICON_BASE}${path}`;
  }
  
  // If it already references the production base, return as-is
  if (path.includes("raw.githubusercontent.com/danielcranney/readme-generator")) {
    return path;
  }
  
  return null;
}

/**
 * Get local path for icon in user's repo
 */
function getLocalIconPath(originalPath: string): string {
  // Extract the icon filename and category from the original path
  // Example: https://raw.githubusercontent.com/.../icons/skills/c-colored.svg
  // -> .profile/assets/icons/skills/c-colored.svg
  
  const url = extractIconUrl(originalPath);
  if (!url) return originalPath; // Fallback to original if can't parse
  
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    
    // Find the "icons" directory in the path
    const iconsIndex = pathParts.findIndex(part => part === "icons");
    if (iconsIndex === -1 || iconsIndex === pathParts.length - 1) {
      return originalPath; // Can't parse, return original
    }
    
    // Get everything after "icons"
    const relativePath = pathParts.slice(iconsIndex + 1).join("/");
    return `${ICONS_DIR}/${relativePath}`;
  } catch (e) {
    return originalPath; // Invalid URL, return original
  }
}


/**
 * Download icon from source URL with timeout
 * Returns the content as a string (SVG files are text)
 */
async function downloadIcon(url: string, timeoutMs: number = 5000): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to download icon from ${url}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Timeout downloading icon from ${url}`);
    }
    throw error;
  }
}

/**
 * Collect all unique icons from profile JSON
 * For skills: Includes all variations (regular and dark if exists)
 * For socials: Only includes icons for configured socials (with linkSuffix)
 */
export function collectIconsFromProfile(
  profileJson: any
): Array<{ originalPath: string; localPath: string; url: string }> {
  const icons = new Map<string, { originalPath: string; localPath: string; url: string }>();
  
  // Collect skill icons - include all variations
  if (profileJson.profile?.skills) {
    for (const category of Object.values(profileJson.profile.skills) as any[]) {
      if (Array.isArray(category)) {
        for (const icon of category) {
          // Always include the main path
          if (icon.path) {
            const url = extractIconUrl(icon.path);
            if (url) {
              const localPath = getLocalIconPath(icon.path);
              icons.set(url, { originalPath: icon.path, localPath, url });
            }
          }
          
          // Include dark variant if it exists (explicitly set in icon object)
          if (icon.darkPath) {
            const url = extractIconUrl(icon.darkPath);
            if (url) {
              const localPath = getLocalIconPath(icon.darkPath);
              icons.set(url, { originalPath: icon.darkPath, localPath, url });
            }
          }
          // Note: We only include dark variants that are explicitly set in the profile JSON
          // Auto-detection of dark variants is disabled to avoid unnecessary downloads
        }
      }
    }
  }
  
  // Collect social icons - only for configured socials (have linkSuffix)
  if (profileJson.profile?.socials) {
    Object.entries(profileJson.profile.socials).forEach(([platform, social]: [string, any]) => {
      // Only collect if social is configured (has linkSuffix)
      if (social && typeof social === "object" && social.linkSuffix && social.linkSuffix.trim() !== "") {
        if (social.path) {
          const url = extractIconUrl(social.path);
          if (url) {
            const localPath = getLocalIconPath(social.path);
            icons.set(url, { originalPath: social.path, localPath, url });
          }
        }
        if (social.darkPath) {
          const url = extractIconUrl(social.darkPath);
          if (url) {
            const localPath = getLocalIconPath(social.darkPath);
            icons.set(url, { originalPath: social.darkPath, localPath, url });
          }
        }
      }
    });
  }
  
  // Collect support icons - only for configured support (have linkSuffix)
  if (profileJson.profile?.support) {
    Object.entries(profileJson.profile.support).forEach(([platform, support]: [string, any]) => {
      // Only collect if support is configured (has linkSuffix)
      if (support && typeof support === "object" && support.linkSuffix && support.linkSuffix.trim() !== "") {
        if (support.path) {
          const url = extractIconUrl(support.path);
          if (url) {
            const localPath = getLocalIconPath(support.path);
            icons.set(url, { originalPath: support.path, localPath, url });
          }
        }
      }
    });
  }
  
  return Array.from(icons.values());
}

/**
 * Upload icons to GitHub repository
 */
export async function uploadIcons(
  icons: Array<{ originalPath: string; localPath: string; url: string }>,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Array<{ path: string; sha: string }>> {
  const results = [];
  
  for (const icon of icons) {
    try {
      // Download icon (SVG files are text)
      // If download fails (404), skip this icon (dark variant might not exist)
      let iconContent: string;
      try {
        iconContent = await downloadIcon(icon.url);
      } catch (downloadError: any) {
        // If it's a 404, the dark variant doesn't exist - skip it
        if (downloadError.message?.includes("404") || downloadError.message?.includes("Failed to download")) {
          console.log(`Skipping icon ${icon.localPath} - not found at source`);
          continue;
        }
        throw downloadError;
      }
      
      // Check if file already exists
      const fileMeta = await getFileMeta(icon.localPath, req, res);
      const sha = fileMeta?.sha || undefined;
      
      // Upload to GitHub (upsertFile will handle base64 encoding)
      const result = await upsertFile(
        icon.localPath,
        iconContent,
        `Add icon: ${icon.localPath.split("/").pop()}`,
        req,
        res,
        sha
      );
      
      results.push({ path: icon.localPath, sha: result.sha });
    } catch (error: any) {
      console.error(`Failed to upload icon ${icon.localPath}:`, error);
      // Continue with other icons even if one fails
    }
  }
  
  return results;
}

/**
 * Update profile JSON to use local icon paths
 */
export function updateProfileJsonWithLocalIcons(profileJson: any): any {
  const updated = JSON.parse(JSON.stringify(profileJson)); // Deep clone
  
  // Update skill icons
  if (updated.profile?.skills) {
    Object.keys(updated.profile.skills).forEach((category) => {
      if (Array.isArray(updated.profile.skills[category])) {
        updated.profile.skills[category] = updated.profile.skills[category].map((icon: any) => ({
          ...icon,
          path: icon.path ? getLocalIconPath(icon.path) : icon.path,
          darkPath: icon.darkPath ? getLocalIconPath(icon.darkPath) : icon.darkPath,
        }));
      }
    });
  }
  
  // Update social icons
  if (updated.profile?.socials) {
    Object.keys(updated.profile.socials).forEach((platform) => {
      const social = updated.profile.socials[platform];
      if (social.path) {
        social.path = getLocalIconPath(social.path);
      }
      if (social.darkPath) {
        social.darkPath = getLocalIconPath(social.darkPath);
      }
    });
  }
  
  // Update support icons
  if (updated.profile?.support) {
    Object.keys(updated.profile.support).forEach((platform) => {
      const support = updated.profile.support[platform];
      if (support.path) {
        support.path = getLocalIconPath(support.path);
      }
    });
  }
  
  return updated;
}

/**
 * Convert icon path to GitHub Pages URL if it's a local path
 */
export function convertIconPathToGitHubPagesUrl(path: string, username: string): string {
  // If it's already a full URL, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // If it's a local path (starts with .profile/assets), convert to GitHub Pages URL
  if (path.startsWith(".profile/assets/")) {
    return `https://${username}.github.io/${username}/${path}`;
  }
  
  // Otherwise return as-is (might be a relative path that works)
  return path;
}

/**
 * Get all existing icon files from GitHub repository
 */
export async function getExistingIcons(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Array<{ path: string; sha: string }>> {
  try {
    const files = await listDirectory(ICONS_DIR, req, res);
    // Filter to only icon files (SVG)
    return files
      .filter((file) => file.path.endsWith(".svg"))
      .map((file) => ({ path: file.path, sha: file.sha }));
  } catch (error: any) {
    // If directory doesn't exist, return empty array
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return [];
    }
    throw error;
  }
}

/**
 * Clean up unused icons from GitHub repository
 * Removes icons that are no longer in the profile
 */
export async function cleanupUnusedIcons(
  currentIcons: Array<{ originalPath: string; localPath: string; url: string }>,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Array<{ path: string }>> {
  try {
    // Get all existing icons from GitHub
    const existingIcons = await getExistingIcons(req, res);
    
    // Create a set of current icon paths (normalized)
    const currentPaths = new Set(
      currentIcons.map((icon) => icon.localPath)
    );
    
    // Find icons that exist in GitHub but not in current profile
    const iconsToDelete = existingIcons.filter(
      (existing) => !currentPaths.has(existing.path)
    );
    
    // Delete unused icons
    const deleted: Array<{ path: string }> = [];
    for (const icon of iconsToDelete) {
      try {
        await deleteFile(
          icon.path,
          `Remove unused icon: ${icon.path.split("/").pop()}`,
          req,
          res,
          icon.sha
        );
        deleted.push({ path: icon.path });
      } catch (error: any) {
        console.error(`Failed to delete icon ${icon.path}:`, error);
        // Continue with other deletions even if one fails
      }
    }
    
    return deleted;
  } catch (error: any) {
    console.error("Error cleaning up unused icons:", error);
    // Don't throw - cleanup failures shouldn't block sync
    return [];
  }
}
