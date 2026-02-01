/**
 * Portfolio Templates
 *
 * Different portfolio template styles that can be selected.
 */

import type { ProfileJson } from "./types";

export type PortfolioTemplate = "minimal" | "modern" | "classic";

/**
 * Render portfolio using the specified template
 */
export function renderPortfolioWithTemplate(
  profileJson: ProfileJson,
  template: PortfolioTemplate = "minimal"
): string {
  switch (template) {
    case "minimal":
      return renderMinimalTemplate(profileJson);
    case "modern":
      return renderModernTemplate(profileJson);
    case "classic":
      return renderClassicTemplate(profileJson);
    default:
      return renderMinimalTemplate(profileJson);
  }
}

/**
 * Get Google Fonts URL for a font name
 */
function getGoogleFontsUrl(fontName: string): string {
  // Replace spaces with + for URL encoding
  const encodedFont = fontName.replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@400;600;700&display=swap`;
}

/**
 * Get accent color bar HTML (5px high)
 */
function getAccentBar(color: string = "#3b82f6"): string {
  return `<div style="height: 5px; background: ${escapeHtml(
    color
  )}; width: 100%; margin: 0;"></div>`;
}

/** Parse hex color to rgba string for hero gradient (e.g. #3b82f6 -> "59, 130, 246") */
function hexToRgb(hex: string): string {
  const h = (hex || "#3b82f6").replace(/^#/, "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  if (h.length === 6) {
    return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`;
  }
  return "59, 130, 246";
}

/** Contribution calendar shape from GitHub GraphQL (for custom block graph) */
interface ContributionCalendarLike {
  totalContributions?: number;
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
}

/** GitHub-style contribution level from count (0–4 for CSS classes) */
function contributionLevel(count: number): number {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  return 4;
}

/** Format date as short month + year (e.g. Jan 2024) */
function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/** Legend labels for contribution levels (0–4) */
const CONTRIBUTION_LEGEND_LABELS = [
  "Less",
  "1",
  "2–4",
  "5–9",
  "10+",
] as const;

/**
 * Render contribution calendar as a dark-theme block grid (7 rows × N weeks).
 * Includes timeline (date range) and legend (shade key). No external image/package.
 */
function renderContributionGraph(cal: ContributionCalendarLike): string {
  const weeks = cal.weeks ?? [];
  if (weeks.length === 0) return "";

  // Timeline: first and last date from calendar
  let firstDate = "";
  let lastDate = "";
  const firstWeekDays = weeks[0]?.contributionDays ?? [];
  const lastWeekDays = weeks[weeks.length - 1]?.contributionDays ?? [];
  if (firstWeekDays.length > 0) firstDate = firstWeekDays[0].date;
  if (lastWeekDays.length > 0) lastDate = lastWeekDays[lastWeekDays.length - 1].date;
  const timelineLabel =
    firstDate && lastDate
      ? `${formatMonthYear(firstDate)} – ${formatMonthYear(lastDate)}`
      : "Last year";

  // Build 7 (rows) × weeks.length (cols): grid[row][col] = contribution count
  const rows = 7;
  const cols = weeks.length;
  const grid: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(0)
  );
  for (let c = 0; c < weeks.length; c++) {
    const contributionDays = weeks[c].contributionDays ?? [];
    for (const day of contributionDays) {
      const dayOfWeek = new Date(day.date).getDay(); // 0 = Sun, 6 = Sat
      grid[dayOfWeek][c] = Math.max(0, day.contributionCount);
    }
  }

  const cells: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const count = grid[r][c];
      const level = contributionLevel(count);
      cells.push(
        `<div class="github-graph-cell github-graph-cell--${level}" title="${count} contributions" role="img" aria-label="${count} contributions"></div>`
      );
    }
  }

  const legendItems = CONTRIBUTION_LEGEND_LABELS.map(
    (label, i) =>
      `<span class="github-graph-legend-item"><span class="github-graph-legend-block github-graph-cell--${i}" aria-hidden="true"></span><span class="github-graph-legend-label">${escapeHtml(label)}</span></span>`
  ).join("");

  return `<div class="github-graph-inner">
    <p class="github-graph-timeline" aria-hidden="true">${escapeHtml(timelineLabel)}</p>
    <div class="github-graph-grid" style="grid-template-columns: repeat(${cols}, 1fr);" aria-label="GitHub contribution graph">${cells.join("")}</div>
    <div class="github-graph-legend" aria-label="Contribution scale">
      ${legendItems}
    </div>
  </div>`;
}

/**
 * Minimal Template (Links page: single card with hero + content)
 * Hero: gradient from accent color (no image), avatar, name, title, bio, contact, Cal button (if set), social icons.
 * Content: Skills (icons), Experience, link blocks, Connect, etc.
 */
function renderMinimalTemplate(profileJson: ProfileJson): string {
  const { profile, portfolio } = profileJson;
  const { introduction, skills, socials } = profile;
  const font = portfolio?.font || "Inter";
  const accentColor = portfolio?.accentColor || "#3b82f6";
  const accentRgb = hexToRgb(accentColor);
  const fontUrl = getGoogleFontsUrl(font);

  const displayName = introduction.name || "Portfolio";
  const title = introduction.shortDescription?.trim() || "";
  const bio = introduction.longDescription?.trim() || "";
  const email = introduction.emailMe?.trim() || "";
  const location = introduction.location?.trim() || "";
  const heroInitials = getInitialsForAvatar(displayName);
  const experience = portfolio?.options?.experience as
    | ExperienceEntry[]
    | undefined;
  const portfolioOgImage = portfolio?.options?.portfolioOgImage as
    | string
    | undefined;
  const githubUserStats = portfolio?.options?.githubUserStats as
    | { publicRepos: number; followers: number; totalStars: number }
    | undefined;
  const contributionCalendar = portfolio?.options?.contributionCalendar as
    | ContributionCalendarLike
    | undefined;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(displayName)} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      font-family: '${escapeHtml(
        font
      )}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: #b5b9d6;
      background: #181824;
      padding-top: 5px;
    }
    .accent-bar-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      z-index: 10;
    }
    .page-wrapper {
      min-height: 100%;
      padding: 1.5rem 1rem 3rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    .page-card {
      width: 100%;
      max-width: 680px;
      background: #1d1d2b;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .hero {
      position: relative;
      text-align: left;
    }
    .hero-gradient {
      height: 120px;
      background: linear-gradient(135deg, ${escapeHtml(
        accentColor
      )} 0%, rgba(${accentRgb}, 0.5) 35%, rgba(${accentRgb}, 0.12) 70%, transparent 100%);
    }
    .hero-body {
      padding: 0 2rem 2rem;
      margin-top: -48px;
      text-align: left;
    }
    .hero-avatar {
      width: 104px;
      height: 104px;
      margin: 0 0 1rem 0;
      border-radius: 50%;
      background: #29293b;
      color: #b5b9d6;
      font-size: 2.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 4px solid #1d1d2b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .hero-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-name {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.25rem;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .hero-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #b5b9d6;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }
    .hero-bio {
      font-size: 0.9375rem;
      font-weight: 400;
      color: #b5b9d6;
      line-height: 1.7;
      max-width: 480px;
      margin: 0 0 1.25rem 0;
    }
    .hero-contact {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 1rem 1.5rem;
      margin-bottom: 1.25rem;
    }
    .hero-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #b5b9d6;
    }
    .hero-contact-item svg {
      flex-shrink: 0;
      color: #53566b;
    }
    .hero-contact-item a {
      color: #b5b9d6;
      text-decoration: none;
    }
    .hero-contact-item a:hover { color: #b5b9d6; text-decoration: underline; }
    .hero-socials {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
    }
    .hero-socials-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .hero-social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #29293b;
      color: #b5b9d6;
      transition: background 0.2s, transform 0.15s;
    }
    .hero-social-icon:hover {
      background: #393950;
      transform: translateY(-2px);
    }
    .hero-social-icon img {
      width: 22px;
      height: 22px;
      object-fit: contain;
    }
    .hero-cal-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 1rem;
      margin-left: auto;
      background: ${escapeHtml(accentColor)};
      color: #0f172a;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 10px;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    .hero-cal-button:hover {
      opacity: 0.95;
      transform: translateY(-2px);
    }
    .card-content {
      padding: 0 2rem 2.5rem;
    }
    .main {
      padding: 0;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #393950;
    }
    .skills-category,
    .main .skill-category {
      margin-bottom: 2rem;
    }
    .skills-category-title,
    .main .skill-category h3 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #d1d5db;
      margin-bottom: 0.75rem;
    }
    .main .skill-items {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .main .skill-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .main .skill-icon {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    .main .skill-item picture,
    .main .skill-item .skill-icon {
      display: block;
    }
    .main .skill-item-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: #b5b9d6;
      min-width: 2rem;
      text-align: center;
    }
    .skills-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 0.75rem;
    }
    .skill-pill {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #b5b9d6;
      background: #29293b;
      border-radius: 9999px;
    }
    .experience-timeline {
      position: relative;
      padding-left: 1.5rem;
      border-left: 2px solid #393950;
      margin-left: 0.25rem;
    }
    .experience-entry {
      position: relative;
      margin-bottom: 2rem;
    }
    .experience-entry:last-child { margin-bottom: 0; }
    .experience-dot {
      position: absolute;
      left: -1.625rem;
      top: 0.25rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #b5b9d6;
    }
    .experience-content { padding-left: 0; }
    .experience-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .experience-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
    }
    .experience-dates {
      font-size: 0.875rem;
      color: #b5b9d6;
    }
    .experience-company {
      font-size: 0.9375rem;
      color: #b5b9d6;
      margin-bottom: 0.5rem;
    }
    .experience-description {
      font-size: 0.875rem;
      color: #b5b9d6;
      line-height: 1.6;
    }
    .main-section { margin-bottom: 2.5rem; }
    .main .section-description {
      font-size: 0.9375rem;
      color: #b5b9d6;
      line-height: 1.7;
    }
    .main .section-socials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .main .social-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #29293b;
      color: #b5b9d6;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .main .social-link:hover { background: #393950; }
    .link-blocks-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    .link-block-wrap {
      position: relative;
      display: block;
    }
    .link-block-wrap--with-pill .link-block {
      padding-right: 3.25rem;
    }
    .link-block-pill {
      position: absolute;
      top: 50%;
      right: 0.375rem;
      transform: translateY(-50%);
      padding: 0.125rem 0.375rem;
      font-size: 0.5625rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #9ca3af;
      background: #393950;
      border-radius: 9999px;
      pointer-events: none;
      z-index: 1;
    }
    .link-block {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: #29293b;
      border-radius: 0;
      border-left: 4px solid var(--block-color, ${escapeHtml(accentColor)});
      text-decoration: none;
      color: #b5b9d6;
      font-size: 0.9375rem;
      font-weight: 500;
      transition: background 0.2s, transform 0.15s;
    }
    .link-block:hover {
      background: #393950;
      transform: translateX(2px);
    }
    .link-block-icon {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--block-color, ${escapeHtml(accentColor)});
    }
    .link-block-icon svg {
      width: 24px;
      height: 24px;
    }
    .link-block-label {
      flex: 1;
      min-width: 0;
    }
    .portfolio-card {
      display: block;
      position: relative;
      height: 180px;
      border-radius: 12px;
      overflow: hidden;
      text-decoration: none;
      background: #29293b;
    }
    .portfolio-card-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
    }
    .portfolio-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(20,25,33,0.95) 0%, rgba(20,25,33,0.4) 100%);
    }
    .portfolio-card-content {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.25rem;
    }
    .portfolio-card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1rem;
    }
    .project-card {
      display: block;
      padding: 1.25rem;
      background: #29293b;
      border-radius: 12px;
      text-decoration: none;
      transition: background 0.2s;
    }
    .project-card:hover { background: #393950; }
    .project-card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .project-card-desc {
      font-size: 0.875rem;
      color: #b5b9d6;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }
    .project-card-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8125rem;
      color: #b5b9d6;
    }
    .project-card-stars,
    .project-card-lang { display: inline; }
    .github-graph-wrap {
      border-radius: 12px;
      overflow: hidden;
      background: #1d1d2b;
      padding: 12px;
      border: 1px solid #393950;
    }
    .github-graph-grid {
      display: grid;
      gap: 3px;
      grid-template-rows: repeat(7, 1fr);
      max-width: 100%;
      margin: 0 auto;
    }
    .github-graph-cell {
      aspect-ratio: 1;
      border-radius: 3px;
      min-width: 0;
    }
    .github-graph-cell--0 { background: #393950; }
    .github-graph-cell--1 { background: rgba(${accentRgb}, 0.35); }
    .github-graph-cell--2 { background: rgba(${accentRgb}, 0.55); }
    .github-graph-cell--3 { background: rgba(${accentRgb}, 0.8); }
    .github-graph-cell--4 { background: ${escapeHtml(accentColor)}; }
    .github-graph-inner { padding: 0; }
    .github-graph-total {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #b5b9d6;
      margin-bottom: 8px;
    }
    .github-graph-timeline {
      font-size: 0.75rem;
      color: #b5b9d6;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .github-graph-legend {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 16px;
      margin-top: 10px;
      font-size: 0.6875rem;
      color: #b5b9d6;
    }
    .github-graph-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .github-graph-legend-block {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .github-graph-legend-label { font-weight: 500; }
    footer {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #393950;
      font-size: 0.8125rem;
      color: #53566b;
    }
    footer a { color: #139ae1; text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .page-wrapper { padding: 1rem 0.75rem 2rem; }
      .page-card { border-radius: 16px; }
      .hero-gradient { height: 100px; }
      .hero-body { padding: 0 1.5rem 1.5rem; margin-top: -40px; }
      .hero-avatar { width: 88px; height: 88px; font-size: 1.875rem; border-width: 3px; }
      .hero-name { font-size: 1.5rem; }
      .card-content { padding: 0 1.5rem 2rem; }
    }
  </style>
</head>
<body>
  <div class="accent-bar-fixed" style="background: ${escapeHtml(
    accentColor
  )};"></div>
  <div class="page-wrapper">
    <div class="page-card">
      <header class="hero">
        <div class="hero-gradient" aria-hidden="true"></div>
        <div class="hero-body">
          <div class="hero-avatar" aria-hidden="true">${
            introduction.avatarUrl?.trim()
              ? `<img src="${escapeHtml(introduction.avatarUrl.trim())}" alt="">`
              : escapeHtml(heroInitials)
          }</div>
          <h1 class="hero-name">${escapeHtml(displayName)}</h1>
          ${title ? `<p class="hero-title">${escapeHtml(title)}</p>` : ""}
          ${bio ? `<div class="hero-bio">${formatDescription(bio)}</div>` : ""}
          ${
            email || location
              ? `<div class="hero-contact">
            ${
              email
                ? `<span class="hero-contact-item">${ICON_ENVELOPE}<a href="mailto:${escapeHtml(
                    email
                  )}">${escapeHtml(email)}</a></span>`
                : ""
            }
            ${
              location
                ? `<span class="hero-contact-item">${ICON_MAP_PIN}<span>${escapeHtml(
                    location
                  )}</span></span>`
                : ""
            }
          </div>`
              : ""
          }
          ${
            getCalUrl(socials) || Object.keys(socials).length > 0
              ? `<div class="hero-socials"><div class="hero-socials-icons">${renderSocialsIconsOnly(
                  socials,
                  profile.socialOrder,
                  true,
                  ["polywork", ...(getCalUrl(socials) ? ["cal"] : [])]
                )}</div>${
                  getCalUrl(socials)
                    ? `<a href="${escapeHtml(
                        getCalUrl(socials)!
                      )}" class="hero-cal-button" target="_blank" rel="noopener noreferrer">Book a call</a>`
                    : ""
                }</div>`
              : ""
          }
        </div>
      </header>
      <div class="card-content">
    <main class="main">
      ${
        Object.keys(skills).length > 0
          ? `
      <section class="main-section" id="skills">
        <h2 class="section-title">Skills</h2>
        <div class="skill-items">${renderSkillsSection(
          skills,
          profile.skillsOrder,
          "modern"
        )}</div>
      </section>
      `
          : ""
      }
      ${
        contributionCalendar
          ? `
      <section class="main-section" id="github">
        <h2 class="section-title">GitHub</h2>
        <div class="github-graph-wrap">
          ${
            typeof contributionCalendar.totalContributions === "number"
              ? `<p class="github-graph-total">${escapeHtml(
                  contributionCalendar.totalContributions.toLocaleString()
                )} contributions in the last 12 months</p>`
              : ""
          }
          ${renderContributionGraph(contributionCalendar)}
        </div>
      </section>
      `
          : ""
      }
      ${
        renderExperienceTimeline(experience)
          ? `
      <section class="main-section" id="experience">
        <h2 class="section-title">Experience</h2>
        ${renderExperienceTimeline(experience)}
      </section>
      `
          : ""
      }
      ${
        (() => {
          const blocks = getFeaturedLinkBlocks(
            introduction,
            socials,
            profile.socialOrder
          );
          if (blocks.length === 0) return "";
          return `
      <section class="main-section" id="links">
        <h2 class="section-title">Links</h2>
        <div class="link-blocks-grid">
          ${blocks
            .map(({ url, label, source }) => {
              const showPill = LINK_SOURCES_WITH_PILL.has(source);
              const pill = showPill
                ? `<span class="link-block-pill">${escapeHtml(source)}</span>`
                : "";
              const wrapClass = showPill
                ? "link-block-wrap link-block-wrap--with-pill"
                : "link-block-wrap";
              return `<div class="${wrapClass}">${pill}${renderLinkBlock(url, label, accentColor)}</div>`;
            })
            .join("")}
        </div>
      </section>
      `;
        })()
      }
      ${
        introduction.additionalInfo
          ? `
      <section class="main-section" id="additional">
        <h2 class="section-title">Additional Information</h2>
        <div class="section-description">${formatDescription(
          introduction.additionalInfo
        )}</div>
      </section>
      `
          : ""
      }
      <footer>
        <p>Generated by <a href="https://profileme.dev" target="_blank" rel="noopener noreferrer">ProfileMe.dev</a></p>
      </footer>
    </main>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Modern Template (Light, colorful, modern)
 */
function renderModernTemplate(profileJson: ProfileJson): string {
  const { profile, portfolio } = profileJson;
  const { introduction, skills, socials } = profile;
  const font = portfolio?.font || "Inter";
  const accentColor = portfolio?.accentColor || "#3b82f6";
  const fontUrl = getGoogleFontsUrl(font);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(introduction.name || "Portfolio")} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: '${escapeHtml(
        font
      )}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #1f2937;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    header {
      text-align: center;
      padding: 4rem 0;
      color: white;
    }
    h1 { font-size: 3.5rem; margin-bottom: 0.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
    .subtitle { font-size: 1.5rem; margin-bottom: 1rem; opacity: 0.9; }
    .content {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      margin-top: -2rem;
    }
    section { margin-bottom: 3rem; }
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: ${escapeHtml(accentColor)};
      border-left: 4px solid ${escapeHtml(accentColor)};
      padding-left: 1rem;
    }
    .skill-item {
      background: white;
      padding: 0.5rem;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .skill-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .skill-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
    .skill-item-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .social-link {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      text-decoration: none;
      display: inline-block;
      margin: 0.5rem;
      transition: transform 0.2s;
    }
    .social-link:hover { transform: translateY(-2px); }
    footer {
      text-align: center;
      padding: 2rem 0;
      color: white;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  ${getAccentBar(accentColor)}
  <div class="container">
    <header>
      <h1>${escapeHtml(introduction.name || "Portfolio")}</h1>
      ${
        introduction.shortDescription
          ? `<p class="subtitle">${escapeHtml(
              introduction.shortDescription
            )}</p>`
          : ""
      }
    </header>
    <div class="content">
      ${
        introduction.longDescription
          ? `
      <section id="about">
        <h2>About</h2>
        <p>${formatDescription(introduction.longDescription)}</p>
      </section>
      `
          : ""
      }
      ${
        Object.keys(skills).length > 0
          ? `
      <section id="skills">
        <h2>Skills</h2>
        <div>
          ${renderSkillsSection(skills, profile.skillsOrder, "modern")}
        </div>
      </section>
      `
          : ""
      }
      ${
        Object.keys(socials).length > 0
          ? `
      <section id="socials">
        <h2>Connect</h2>
        <div>
          ${renderSocialsSection(socials, profile.socialOrder, "modern")}
        </div>
      </section>
      `
          : ""
      }
    </div>
    <footer>
      <p>Generated by <a href="https://profileme.dev" target="_blank" rel="noopener noreferrer" style="color: white;">ProfileMe.dev</a></p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Classic Template (Traditional, professional)
 */
function renderClassicTemplate(profileJson: ProfileJson): string {
  const { profile, portfolio } = profileJson;
  const { introduction, skills, socials } = profile;
  const font = portfolio?.font || "Inter";
  const accentColor = portfolio?.accentColor || "#3b82f6";
  const fontUrl = getGoogleFontsUrl(font);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(introduction.name || "Portfolio")} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontUrl}" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: '${escapeHtml(font)}', 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      color: #2c3e50;
      background: #f8f9fa;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    header {
      background: white;
      padding: 3rem;
      border-bottom: 3px solid ${escapeHtml(accentColor)};
      margin-bottom: 2rem;
      text-align: center;
    }
    h1 { font-size: 2.5rem; color: #2c3e50; margin-bottom: 0.5rem; }
    .subtitle { font-size: 1.2rem; color: #7f8c8d; font-style: italic; }
    section {
      background: white;
      padding: 2rem;
      margin-bottom: 2rem;
      border-left: 4px solid #2c3e50;
    }
    h2 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin-bottom: 1rem;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 0.5rem;
    }
    .skill-item {
      background: #ecf0f1;
      padding: 0.5rem;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0.25rem;
      transition: transform 0.2s, background 0.2s;
    }
    .skill-item:hover {
      transform: scale(1.05);
      background: #d5dbdb;
    }
    .skill-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
    }
    .skill-item-text {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      color: #2c3e50;
    }
    .social-link {
      color: #3498db;
      text-decoration: none;
      margin-right: 1.5rem;
      border-bottom: 1px solid #3498db;
    }
    .social-link:hover { border-bottom-width: 2px; }
  </style>
</head>
<body>
  ${getAccentBar(accentColor)}
  <div class="container">
    <header>
      <h1>${escapeHtml(introduction.name || "Portfolio")}</h1>
      ${
        introduction.shortDescription
          ? `<p class="subtitle">${escapeHtml(
              introduction.shortDescription
            )}</p>`
          : ""
      }
    </header>
    ${
      introduction.longDescription
        ? `
    <section id="about">
      <h2>About</h2>
      <p>${formatDescription(introduction.longDescription)}</p>
    </section>
    `
        : ""
    }
    ${
      Object.keys(skills).length > 0
        ? `
    <section id="skills">
      <h2>Skills</h2>
      <div>
        ${renderSkillsSection(skills, profile.skillsOrder, "classic")}
      </div>
    </section>
    `
        : ""
    }
    ${
      Object.keys(socials).length > 0
        ? `
    <section id="socials">
      <h2>Connect</h2>
      <div>
        ${renderSocialsSection(socials, profile.socialOrder, "classic")}
      </div>
    </section>
    `
        : ""
    }
  </div>
</body>
</html>`;
}

// Inline SVG icons for sidebar (email, location) – dark theme friendly
const ICON_ENVELOPE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
const ICON_MAP_PIN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

// Link platform detection for Links page blocks (YouTube, Twitch, etc.)
interface LinkPlatform {
  id: string;
  name: string;
  color: string;
  iconSvg: string;
}
const LINK_PLATFORMS: { pattern: RegExp; platform: LinkPlatform }[] = [
  {
    pattern: /(?:youtube\.com|youtu\.be)/i,
    platform: {
      id: "youtube",
      name: "YouTube",
      color: "#FF0000",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    },
  },
  {
    pattern: /twitch\.tv/i,
    platform: {
      id: "twitch",
      name: "Twitch",
      color: "#9146FF",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.571 4.714h1.715v5.143H11.57V4.714zM18 0H2L0 4.714v12.858h4.286V24l3.429-3.429h2.571L24 12.858V0zm-2.571 11.143l-3.429 3.428h-2.571l-2.5 2.5V14.57H4.286V2.571H15.43v8.572z"/></svg>',
    },
  },
  {
    pattern: /(?:twitter\.com|x\.com)/i,
    platform: {
      id: "twitter",
      name: "X",
      color: "#ffffff",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    },
  },
  {
    pattern: /threads\.net/i,
    platform: {
      id: "threads",
      name: "Threads",
      color: "#ffffff",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><g transform="scale(0.125)"><path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/></g></svg>',
    },
  },
  {
    pattern: /hashnode\.(dev|com)/i,
    platform: {
      id: "hashnode",
      name: "Hashnode",
      color: "#2962FF",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z"/></svg>',
    },
  },
  {
    pattern: /linkedin\.com/i,
    platform: {
      id: "linkedin",
      name: "LinkedIn",
      color: "#0A66C2",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    },
  },
  {
    pattern: /github\.com/i,
    platform: {
      id: "github",
      name: "GitHub",
      color: "#e5e7eb",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    },
  },
  {
    pattern: /(?:discord\.gg|discord\.com)/i,
    platform: {
      id: "discord",
      name: "Discord",
      color: "#5865F2",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
    },
  },
  {
    pattern: /dev\.to/i,
    platform: {
      id: "devto",
      name: "Dev.to",
      color: "#0e0e0e",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.29 2.64.01 2.12-.02 2.38-.24 2.94zM17.31 12.5c.44-.58.44-1.16.44-2.64V8.53h1.33c1.67 0 2.16.18 2.6.9.27.43.29.6.29 2.64-.01 2.12.02 2.38.24 2.94.44.58 1.06.77 2.53.77h1.32v-7.54h-1.32c-1.67 0-2.16-.18-2.6-.9-.27-.43-.29-.6-.29-2.64.01-2.12-.02-2.38-.24-2.94z"/></svg>',
    },
  },
  {
    pattern: /codepen\.io/i,
    platform: {
      id: "codepen",
      name: "CodePen",
      color: "#000000",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0L2 7.5v9L12 24l10-7.5v-9L12 0zm0 20.27l-7.5-5.63V9.23L12 14.9v5.37zm0-6.74l-5.5-4.12L12 3.73l5.5 4.12L12 13.53zm7.5-4.63L12 3.73v5.37l7.5-5.63v4.63z"/></svg>',
    },
  },
  {
    pattern: /stackoverflow\.com/i,
    platform: {
      id: "stackoverflow",
      name: "Stack Overflow",
      color: "#F48024",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.21 17.16v-4.27h2.14v6.38h-8.55v-6.38h2.13v4.27h4.28zM6.76 15.85l.57-2.14 7.14 1.87-.57 2.14-7.14-1.87zm1.14-4.28l1.14-2 6.43 3.71-1.14 2-6.43-3.71zm2.28-4.07l1.57-1.57 5.43 5.43-1.57 1.57-5.43-5.43zm4.57-4.29v2.14h8.55V2.29h-8.55v2.14h6.42v1.71h-6.42z"/></svg>',
    },
  },
  {
    pattern: /(?:reddit\.com|old\.reddit\.com)/i,
    platform: {
      id: "reddit",
      name: "Reddit",
      color: "#FF4500",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.182.18.427.284.692.284.265 0 .51-.104.692-.284a.361.361 0 0 0 .029-.463.334.334 0 0 0-.464-.03c-.01.01-.018.02-.027.03zm4.708 0c-.01-.01-.02-.02-.03-.03a.334.334 0 0 0-.464.03.361.361 0 0 0 .029.463c.182.18.427.284.692.284.265 0 .51-.104.692-.284a.33.33 0 0 0 0-.463.327.327 0 0 0-.231-.094z"/></svg>',
    },
  },
  {
    pattern: /instagram\.com/i,
    platform: {
      id: "instagram",
      name: "Instagram",
      color: "#E4405F",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    },
  },
  {
    pattern: /tiktok\.com/i,
    platform: {
      id: "tiktok",
      name: "TikTok",
      color: "#000000",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77 0c0-1.6 1.3-2.9 2.9-2.9s2.9 1.3 2.9 2.9v6.93c0 .28.23.5.5.5h3.17a.5.5 0 0 0 .5-.5V9.4a6.5 6.5 0 0 0 3.42 1.04V6.69h-.27z"/></svg>',
    },
  },
  {
    pattern: /medium\.com/i,
    platform: {
      id: "medium",
      name: "Medium",
      color: "#000000",
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.77A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.77A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>',
    },
  },
];

const LINK_PLATFORM_GENERIC: LinkPlatform = {
  id: "generic",
  name: "Link",
  color: "#6b7280",
  iconSvg:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
};

function getLinkPlatform(url: string): LinkPlatform {
  if (!url || typeof url !== "string") return LINK_PLATFORM_GENERIC;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const found = LINK_PLATFORMS.find(({ pattern }) => pattern.test(host));
    return found ? found.platform : LINK_PLATFORM_GENERIC;
  } catch {
    return LINK_PLATFORM_GENERIC;
  }
}

