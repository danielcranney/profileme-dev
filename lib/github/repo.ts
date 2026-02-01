/**
 * GitHub Repository Operations
 * 
 * Helpers for reading/writing files in user's GitHub repository.
 * Target repo: username/username (profile repo)
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { requireToken } from "./token";

/**
 * Create initial commit and refs/heads/main for an empty repo (no branch yet).
 * Used when repo was created with auto_init: false or ref was deleted.
 */
async function createInitialCommitAndRef(
  token: string,
  username: string
): Promise<void> {
  const base = `https://api.github.com/repos/${username}/${username}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  const treeRes = await fetch(`${base}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({ tree: [] }),
  });
  if (!treeRes.ok) {
    const err = (await treeRes.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || `Failed to create tree: ${treeRes.statusText}`);
  }
  const { sha: treeSha } = await treeRes.json();

  const commitRes = await fetch(`${base}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tree: treeSha,
      message: "Initial commit",
      parents: [],
    }),
  });
  if (!commitRes.ok) {
    const err = (await commitRes.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || `Failed to create commit: ${commitRes.statusText}`);
  }
  const { sha: commitSha } = await commitRes.json();

  const refRes = await fetch(`${base}/git/refs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ref: "refs/heads/main",
      sha: commitSha,
    }),
  });
  if (!refRes.ok) {
    const err = (await refRes.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || `Failed to create ref: ${refRes.statusText}`);
  }
}

/**
 * Get current branch commit SHA.
 * If the repo has no branch (empty repo), creates initial commit and ref then retries.
 */
async function getCurrentCommitSha(
  token: string,
  username: string
): Promise<{ commitSha: string; treeSha: string }> {
  const refResponse = await fetch(
    `https://api.github.com/repos/${username}/${username}/git/refs/heads/main`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!refResponse.ok) {
    const status = refResponse.status;
    if (status === 404 || status === 409) {
      await createInitialCommitAndRef(token, username);
      return getCurrentCommitSha(token, username);
    }
    throw new Error(`Failed to get branch reference: ${refResponse.statusText}`);
  }

  const refData = await refResponse.json();
  const commitSha = refData.object.sha;

  const commitResponse = await fetch(
    `https://api.github.com/repos/${username}/${username}/git/commits/${commitSha}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!commitResponse.ok) {
    throw new Error(`Failed to get commit: ${commitResponse.statusText}`);
  }

  const commitData = await commitResponse.json();
  return { commitSha, treeSha: commitData.tree.sha };
}

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

/**
 * Create the profile repo (username/username) if it doesn't exist.
 * Used when sync would otherwise fail with "Profile repository not found".
 */
export async function createProfileRepo(
  token: string,
  username: string
): Promise<void> {
  const response = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      description: "My GitHub profile",
      private: false,
      auto_init: true, // required so main branch exists; sync will overwrite README
    }),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message || `Failed to create repository: ${response.statusText}`);
  }
}

/**
 * List directory contents (returns array of file paths)
 */
export async function listDirectory(
  path: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Array<{ path: string; sha: string; type: string }>> {
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
      return []; // Directory doesn't exist
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // If it's a single file (not a directory), return empty array
    if (!Array.isArray(data)) {
      return [];
    }

    // Recursively get all files
    const files: Array<{ path: string; sha: string; type: string }> = [];
    
    for (const item of data) {
      if (item.type === "file") {
        files.push({ path: item.path, sha: item.sha, type: item.type });
      } else if (item.type === "dir") {
        // Recursively list subdirectories
        const subFiles = await listDirectory(item.path, req, res);
        files.push(...subFiles);
      }
    }

    return files;
  } catch (error: any) {
    console.error(`Error listing directory ${path}:`, error);
    throw error;
  }
}

/**
 * Delete file from GitHub repository
 */
export async function deleteFile(
  path: string,
  message: string,
  req: NextApiRequest,
  res: NextApiResponse,
  sha: string
): Promise<void> {
  const token = await requireToken(req, res);
  const username = await getGitHubUsername(token);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${username}/contents/${path}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sha,
          branch: "main",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`Error deleting file ${path}:`, error);
    throw error;
  }
}

/**
 * Get recursive tree from GitHub (all files in repo)
 */
async function getRecursiveTree(
  token: string,
  username: string,
  treeSha: string
): Promise<Array<{ path: string; sha: string; mode: string; type: string }>> {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${username}/git/trees/${treeSha}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get recursive tree: ${response.statusText}`);
  }

  const treeData = await response.json();
  // Return only files (type === "blob"), not directories
  return (treeData.tree || []).filter((item: any) => item.type === "blob");
}

/**
 * Unified batch operation: upload, update, and delete files in ONE commit
 * This is the fastest approach - all operations in a single atomic commit
 */
