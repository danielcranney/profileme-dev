/**
 * GitHub User API
 *
 * Fetches user stats and contribution calendar for the Links page.
 */

export interface GitHubUserStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
}

/**
 * Fetch basic user stats from GitHub API (public repos, followers).
 * Optionally sums stars from top repos (first page, sorted by stars).
 */
export async function getGitHubUserStats(
  token: string,
  username: string
): Promise<GitHubUserStats | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=stars&order=desc&per_page=100&type=owner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      ),
    ]);
    if (!userRes.ok) return null;
    const user = (await userRes.json()) as {
      public_repos?: number;
      followers?: number;
    };
    let totalStars = 0;
    if (reposRes.ok) {
      const repos = (await reposRes.json()) as { stargazers_count?: number }[];
      totalStars = repos
        .filter((r) => typeof r.stargazers_count === "number")
        .reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
    }
    return {
      publicRepos: typeof user.public_repos === "number" ? user.public_repos : 0,
      followers: typeof user.followers === "number" ? user.followers : 0,
      totalStars,
    };
  } catch {
    return null;
  }
}

/** Contribution calendar day (date + count) from GitHub GraphQL */
export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/**
 * Fetch contribution calendar via GraphQL (last 365 days) for custom block-style graph.
 */
export async function getContributionCalendar(
  token: string,
  username: string
): Promise<ContributionCalendar | null> {
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);
  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;
  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: ContributionCalendar;
          };
        };
      };
      errors?: { message: string }[];
    };
    if (json.errors?.length) return null;
    const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
    return cal ?? null;
  } catch {
    return null;
  }
}
