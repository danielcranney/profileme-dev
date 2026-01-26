/**
 * Portfolio API Route (Sponsors Only)
 * 
 * Generates and returns portfolio HTML from profile JSON.
 * Can also sync to GitHub if requested.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { checkSponsorStatus } from "../../../lib/github/sponsor";
import { requireToken } from "../../../lib/github/token";
import { checkProfileRepo } from "../../../lib/github/repo";
import { profileJsonSchema } from "../../../lib/profile/schema";
import { renderPortfolio } from "../../../lib/profile/portfolio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check sponsor status
    const isSponsor = await checkSponsorStatus(req, res);
    if (!isSponsor) {
      return res.status(403).json({ 
        error: "Sponsor access required. Please sponsor the project to use portfolio features.",
      });
    }

    // For POST, require GitHub token and sync to repo
    if (req.method === "POST") {
      await requireToken(req, res);

      // Check if profile repo exists
      const repoExists = await checkProfileRepo(req, res);
      if (!repoExists) {
        return res.status(404).json({
          error: "Profile repository not found. Please create a repository with the same name as your GitHub username.",
        });
      }

      // Validate incoming JSON
      let profileJson = profileJsonSchema.parse(req.body);
      
      // Ensure animatedHand has a default value if missing
      if (profileJson.profile.introduction.animatedHand === undefined || profileJson.profile.introduction.animatedHand === null) {
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

      // Generate portfolio HTML
      const portfolioHtml = renderPortfolio(profileJson as any);

      // TODO: Sync portfolio.html to GitHub
      // For now, just return the HTML
      return res.status(200).json({
        success: true,
        html: portfolioHtml,
        message: "Portfolio generated successfully",
      });
    }

    // For GET, expect profile JSON in request body
    let profileJson;
    
    if (req.method === "GET" && req.query.profileJson) {
      try {
        profileJson = JSON.parse(decodeURIComponent(req.query.profileJson as string));
      } catch (e) {
        return res.status(400).json({ error: "Invalid profile JSON in query" });
      }
    } else if (req.body && req.body.profile) {
      profileJson = req.body;
    } else {
      return res.status(400).json({
        error: "Profile JSON required in request body",
      });
    }

    if (!profileJson || !profileJson.profile) {
      return res.status(400).json({
        error: "Invalid profile JSON structure",
      });
    }

    // Validate and generate
    let validatedJson = profileJsonSchema.parse(profileJson);
    
    // Ensure animatedHand has a default value if missing
    if (validatedJson.profile.introduction.animatedHand === undefined || validatedJson.profile.introduction.animatedHand === null) {
      validatedJson = {
        ...validatedJson,
        profile: {
          ...validatedJson.profile,
          introduction: {
            ...validatedJson.profile.introduction,
            animatedHand: 0,
          },
        },
      };
    }
    
    const portfolioHtml = renderPortfolio(validatedJson as any);

    // Set content type to HTML
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(portfolioHtml);
  } catch (error: any) {
    console.error("Portfolio error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Invalid profile JSON",
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: error.message || "Failed to generate portfolio",
    });
  }
}
