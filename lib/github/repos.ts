/**
 * GitHub Repos API
 *
 * Fetches user repos (e.g. for featured projects on portfolio).
 */

export interface FeaturedRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  /** OG/social image if we fetch it later */
  image_url?: string | null;
}

const DEFAULT_LIMIT = 6;

/**
 * Fetch user's public repos sorted by stars (most stars first).
 * Used to show "Featured projects" on the portfolio.
 */
export async function getFeaturedRepos(
  token: string,
  username: string,
  limit: number = DEFAULT_LIMIT
): Promise<FeaturedRepo[]> {
  const url = `https://api.github.com/users/${encodeURIComponent(
    username
  )}/repos?sort=stars&order=desc&per_page=${Math.min(limit, 30)}&type=owner`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as any[];
  return data
    .filter((repo) => !repo.private)
    .slice(0, limit)
    .map((repo) => ({
      name: repo.name ?? "",
      html_url: repo.html_url ?? "",
      description: repo.description ?? null,
      stargazers_count: typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
      language: repo.language ?? null,
    }));
}
