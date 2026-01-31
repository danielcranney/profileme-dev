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
 * Uses viewer.sponsorshipsAsSponsor to list who the viewer sponsors and checks
 * if GITHUB_SPONSOR_ACCOUNT is in that list. This is the reliable method
 * (viewer.isSponsoredBy often returns false for real sponsors, e.g. one-time).
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

    // List who the viewer sponsors; check if our account is in the list
    const listQuery = `
      query {
        viewer {
          login
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

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v4+json",
      },
      body: JSON.stringify({ query: listQuery }),
    });

    if (!response.ok) {
      console.error(
        "[sponsor] GraphQL error:",
        response.status,
        response.statusText
      );
      return false;
    }

    const data = await response.json();

    if (data.errors) {
      console.error("[sponsor] GraphQL errors:", data.errors);
      return false;
    }

    const nodes = data.data?.viewer?.sponsorshipsAsSponsor?.nodes ?? [];
    const viewerLogin = data.data?.viewer?.login || "(unknown)";
    const accountLower = account.toLowerCase();
    const isSponsor = nodes.some(
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
        "| sponsorshipsAsSponsor list:",
        logins.length ? logins.join(", ") : "(none)",
        "| match:",
        isSponsor ? "yes" : "no"
      );
    }

    return isSponsor;
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
