/**
 * Sponsor Entitlement Check
 * 
 * Checks if a user is a sponsor via GitHub Sponsors GraphQL API.
 * No DB tables - uses GitHub API directly.
 * 
 * GitHub Sponsors can target:
 * - A user account (e.g., "danielcranney")
 * - An organization (e.g., "profileme-dev")
 * 
 * Set GITHUB_SPONSOR_ACCOUNT to the account (user or org) that receives sponsorships.
 * The GraphQL query checks if the viewer sponsors this account.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "./token";

// The GitHub account (user or organization) that receives sponsorships
// This should be the account people actually sponsor, not necessarily the repo owner
const GITHUB_SPONSOR_ACCOUNT = process.env.GITHUB_SPONSOR_ACCOUNT || "";
const DEV_SPONSOR_OVERRIDE = process.env.DEV_SPONSOR_OVERRIDE === "true";

/**
 * Check if user is a sponsor via GitHub GraphQL API.
 * Uses viewer.isSponsoredBy first; falls back to sponsorshipForViewerAsSponsorable
 * so one-time and active sponsorships are both detected.
 */
export async function checkSponsorStatus(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  // Development override
  if (DEV_SPONSOR_OVERRIDE) {
    console.log("DEV_SPONSOR_OVERRIDE enabled - granting sponsor access");
    return true;
  }

  if (!GITHUB_SPONSOR_ACCOUNT) {
    console.warn("GITHUB_SPONSOR_ACCOUNT not configured");
    return false;
  }

  try {
    const token = await getToken(req, res);

    if (!token) {
      console.warn("[sponsor] No GitHub token in session");
      return false;
    }

    const account = GITHUB_SPONSOR_ACCOUNT.trim();

    // 1) viewer.isSponsoredBy – primary check (recurring/active)
    const viewerQuery = `
      query {
        viewer {
          login
          isSponsoredBy(accountLogin: "${account}")
        }
      }
    `;

    const viewerResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v4+json",
      },
      body: JSON.stringify({ query: viewerQuery }),
    });

    if (!viewerResponse.ok) {
      console.error(
        "[sponsor] GraphQL error:",
        viewerResponse.status,
        viewerResponse.statusText
      );
      return false;
    }

    const viewerData = await viewerResponse.json();

    if (viewerData.errors) {
      console.error("[sponsor] GraphQL errors (viewer):", viewerData.errors);
      return false;
    }

    const isSponsoredBy = viewerData.data?.viewer?.isSponsoredBy === true;
    const viewerLogin = viewerData.data?.viewer?.login || "(unknown)";

    if (isSponsoredBy) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[sponsor] Viewer",
          viewerLogin,
          "is sponsor (isSponsoredBy) for",
          account
        );
      }
      return true;
    }

    // 2) Fallback: list who the viewer sponsors (viewer.sponsorshipsAsSponsor)
    // and check if account is in the list – more reliable when isSponsoredBy /
    // sponsorshipForViewerAsSponsorable return false or null
    const listQuery = `
      query {
        viewer {
          sponsorshipsAsSponsor(first: 100) {
            nodes {
              sponsorable {
                ... on User { login }
                ... on Organization { login }
              }
            }
          }
        }
      }
    `;

    const listResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v4+json",
      },
      body: JSON.stringify({ query: listQuery }),
    });

    if (!listResponse.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[sponsor] sponsorshipsAsSponsor failed:",
          listResponse.status,
          listResponse.statusText
        );
      }
      return false;
    }

    const listData = await listResponse.json();

    if (listData.errors) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[sponsor] sponsorshipsAsSponsor GraphQL errors:",
          listData.errors
        );
      }
      return false;
    }

    const nodes =
      listData.data?.viewer?.sponsorshipsAsSponsor?.nodes ?? [];
    const accountLower = account.toLowerCase();
    const isInList = nodes.some(
      (n: { sponsorable?: { login?: string } }) =>
        n?.sponsorable?.login?.toLowerCase() === accountLower
    );

    if (process.env.NODE_ENV === "development") {
      const logins = nodes
        .map((n: { sponsorable?: { login?: string } }) => n?.sponsorable?.login)
        .filter(Boolean);
      console.log(
        "[sponsor] Viewer",
        viewerLogin,
        "for account",
        account,
        "| isSponsoredBy:",
        isSponsoredBy,
        "| sponsorshipsAsSponsor list:",
        logins.length ? logins.join(", ") : "(none)",
        "| match:",
        isInList ? "yes" : "no"
      );
    }

    return isInList;
  } catch (error) {
    console.error("[sponsor] Error checking sponsor status:", error);
    return false;
  }
}

/**
 * Check sponsor status for a specific GitHub username
 * (Alternative method if we have the username)
 */
export async function checkSponsorStatusByUsername(
  username: string,
  token: string
): Promise<boolean> {
  if (DEV_SPONSOR_OVERRIDE) {
    return true;
  }

  if (!GITHUB_SPONSOR_ACCOUNT) {
    return false;
  }

  try {
    const query = `
      query {
        user(login: "${username}") {
          isSponsoredBy(accountLogin: "${GITHUB_SPONSOR_ACCOUNT}")
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v4+json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    if (data.errors) {
      return false;
    }

    return data.data?.user?.isSponsoredBy || false;
  } catch (error) {
    console.error("Error checking sponsor status by username:", error);
    return false;
  }
}