/** Render a single platform-styled link block (for Links page minimal template) */
function renderLinkBlock(
  url: string,
  label: string,
  accentColor: string,
  options?: { displayLabel?: string }
): string {
  const platform = getLinkPlatform(url);
  const borderColor = platform.color;
  const displayLabel =
    options?.displayLabel ?? (platform.id === "twitter" ? "X" : label);
  return `<a href="${escapeHtml(
    url
  )}" class="link-block link-block--${escapeHtml(
    platform.id
  )}" style="--block-color: ${escapeHtml(
    borderColor
  )};" target="_blank" rel="noopener noreferrer"><span class="link-block-icon" aria-hidden="true">${platform.iconSvg}</span><span class="link-block-label">${escapeHtml(
    displayLabel
  )}</span></a>`;
}

/** Build URL from a social profile entry */
function getSocialUrl(social: ProfileJson["profile"]["socials"][string]): string {
  if (!social || typeof social === "string") return "";
  const url = `${social.linkPrefix}${social.linkSuffix}${
    social.linkSuffixTwo || ""
  }`.trim();
  return url && url !== social.linkPrefix ? url : "";
}

/** Sources that get a pill label in the top-right of the link block (on published page too) */
const LINK_SOURCES_WITH_PILL = new Set(["Currently working on", "Portfolio"]);

