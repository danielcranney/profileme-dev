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

/**
 * Minimal Template (Dark two-column: fixed sidebar + scrollable main)
 * Reference: deep navy (#141921), sidebar (avatar, name, title, bio, email, location, social icons),
 * main (Core Skills as categorized pills, optional Experience timeline from portfolio.options.experience).
 */
function renderMinimalTemplate(profileJson: ProfileJson): string {
  const { profile, portfolio } = profileJson;
  const { introduction, skills, socials } = profile;
  const font = portfolio?.font || "Inter";
  const accentColor = portfolio?.accentColor || "#3b82f6";
  const fontUrl = getGoogleFontsUrl(font);

  const displayName = introduction.name || "Portfolio";
  const title = introduction.shortDescription?.trim() || "";
  const bio = introduction.longDescription?.trim() || "";
  const email = introduction.emailMe?.trim() || "";
  const location = introduction.location?.trim() || "";
  const sidebarInitials = getInitialsForAvatar(displayName);
  const experience = portfolio?.options?.experience as
    | ExperienceEntry[]
    | undefined;
  const portfolioOgImage = portfolio?.options?.portfolioOgImage as
    | string
    | undefined;
  const featuredRepos = portfolio?.options?.featuredRepos as
    | FeaturedRepoEntry[]
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
      color: #d1d5db;
      background: #141921;
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
    .layout { display: flex; min-height: 100%; }
    .sidebar {
      position: fixed;
      left: 0;
      top: 5px;
      bottom: 0;
      width: 320px;
      background: #141921;
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .sidebar-avatar {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: #2c3440;
      color: #9ca3af;
      font-size: 2.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .sidebar-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .sidebar-name {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.375rem;
      letter-spacing: -0.02em;
    }
    .sidebar-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #d1d5db;
      margin-bottom: 1rem;
    }
    .sidebar-bio {
      font-size: 0.9375rem;
      font-weight: 400;
      color: #d1d5db;
      line-height: 1.7;
      margin-bottom: 1.5rem;
      max-width: 260px;
    }
    .sidebar-contact {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      width: 100%;
      max-width: 260px;
    }
    .sidebar-contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #d1d5db;
    }
    .sidebar-contact-item svg {
      flex-shrink: 0;
      color: #9ca3af;
    }
    .sidebar-contact-item a {
      color: #d1d5db;
      text-decoration: none;
    }
    .sidebar-contact-item a:hover { text-decoration: underline; }
    .sidebar-socials {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.5rem;
      justify-content: center;
    }
    .sidebar-social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #d1d5db;
      transition: opacity 0.2s;
    }
    .sidebar-social-icon:hover { opacity: 0.85; }
    .sidebar-social-icon img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .main {
      flex: 1;
      margin-left: 320px;
      padding: 2.5rem 3rem;
      overflow-y: auto;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #2c3440;
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
      color: #9ca3af;
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
      color: #d1d5db;
      background: #2c3440;
      border-radius: 9999px;
    }
    .experience-timeline {
      position: relative;
      padding-left: 1.5rem;
      border-left: 2px solid #2c3440;
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
      background: #d1d5db;
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
      color: #9ca3af;
    }
    .experience-company {
      font-size: 0.9375rem;
      color: #9ca3af;
      margin-bottom: 0.5rem;
    }
    .experience-description {
      font-size: 0.875rem;
      color: #d1d5db;
      line-height: 1.6;
    }
    .main-section { margin-bottom: 2.5rem; }
    .main .section-description {
      font-size: 0.9375rem;
      color: #d1d5db;
      line-height: 1.7;
    }
    .main .section-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .main .link-button {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: ${escapeHtml(accentColor)};
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }
    .main .link-button:hover { opacity: 0.9; }
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
      background: #2c3440;
      color: #e5e7eb;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .main .social-link:hover { background: #374151; }
    .portfolio-card {
      display: block;
      position: relative;
      height: 180px;
      border-radius: 12px;
      overflow: hidden;
      text-decoration: none;
      background: #2c3440;
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
      background: #2c3440;
      border-radius: 12px;
      text-decoration: none;
      transition: background 0.2s;
    }
    .project-card:hover { background: #374151; }
    .project-card-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }
    .project-card-desc {
      font-size: 0.875rem;
      color: #d1d5db;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }
    .project-card-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8125rem;
      color: #9ca3af;
    }
    .project-card-stars,
    .project-card-lang { display: inline; }
    footer {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #2c3440;
      font-size: 0.8125rem;
      color: #6b7280;
    }
    footer a { color: #60a5fa; text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .sidebar { position: relative; width: 100%; padding: 1.5rem; }
      .main { margin-left: 0; padding: 1.5rem 1.25rem; }
    }
  </style>
