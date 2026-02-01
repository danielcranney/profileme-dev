/**
 * Fetch Open Graph image URL from a page.
 * Used to show portfolio/site preview cards with OG images.
 */

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Fetch a URL and parse HTML for og:image meta tag.
 * Returns absolute image URL or null on failure/timeout.
 */
export async function getOgImageUrl(
  pageUrl: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<string | null> {
  if (!pageUrl?.trim()) return null;
  const url = pageUrl.startsWith("http") ? pageUrl : `https://${pageUrl.replace(/^\/\//, "")}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ProfileMe.dev/1.0; +https://profileme.dev)",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    clearTimeout(timeoutId);
    const ogImage = parseOgImageFromHtml(html, res.url || url);
    return ogImage;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Parse og:image content from HTML string.
 * Handles meta property="og:image" and meta name="og:image".
 */
function parseOgImageFromHtml(html: string, baseUrl: string): string | null {
  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /<meta\s+name=["']og:image["']\s+content=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) {
      const raw = match[1].trim();
      if (raw.startsWith("http")) return raw;
      try {
        return new URL(raw, baseUrl).href;
      } catch {
        return null;
      }
    }
  }
  return null;
}