/** Human-readable source name for a social key */
const SOCIAL_SOURCE_LABELS: Record<string, string> = {
  github: "GitHub profile",
  youtube: "YouTube channel",
  twitter: "X",
  threads: "Threads",
  linkedin: "LinkedIn",
  hashnode: "Hashnode",
  instagram: "Instagram",
  twitch: "Twitch",
  discord: "Discord",
  devto: "Dev.to",
  codepen: "CodePen",
  stackoverflow: "Stack Overflow",
  reddit: "Reddit",
  tiktok: "TikTok",
  medium: "Medium",
};

/**
 * Collect featured link blocks for the Links section: working on, portfolio,
 * GitHub profile, YouTube channel, then other socials. Each gets platform styling (e.g. YouTube = red).
 * Returns { url, label, source } so preview can show which field each block came from.
 */
function getFeaturedLinkBlocks(
  introduction: ProfileJson["profile"]["introduction"],
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[]
): { url: string; label: string; source: string }[] {
  const out: { url: string; label: string; source: string }[] = [];
  const seen = new Set<string>();

  if (introduction.workingOnLink?.trim() && introduction.workingOnTitle?.trim()) {
    out.push({
      url: introduction.workingOnLink.trim(),
      label: introduction.workingOnTitle.trim(),
      source: "Currently working on",
    });
  }
  if (introduction.portfolioLink?.trim() && introduction.portfolioTitle?.trim()) {
    out.push({
      url: introduction.portfolioLink.trim(),
      label: introduction.portfolioTitle.trim(),
      source: "Portfolio",
    });
  }
  const github = socials?.github;
  if (github && typeof github !== "string") {
    const url = getSocialUrl(github);
    if (url) {
      out.push({
        url,
        label: github.label?.trim() || "GitHub Profile",
        source: "GitHub profile",
      });
      seen.add("github");
    }
  }
  const youtube = socials?.youtube;
  if (youtube && typeof youtube !== "string") {
    const url = getSocialUrl(youtube);
    if (url) {
      out.push({
        url,
        label: youtube.label?.trim() || "YouTube Channel",
        source: "YouTube channel",
      });
      seen.add("youtube");
    }
  }
  const excludeFromRest = new Set(["cal", "polywork", ...Array.from(seen)]);
  const ordered = (
    socialOrder?.length > 0
      ? socialOrder.filter((key) => socials[key])
      : Object.keys(socials || {})
  ).filter((key) => !excludeFromRest.has(key));
  for (const key of ordered) {
    const social = socials[key];
    if (typeof social === "string") continue;
    const url = getSocialUrl(social);
    if (!url) continue;
    const platform = getLinkPlatform(url);
    const sourceLabel =
      SOCIAL_SOURCE_LABELS[key] ?? platform.name ?? key;
    out.push({
      url,
      label: social.label?.trim() || key,
      source: sourceLabel,
    });
  }
  return out;
}