export async function unifiedBatchSync(
  filesToUpdate: Array<{ path: string; content: string }>,
  filesToDelete: Array<{ path: string }>,
  message: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ commit: any; tree: any }> {
  const token = await requireToken(req, res);
  const username = await getGitHubUsername(token);

  try {
    const syncStart = Date.now();
    
    // Step 1: Get current commit and tree SHA
    const { commitSha, treeSha } = await getCurrentCommitSha(token, username);

    // Step 2: Get all existing files from current tree (for deletions)
    const treeFetchStart = Date.now();
    const existingFiles = await getRecursiveTree(token, username, treeSha);
    const treeFetchTime = Date.now() - treeFetchStart;
    console.log(`⏱️  Tree fetch (recursive): ${treeFetchTime}ms (${existingFiles.length} existing files)`);

    // Step 3: Create blobs for all files to update in parallel
    const blobStart = Date.now();
    const blobPromises = filesToUpdate.map(async (file) => {
      const blobResponse = await fetch(
        `https://api.github.com/repos/${username}/${username}/git/blobs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: Buffer.from(file.content, "utf-8").toString("base64"),
            encoding: "base64",
          }),
        }
      );

      if (!blobResponse.ok) {
        const errorData = await blobResponse.json();
        throw new Error(`Failed to create blob for ${file.path}: ${errorData.message}`);
      }

      const blobData = await blobResponse.json();
      return {
        path: file.path,
        sha: blobData.sha,
        mode: "100644",
        type: "blob",
      };
    });

    const newTreeEntries = await Promise.all(blobPromises);
    const blobTime = Date.now() - blobStart;
    console.log(`⏱️  Blob creation (parallel): ${blobTime}ms (${filesToUpdate.length} files)`);

    // Step 4: Build final tree
    // - Include all existing files EXCEPT those being deleted
    // - Include all new/updated files (they override existing ones)
    const deletePaths = new Set(filesToDelete.map(f => f.path));
    const updatePaths = new Set(filesToUpdate.map(f => f.path));
    
    const finalTreeEntries: Array<{ path: string; sha: string; mode: string; type: string }> = [];
    
    // Add existing files (excluding deletions and updates - updates will be added next)
    for (const existing of existingFiles) {
      if (!deletePaths.has(existing.path) && !updatePaths.has(existing.path)) {
        finalTreeEntries.push({
          path: existing.path,
          sha: existing.sha,
          mode: existing.mode,
          type: existing.type,
        });
      }
    }
    
    // Add all new/updated files (these override any existing ones)
    finalTreeEntries.push(...newTreeEntries);

    // Step 5: Create tree (single API call)
    // If we have deletions, we can't use base_tree (it would include deleted files)
    // Instead, we explicitly list all files we want to keep
    const treeStart = Date.now();
    const treeBody: any = {
      tree: finalTreeEntries,
    };
    
    // Only use base_tree if we're not deleting anything (optimization)
    // When deleting, we need explicit control over the tree
    if (filesToDelete.length === 0) {
      treeBody.base_tree = treeSha;
    }
    
    const treeResponse = await fetch(
      `https://api.github.com/repos/${username}/${username}/git/trees`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(treeBody),
      }
    );

    if (!treeResponse.ok) {
      const errorData = await treeResponse.json();
      throw new Error(`Failed to create tree: ${errorData.message}`);
    }

    const treeData = await treeResponse.json();
    const treeTime = Date.now() - treeStart;
    console.log(`⏱️  Tree creation: ${treeTime}ms (${finalTreeEntries.length} total entries, ${filesToDelete.length} deleted)`);

    // Step 6: Create commit (single API call)
    const commitStart = Date.now();
    const newCommitResponse = await fetch(
      `https://api.github.com/repos/${username}/${username}/git/commits`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          tree: treeData.sha,
          parents: [commitSha],
        }),
      }
    );

    if (!newCommitResponse.ok) {
      const errorData = await newCommitResponse.json();
      throw new Error(`Failed to create commit: ${errorData.message}`);
    }

    const commitResult = await newCommitResponse.json();
    const commitTime = Date.now() - commitStart;
    console.log(`⏱️  Commit creation: ${commitTime}ms`);

    // Step 7: Update branch reference (single API call)
    const refStart = Date.now();
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${username}/${username}/git/refs/heads/main`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: commitResult.sha,
        }),
      }
    );

    if (!updateRefResponse.ok) {
      const errorData = await updateRefResponse.json();
      throw new Error(`Failed to update branch: ${errorData.message}`);
    }

    const refTime = Date.now() - refStart;
    const totalTime = Date.now() - syncStart;
    console.log(`⏱️  Reference update: ${refTime}ms`);
    console.log(`⏱️  Unified batch sync: ${totalTime}ms (${filesToUpdate.length} updated, ${filesToDelete.length} deleted in one commit)`);

    return {
      commit: commitResult,
      tree: treeData,
    };
  } catch (error: any) {
    console.error("Error in unified batch sync:", error);
    throw error;
  }
}

/**
 * Batch upload/update files using GitHub Tree API (much faster than individual uploads)
 * Creates a single commit with all file changes
 */
export async function batchUpdateFiles(
  files: Array<{ path: string; content: string }>,
  message: string,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ commit: any; tree: any }> {
  return unifiedBatchSync(files, [], message, req, res);
}
