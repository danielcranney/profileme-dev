/**
 * Enrich cache – GitHub user stats and contribution calendar per user, once per day (UTC).
 * Used by enrich-links-page and sync so we don't hit GitHub repeatedly for the same data.
 */

import type { ContributionCalendar, GitHubUserStats } from "./user";

export interface CachedEnrichData {
  githubUserStats: GitHubUserStats | null;
  contributionCalendar: ContributionCalendar | null;
  fetchedAt: string; // YYYY-MM-DD UTC
}

const CACHE_KEY = "__github_enrich_cache";

function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCache(): Map<string, CachedEnrichData> {
  const g = globalThis as typeof globalThis & { [key: string]: Map<string, CachedEnrichData> };
  if (!g[CACHE_KEY]) g[CACHE_KEY] = new Map();
  return g[CACHE_KEY];
}

/**
 * Return cached githubUserStats and contributionCalendar for this user if we have
 * an entry for today (UTC). Otherwise null.
 */
export function getCachedEnrichData(username: string): Omit<CachedEnrichData, "fetchedAt"> | null {
  const map = getCache();
  const entry = map.get(username.toLowerCase());
  if (!entry || entry.fetchedAt !== getTodayUTC()) return null;
  return {
    githubUserStats: entry.githubUserStats,
    contributionCalendar: entry.contributionCalendar,
  };
}

/**
 * Store githubUserStats and contributionCalendar for this user with today's date (UTC).
 */
export function setCachedEnrichData(
  username: string,
  data: { githubUserStats: GitHubUserStats | null; contributionCalendar: ContributionCalendar | null }
): void {
  const map = getCache();
  map.set(username.toLowerCase(), {
    ...data,
    fetchedAt: getTodayUTC(),
  });
}