</head>
<body>
  <div class="accent-bar-fixed" style="background: ${escapeHtml(
    accentColor
  )};"></div>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-avatar" aria-hidden="true">${
        introduction.avatarUrl?.trim()
          ? `<img src="${escapeHtml(introduction.avatarUrl.trim())}" alt="">`
          : escapeHtml(sidebarInitials)
      }</div>
      <h1 class="sidebar-name">${escapeHtml(displayName)}</h1>
      ${title ? `<p class="sidebar-title">${escapeHtml(title)}</p>` : ""}
      ${bio ? `<div class="sidebar-bio">${formatDescription(bio)}</div>` : ""}
      <div class="sidebar-contact">
        ${
          email
            ? `<div class="sidebar-contact-item">${ICON_ENVELOPE}<a href="mailto:${escapeHtml(
                email
              )}">${escapeHtml(email)}</a></div>`
            : ""
        }
        ${
          location
            ? `<div class="sidebar-contact-item">${ICON_MAP_PIN}<span>${escapeHtml(
                location
              )}</span></div>`
            : ""
        }
      </div>
      ${
        Object.keys(socials).length > 0
          ? `<div class="sidebar-socials">${renderSocialsIconsOnly(
              socials,
              profile.socialOrder
            )}</div>`
          : ""
      }
    </aside>
    <main class="main">
      ${
        introduction.longDescription
          ? `
      <section class="main-section" id="about">
        <h2 class="section-title">About</h2>
        <div class="section-description">${formatDescription(
          introduction.longDescription
        )}</div>
      </section>
      `
          : ""
      }
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
        introduction.workingOnTitle && introduction.workingOnLink
          ? `
      <section class="main-section" id="projects">
        <h2 class="section-title">Currently Working On</h2>
        <div class="section-links">
          <a href="${escapeHtml(
            introduction.workingOnLink
          )}" class="link-button" target="_blank" rel="noopener noreferrer">${escapeHtml(
              introduction.workingOnTitle
            )}</a>
        </div>
      </section>
      `
          : ""
      }
      ${
        introduction.portfolioTitle && introduction.portfolioLink
          ? `
      <section class="main-section" id="portfolio">
        <h2 class="section-title">Portfolio</h2>
        ${
          portfolioOgImage
            ? `
        <a href="${escapeHtml(
          introduction.portfolioLink
        )}" class="portfolio-card" target="_blank" rel="noopener noreferrer">
          <div class="portfolio-card-bg" style="background-image: url(${escapeHtml(
            portfolioOgImage
          )});"></div>
          <div class="portfolio-card-overlay"></div>
          <div class="portfolio-card-content">
            <span class="portfolio-card-title">${escapeHtml(
              introduction.portfolioTitle
            )}</span>
          </div>
        </a>
        `
            : `
        <div class="section-links">
          <a href="${escapeHtml(
            introduction.portfolioLink
          )}" class="link-button" target="_blank" rel="noopener noreferrer">${escapeHtml(
              introduction.portfolioTitle
            )}</a>
        </div>
        `
        }
      </section>
      `
          : ""
      }
      ${
        featuredRepos && featuredRepos.length > 0
          ? `
      <section class="main-section" id="projects">
        <h2 class="section-title">Projects</h2>
        <div class="projects-grid">${renderFeaturedRepos(featuredRepos)}</div>
      </section>
      `
          : ""
      }
      ${
        introduction.learning
          ? `
      <section class="main-section" id="learning">
        <h2 class="section-title">Currently Learning</h2>
        <div class="section-description">${formatDescription(
          introduction.learning
        )}</div>
      </section>
      `
          : ""
      }
      ${
        introduction.collaborateOn
          ? `
      <section class="main-section" id="collaborate">
        <h2 class="section-title">Looking to Collaborate On</h2>
        <div class="section-description">${formatDescription(
          introduction.collaborateOn
        )}</div>
      </section>
      `
          : ""
      }
      ${
        Object.keys(socials).length > 0
          ? `
      <section class="main-section" id="connect">
        <h2 class="section-title">Connect</h2>
        <div class="section-socials">
          ${renderSocialsSection(socials, profile.socialOrder)}
        </div>
      </section>
      `
          : ""
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

// Social links as icon-only (for sidebar); uses darkPath when available for dark theme
function renderSocialsIconsOnly(
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[]
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
      }`.trim();
      if (!url || url === social.linkPrefix) return "";
      const iconPath = social.darkPath || social.path;
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
    return `<span style="font-size: 0.75rem; font-weight: 600; color: #9ca3af; min-width: 2rem; text-align: center;">${escapeHtml(
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
