/**
 * Enrich Links Page Preview API
 *
 * Fetches OG image for the links page URL and featured GitHub repos.
 * Used so the in-app Links page preview shows the card and Projects
 * section before the user has synced (data is merged client-side for preview only).
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "../../../lib/github/token";
import { getUsername } from "../../../lib/github/repo";
import { getFeaturedRepos } from "../../../lib/github/repos";
import {
  getGitHubUserStats,
  getContributionCalendar,
} from "../../../lib/github/user";
import { getOgImageUrl } from "../../../lib/og-image";
import {
  getCachedEnrichData,
  setCachedEnrichData,
} from "../../../lib/github/enrich-cache";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken(req, res);
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  let portfolioLink: string | undefined;
  if (req.method === "POST" && req.body && typeof req.body === "object") {
    portfolioLink = req.body.portfolioLink?.trim?.() || undefined;
  }
  if (req.method === "GET" && typeof req.query.portfolioLink === "string") {
    portfolioLink = req.query.portfolioLink.trim() || undefined;
  }

  try {
    const username = await getUsername(req, res);
    const cached = getCachedEnrichData(username);

    let githubUserStats: Awaited<ReturnType<typeof getGitHubUserStats>>;
    let contributionCalendar: Awaited<ReturnType<typeof getContributionCalendar>>;

    if (cached) {
      githubUserStats = cached.githubUserStats;
      contributionCalendar = cached.contributionCalendar;
    } else {
      const [stats, cal] = await Promise.all([
        getGitHubUserStats(token, username),
        getContributionCalendar(token, username),
      ]);
      githubUserStats = stats;
      contributionCalendar = cal;
      setCachedEnrichData(username, {
        githubUserStats: stats,
        contributionCalendar: cal,
      });
    }

    const [portfolioOgImage, featuredRepos] = await Promise.all([
      portfolioLink
        ? getOgImageUrl(portfolioLink).then((url) => url ?? null)
        : Promise.resolve(null),
      getFeaturedRepos(token, username, 6),
    ]);

    return res.status(200).json({
      portfolioOgImage,
      featuredRepos,
      githubUserStats: githubUserStats ?? null,
      contributionCalendar: contributionCalendar ?? null,
    });
  } catch (err: any) {
    console.error("Enrich links page error:", err);
    return res.status(500).json({
      error: err.message || "Failed to enrich links page preview",
    });
  }
}
