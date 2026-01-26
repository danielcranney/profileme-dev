/**
 * GitHub Repository Operations
 * 
 * Helpers for reading/writing files in user's GitHub repository.
 * Target repo: username/username (profile repo)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { requireToken } from "./token";

const PROFILE_JSON_PATH = ".profile/profile.json";
const README_PATH = "README.md";
const ASSETS_DIR = ".profile/assets";

/**
 * Get file metadata (SHA and content if needed)
 */
export async function getFileMeta(
  path: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ sha: string | null; content?: string } | null> {
  const token = await requireToken(req, res);
  const username = await getGitHubUsername(token);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (response.status === 404) {
      return { sha: null };
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      sha: data.sha,
      content: data.content ? Buffer.from(data.content, "base64").toString("utf-8") : undefined,
    };
  } catch (error: any) {
    console.error(`Error getting file meta for ${path}:`, error);
    throw error;
  }
}

/**
 * Get file content (parsed JSON for profile.json, raw for others)
 */
export async function getFileContent(
  path: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  const token = await requireToken(req, res);
  const username = await getGitHubUsername(token);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    // Parse JSON if it's the profile.json file
    if (path === PROFILE_JSON_PATH) {
      return JSON.parse(content);
    }

    return content;
  } catch (error: any) {
    console.error(`Error getting file content for ${path}:`, error);
    throw error;
  }
}

/**
 * Upsert file (create or update)
 */
export async function upsertFile(
  path: string,
  content: string,
  message: string,
  req: NextApiRequest,
  res: NextApiResponse,
  sha?: string | null | undefined
): Promise<{ sha: string; commit: any }> {
  const token = await requireToken(req, res);
  const username = await getGitHubUsername(token);

  // Encode content to base64
  const encodedContent = Buffer.from(content, "utf-8").toString("base64");

  const body: any = {
    message,
    content: encodedContent,
    branch: "main", // Default branch
  };

  // Include sha for updates (only if provided and truthy)
  // undefined/null means create new file, sha means update existing
  if (sha) {
    body.sha = sha;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      sha: data.content.sha,
      commit: data.commit,
    };
  } catch (error: any) {
    console.error(`Error upserting file ${path}:`, error);
    throw error;
  }
}

/**
 * Get GitHub username from token
 */
async function getGitHubUsername(token: string): Promise<string> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get GitHub user info");
  }

  const user = await response.json();
  return user.login;
}

/**
 * Get user's GitHub username (for use in API routes)
 */
export async function getUsername(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string> {
  const token = await requireToken(req, res);
  return await getGitHubUsername(token);
}

/**
 * Check if profile repo exists
 */
export async function checkProfileRepo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  const token = await requireToken(req, res);
  const username = await getGitHubUsername(token);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return response.ok;
  } catch (error) {
    return false;
  }
}