/** Render Connect socials as platform-styled link blocks (minimal template) */
function renderSocialsAsLinkBlocks(
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[],
  accentColor: string,
  excludeKeys: string[] = ["polywork"]
): string {
  const ordered = (
    socialOrder.length > 0
      ? socialOrder.filter((key) => socials[key])
      : Object.keys(socials)
  ).filter((key) => !excludeKeys.includes(key));
  return ordered
    .map((key) => {
      const social = socials[key];
      if (typeof social === "string") return "";
      const url = getSocialUrl(social);
      if (!url) return "";
      return renderLinkBlock(url, social.label, accentColor);
    })
    .join("");
}

// Base URL for social icons (same approach as skills – guaranteed to load in static HTML / GitHub Pages)
const SOCIAL_ICONS_BASE =
  "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials";

// Platforms that only have a single icon file (no -dark.svg) in the CDN
const SOCIAL_ICON_LIGHT_ONLY = new Set(["gitlab", "cal"]);

/** Get Cal.com booking URL from socials if present and valid */
function getCalUrl(socials: ProfileJson["profile"]["socials"]): string | null {
  const cal = socials?.cal;
  if (!cal || typeof cal === "string") return null;
  const url = `${cal.linkPrefix}${cal.linkSuffix || ""}${cal.linkSuffixTwo || ""}`.trim();
  if (!url || url === cal.linkPrefix) return null;
  return url;
}

