/**
 * GitHub Pages Configuration API (Sponsors Only)
 * 
 * Manages GitHub Pages settings:
 * - Enable/disable GitHub Pages
 * - Set custom domain
 * - Get Pages URL
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { checkSponsorStatus } from "../../../lib/github/sponsor";
import { requireToken } from "../../../lib/github/token";
import { getUsername, checkProfileRepo } from "../../../lib/github/repo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check sponsor status
    const isSponsor = await checkSponsorStatus(req, res);
    if (!isSponsor) {
      return res.status(403).json({ 
        error: "Sponsor access required. Please sponsor the project to use GitHub Pages features.",
      });
    }

    // Require GitHub token
    const token = await requireToken(req, res);

    // Check if profile repo exists
    const repoExists = await checkProfileRepo(req, res);
    if (!repoExists) {
      return res.status(404).json({
        error: "Profile repository not found. Please create a repository with the same name as your GitHub username.",
      });
    }

    const username = await getUsername(req, res);

    // GET: Get current Pages configuration
    if (req.method === "GET") {
      const pagesResponse = await fetch(
        `https://api.github.com/repos/${username}/${username}/pages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (pagesResponse.status === 404) {
        // Pages not enabled
        return res.status(200).json({
          enabled: false,
          url: null,
          customDomain: null,
          htmlUrl: `https://${username}.github.io/${username}/`,
        });
      }

      if (!pagesResponse.ok) {
        // If it's not 404, log the error but still return a config
        console.error(`GitHub Pages API error: ${pagesResponse.status}`);
        const errorText = await pagesResponse.text();
        console.error("Error response:", errorText);
        
        // Return a default config instead of throwing
        return res.status(200).json({
          enabled: false,
          url: null,
          customDomain: null,
          htmlUrl: `https://${username}.github.io/${username}/`,
          error: `GitHub API error: ${pagesResponse.status}`,
        });
      }

      const pagesData = await pagesResponse.json();
      
      // Pages is enabled if status is "built" or if html_url exists
      const isEnabled = pagesData.status === "built" || 
                       pagesData.status === "building" || 
                       !!pagesData.html_url;
      
      return res.status(200).json({
        enabled: isEnabled,
        url: pagesData.html_url || `https://${username}.github.io/${username}/`,
        customDomain: pagesData.cname || null,
        htmlUrl: pagesData.html_url || `https://${username}.github.io/${username}/`,
        status: pagesData.status,
      });
    }

    // POST/PUT: Configure Pages
    if (req.method === "POST" || req.method === "PUT") {
      const { customDomain, source } = req.body;

      // Get repository info first to check if it exists and get default branch
      let defaultBranch = "main";
      let repoExists = false;
      let isPrivate = false;
      try {
        const repoResponse = await fetch(
          `https://api.github.com/repos/${username}/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        
        if (repoResponse.ok) {
          repoExists = true;
          const repoData = await repoResponse.json();
          defaultBranch = repoData.default_branch || "main";
          isPrivate = repoData.private === true;
        } else if (repoResponse.status === 404) {
          return res.status(404).json({
            error: "Repository not found. Please create a repository with the same name as your GitHub username first.",
          });
        }
      } catch (e) {
        console.error("Error fetching repository:", e);
        return res.status(500).json({
          error: "Failed to check repository status. Please try again.",
        });
      }

      if (!repoExists) {
        return res.status(404).json({
          error: "Repository not found. Please create a repository with the same name as your GitHub username.",
        });
      }

      // Check if repository is private - Pages for private repos requires GitHub Pro/Team
      if (isPrivate) {
        return res.status(403).json({
          error: "GitHub Pages for private repositories requires a GitHub Pro, Team, or Enterprise account. Please make your repository public, or upgrade your GitHub account.",
        });
      }

      // Check if repository has any commits (Pages requires at least one commit)
      let hasCommits = false;
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${username}/commits?per_page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (commitsResponse.ok) {
          const commitsData = await commitsResponse.json();
          hasCommits = Array.isArray(commitsData) && commitsData.length > 0;
        } else if (commitsResponse.status === 409) {
          // 409 means repository is empty
          hasCommits = false;
        }
      } catch (e) {
        console.error("Error checking commits:", e);
      }

      if (!hasCommits) {
        return res.status(400).json({
          error: "Repository is empty. Please sync your profile first (click 'Sync to GitHub') to create initial commits, then enable Pages.",
        });
      }

      // Enable Pages with default source (main branch, /root)
      const pagesConfig: any = {
        source: {
          branch: defaultBranch,
          path: "/",
        },
      };

      // Set custom domain if provided
      if (customDomain && customDomain.trim()) {
        pagesConfig.cname = customDomain.trim();
      }

      // Try to enable Pages
      const pagesResponse = await fetch(
        `https://api.github.com/repos/${username}/${username}/pages`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pagesConfig),
        }
      );

      const responseText = await pagesResponse.text();
      let responseData: any = null;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        // Response is not JSON
      }

      if (!pagesResponse.ok) {
        let errorMessage = `Failed to configure GitHub Pages: ${pagesResponse.status}`;
        
        if (responseData) {
          errorMessage = responseData.message || errorMessage;
          
          // GitHub API sometimes returns detailed errors
          if (responseData.errors && Array.isArray(responseData.errors)) {
            const errorDetails = responseData.errors.map((e: any) => e.message).join(", ");
            if (errorDetails) {
              errorMessage = errorDetails;
            }
          }
        } else if (responseText) {
          errorMessage = responseText;
        }
        
        // Log full response for debugging
        console.error("GitHub Pages API error details:", {
          status: pagesResponse.status,
          statusText: pagesResponse.statusText,
          responseText,
          responseData,
          config: pagesConfig,
        });
        
        // Handle specific error cases
        if (pagesResponse.status === 404) {
          // 404 from Pages API typically means Pages is not yet enabled
          // The GitHub Pages API PUT endpoint requires Pages to be enabled first
          // We need to guide the user to enable it manually, or try a workaround
          console.error("Pages API 404 error:", {
            username,
            defaultBranch,
            isPrivate,
            errorMessage,
            responseData,
          });
          
          // Try to provide helpful instructions
          const pagesUrl = `https://github.com/${username}/${username}/settings/pages`;
          
          return res.status(404).json({
            error: "GitHub Pages is not yet enabled for this repository. The Pages API requires Pages to be enabled first through the GitHub UI.",
            details: `Repository: ${username}/${username}, Branch: ${defaultBranch}`,
            action: "enable_manually",
            instructions: [
              `1. Go to: ${pagesUrl}`,
              "2. Under 'Source', select your branch (usually 'main')",
              "3. Select '/ (root)' as the folder",
              "4. Click 'Save'",
              "5. Wait a minute for Pages to build, then refresh this page",
            ],
            pagesUrl,
          });
        }
        
        if (pagesResponse.status === 422) {
          return res.status(422).json({
            error: errorMessage || `Invalid Pages configuration. The branch '${defaultBranch}' might not exist or the repository structure is invalid.`,
          });
        }
        
        throw new Error(errorMessage);
      }

      let pagesData;
      try {
        pagesData = await pagesResponse.json();
      } catch (e) {
        // If response is empty, that's okay - Pages might be enabled
        pagesData = {};
      }

      return res.status(200).json({
        success: true,
        enabled: true,
        url: pagesData.html_url || `https://${username}.github.io/${username}/`,
        customDomain: customDomain || null,
        htmlUrl: pagesData.html_url || `https://${username}.github.io/${username}/`,
        message: customDomain 
          ? `GitHub Pages enabled with custom domain: ${customDomain}`
          : "GitHub Pages enabled successfully",
      });
    }
  } catch (error: any) {
    console.error("GitHub Pages error:", error);

    return res.status(500).json({
      error: error.message || "Failed to configure GitHub Pages",
    });
  }
}