/** Resolve social icon src: use path/darkPath if absolute URL, else fallback to raw GitHub (like skills) */
function getSocialIconSrc(
  key: string,
  social: { path?: string; darkPath?: string },
  darkTheme: boolean
): string {
  const preferred = darkTheme
    ? social.darkPath || social.path
    : social.path || social.darkPath;
  if (preferred && preferred.startsWith("http")) return preferred;
  // Force show via CDN so icons load in preview iframe and on GitHub Pages
  const filename =
    darkTheme && !SOCIAL_ICON_LIGHT_ONLY.has(key)
      ? `${key}-dark.svg`
      : `${key}.svg`;
  return `${SOCIAL_ICONS_BASE}/${filename}`;
}

// Social links as icon-only (hero/sidebar); uses darkPath when available, fallback to CDN like skills
function renderSocialsIconsOnly(
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[],
  darkTheme: boolean = true,
  excludeKeys: string[] = []
): string {
  const ordered = (
    socialOrder.length > 0
      ? socialOrder.filter((key) => socials[key])
      : Object.keys(socials)
  ).filter((key) => !excludeKeys.includes(key));
  return ordered
    .map((key) => {
      const social = socials[key];
      if (typeof social === "string") return "";
      const url = `${social.linkPrefix}${social.linkSuffix}${
        social.linkSuffixTwo || ""
      }`.trim();
      if (!url || url === social.linkPrefix) return "";
      const iconPath = getSocialIconSrc(key, social, darkTheme);
      return `<a href="${escapeHtml(
        url
      )}" class="sidebar-social-icon" target="_blank" rel="noopener noreferrer" title="${escapeHtml(
        social.label
      )}" aria-label="${escapeHtml(social.label)}"><img src="${escapeHtml(
        iconPath
      )}" alt="" width="24" height="24" loading="lazy"></a>`;
    })
    .join("");
}

// Skills as categorized pills (category name + skill tags)
function renderSkillsPillsByCategory(
  skills: ProfileJson["profile"]["skills"],
  skillsOrder: string[]
): string {
  const categories =
    skillsOrder.length > 0
      ? skillsOrder.filter((cat) => skills[cat] && skills[cat].length > 0)
      : Object.keys(skills).filter(
          (cat) => skills[cat] && skills[cat].length > 0
        );
  if (categories.length === 0) return "";

  const categoryLabel = (key: string): string => {
    const s = key.replace(/([A-Z])/g, " $1").trim();
    return s
      ? s
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : key;
  };

  return categories
    .map(
      (cat) => `
    <div class="skills-category">
      <h3 class="skills-category-title">${escapeHtml(categoryLabel(cat))}</h3>
      <div class="skills-pills">
        ${(skills[cat] || [])
          .map(
            (skill: { name: string }) =>
              `<span class="skill-pill">${escapeHtml(skill.name)}</span>`
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");
}

// Featured repo from portfolio.options.featuredRepos (optional)
interface FeaturedRepoEntry {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}
function renderFeaturedRepos(repos: FeaturedRepoEntry[] | undefined): string {
  if (!repos || !Array.isArray(repos) || repos.length === 0) return "";
  return repos
    .map(
      (repo) => `
    <a href="${escapeHtml(repo.html_url)}" class="project-card" target="_blank" rel="noopener noreferrer">
      <h4 class="project-card-title">${escapeHtml(repo.name)}</h4>
      ${repo.description ? `<p class="project-card-desc">${escapeHtml(repo.description)}</p>` : ""}
      <div class="project-card-meta">
        ${repo.stargazers_count > 0 ? `<span class="project-card-stars">★ ${repo.stargazers_count}</span>` : ""}
        ${repo.language ? `<span class="project-card-lang">${escapeHtml(repo.language)}</span>` : ""}
      </div>
    </a>`
    )
    .join("");
}

// Experience timeline from portfolio.options.experience (optional)
interface ExperienceEntry {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
function renderExperienceTimeline(
  experience: ExperienceEntry[] | undefined
): string {
  if (!experience || !Array.isArray(experience) || experience.length === 0)
    return "";
  return `
  <div class="experience-timeline">
    ${experience
      .map(
        (entry) => `
      <div class="experience-entry">
        <div class="experience-dot" aria-hidden="true"></div>
        <div class="experience-content">
          <div class="experience-header">
            <strong class="experience-title">${escapeHtml(
              entry.title || ""
            )}</strong>
            <span class="experience-dates">${escapeHtml(
              [entry.startDate, entry.endDate].filter(Boolean).join(" – ") || ""
            )}</span>
          </div>
          <div class="experience-company">${escapeHtml(
            entry.company || ""
          )}</div>
          ${
            entry.description
              ? `<div class="experience-description">${formatDescription(
                  entry.description
                )}</div>`
              : ""
          }
        </div>
      </div>`
      )
      .join("")}
  </div>`;
}

// Helper: initials for sidebar avatar (e.g. "John Doe" -> "JD", "Alice" -> "AL")
function getInitialsForAvatar(name: string): string {
  const trimmed = (name || "").trim();
  if (!trimmed) return "?";
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return trimmed.slice(0, 2).toUpperCase();
}

// Helper: render skills as icons only (no category boxes, no item boxes)
function renderSkillsIconsOnly(
  skills: ProfileJson["profile"]["skills"],
  skillsOrder: string[]
): string {
  const categories =
    skillsOrder.length > 0
      ? skillsOrder.filter((cat) => skills[cat] && skills[cat].length > 0)
      : Object.keys(skills).filter(
          (cat) => skills[cat] && skills[cat].length > 0
        );
  if (categories.length === 0) return "";

  const getInitials = (name: string): string => {
    const cleaned = name
      .replace(/^(GNU|Microsoft|Visual|Code|Studio|Neo|Vim|Neovim)\s+/i, "")
      .replace(/\s+(Code|Studio|Editor|IDE)$/i, "")
      .trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 1) return cleaned.substring(0, 3).toUpperCase();
    return words
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  const renderOneIcon = (skill: any): string => {
    const iconPath =
      skill.path ||
      (skill.iTag
        ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg`
        : null);
    const darkIconPath = skill.darkPath || null;
    if (iconPath) {
      if (darkIconPath) {
        return `<picture><source media="(prefers-color-scheme: dark)" srcset="${escapeHtml(
          darkIconPath
        )}"><img src="${escapeHtml(iconPath)}" alt="${escapeHtml(
          skill.name
        )}" class="skill-icon" loading="lazy"></picture>`;
      }
      return `<img src="${escapeHtml(iconPath)}" alt="${escapeHtml(
        skill.name
      )}" class="skill-icon" loading="lazy">`;
    }
    const initials = getInitials(skill.name);
    return `<span style="font-size: 0.75rem; font-weight: 600; color: #b5b9d6; min-width: 2rem; text-align: center;">${escapeHtml(
      initials
    )}</span>`;
  };

  const allSkills = categories.flatMap((cat) =>
    (skills[cat] || []).map((s: any) => ({ ...s }))
  );
  return allSkills
    .map(
      (skill) =>
        `<span class="skill-icon-wrap" title="${escapeHtml(
          skill.name
        )}">${renderOneIcon(skill)}</span>`
    )
    .join("");
}

// Helper functions
function renderSkillsSection(
  skills: ProfileJson["profile"]["skills"],
  skillsOrder: string[],
  template: "minimal" | "modern" | "classic" = "minimal"
): string {
  const categories =
    skillsOrder.length > 0
      ? skillsOrder.filter((cat) => skills[cat] && skills[cat].length > 0)
      : Object.keys(skills).filter(
          (cat) => skills[cat] && skills[cat].length > 0
        );

  if (categories.length === 0) return "";

  const getInitials = (name: string): string => {
    const cleaned = name
      .replace(/^(GNU|Microsoft|Visual|Code|Studio|Neo|Vim|Neovim)\s+/i, "")
      .replace(/\s+(Code|Studio|Editor|IDE)$/i, "")
      .trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 1) {
      return cleaned.substring(0, 3).toUpperCase();
    } else {
      return words
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    }
  };

  const renderSkillIcon = (skill: any): string => {
    // Prioritize skill.path and skill.darkPath (for GitHub Pages hosted icons)
    // Fallback to iTag-based URL if path not available
    const iconPath =
      skill.path ||
      (skill.iTag
        ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg`
        : null);
    const darkIconPath = skill.darkPath || null;

    if (iconPath) {
      // Use picture element for dark mode support
      if (darkIconPath) {
        return `
          <picture>
            <source media="(prefers-color-scheme: dark)" srcset="${escapeHtml(
              darkIconPath
            )}">
            <img src="${escapeHtml(iconPath)}" alt="${escapeHtml(
          skill.name
        )}" class="skill-icon" loading="lazy">
          </picture>
        `;
      } else {
        return `<img src="${escapeHtml(iconPath)}" alt="${escapeHtml(
          skill.name
        )}" class="skill-icon" loading="lazy">`;
      }
    }

    // Fallback to text initials if no icon available
    const initials = getInitials(skill.name);
    return `<span class="skill-item-text">${initials}</span>`;
  };

  if (template === "minimal") {
    const categoryLabel = (key: string): string => {
      const s = key.replace(/([A-Z])/g, " $1").trim();
      return s
        ? s
            .split(/\s+/)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ")
        : key;
    };
    return categories
      .map((category) => {
        const items = skills[category] || [];
        return `
        <div class="skill-category">
          <h3>${escapeHtml(categoryLabel(category))}</h3>
          <div class="skill-items">
            ${items
              .map((skill) => {
                const iconHtml = renderSkillIcon(skill);
                return `<span class="skill-item" title="${escapeHtml(
                  skill.name
                )}">${iconHtml}</span>`;
              })
              .join("")}
          </div>
        </div>
      `;
      })
      .join("");
  }

  // For modern and classic, render all skills together
  const allSkills = categories.flatMap((cat) => skills[cat] || []);
  return allSkills
    .map((skill) => {
      const iconHtml = renderSkillIcon(skill);
      return `<span class="skill-item" title="${escapeHtml(
        skill.name
      )}">${iconHtml}</span>`;
    })
    .join("");
}

function renderSocialsSection(
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[],
  template: "minimal" | "modern" | "classic" = "minimal"
): string {
  const ordered =
    socialOrder.length > 0
      ? socialOrder.filter((key) => socials[key])
      : Object.keys(socials);

  return ordered
    .map((key) => {
      const social = socials[key];
      if (typeof social === "string") return "";
      const url = `${social.linkPrefix}${social.linkSuffix}${
        social.linkSuffixTwo || ""
      }`;
      return `<a href="${escapeHtml(
        url
      )}" class="social-link" target="_blank" rel="noopener noreferrer">${escapeHtml(
        social.label
      )}</a>`;
    })
    .join("");
}

function formatDescription(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function escapeHtml(text: string): string {
  const div = { innerHTML: "" } as any;
  div.textContent = text;
  return (
    div.innerHTML ||
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  );
}
