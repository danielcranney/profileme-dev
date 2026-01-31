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
  return `<div style="height: 5px; background: ${escapeHtml(color)}; width: 100%; margin: 0;"></div>`;
}

/**
 * Minimal Template (Dark, transparent sidebar + scrollable main)
 * Layout: fixed transparent sidebar (avatar, name, basic info) + main (intro line, skills icons only, then rest of profile)
 */
function renderMinimalTemplate(profileJson: ProfileJson): string {
  const { profile, portfolio } = profileJson;
  const { introduction, skills, socials, badges, support } = profile;
  const font = portfolio?.font || "Inter";
  const accentColor = portfolio?.accentColor || "#3b82f6";
  const fontUrl = getGoogleFontsUrl(font);

  const displayName = introduction.name || "Portfolio";
  const introLine = introduction.shortDescription?.trim() || displayName;
  const sidebarInitials = getInitialsForAvatar(displayName);

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
      font-family: '${escapeHtml(font)}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: #e5e7eb;
      background: #1f2937;
    }
    .layout { display: flex; min-height: 100%; }
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 280px;
      background: transparent;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .sidebar-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #374151;
      color: #9ca3af;
      font-size: 2.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      overflow: hidden;
    }
    .sidebar-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .sidebar-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f9fafb;
      margin-bottom: 0.5rem;
    }
    .sidebar-tagline {
      font-size: 0.95rem;
      color: #9ca3af;
      margin-bottom: 0.5rem;
    }
    .sidebar-location {
      font-size: 0.875rem;
      color: #6b7280;
    }
    .main {
      flex: 1;
      margin-left: 280px;
      padding: 2rem 2.5rem;
      overflow-y: auto;
    }
    .main-intro {
      font-size: 1.25rem;
      color: #d1d5db;
      margin-bottom: 2rem;
    }
    .skills-icons {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .skills-icons .skill-icon-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .skills-icons .skill-icon {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }
    section { margin-bottom: 2.5rem; }
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #f9fafb;
      border-bottom: 2px solid ${escapeHtml(accentColor)};
      padding-bottom: 0.5rem;
    }
    .description {
      font-size: 1rem;
      line-height: 1.8;
      color: #d1d5db;
    }
    .socials { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #374151;
      color: #e5e7eb;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .social-link:hover { background: #4b5563; }
    .links { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .link-button {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: ${escapeHtml(accentColor)};
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }
    .link-button:hover { opacity: 0.9; }
    footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #374151;
      font-size: 0.875rem;
      color: #6b7280;
    }
    footer a { color: #60a5fa; text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .sidebar { position: relative; width: 100%; padding: 1.5rem; }
      .main { margin-left: 0; padding: 1.5rem; }
    }
  </style>
</head>
<body>
  ${getAccentBar(accentColor)}
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-avatar" aria-hidden="true">${introduction.avatarUrl?.trim()
    ? `<img src="${escapeHtml(introduction.avatarUrl.trim())}" alt="">`
    : escapeHtml(sidebarInitials)}</div>
      <h1 class="sidebar-name">${escapeHtml(displayName)}</h1>
      ${introduction.shortDescription?.trim() ? `<p class="sidebar-tagline">${escapeHtml(introduction.shortDescription.trim())}</p>` : ""}
      ${introduction.location?.trim() ? `<p class="sidebar-location">📍 ${escapeHtml(introduction.location.trim())}</p>` : ""}
    </aside>
    <main class="main">
      <p class="main-intro">${escapeHtml(introLine)}</p>
      ${Object.keys(skills).length > 0 ? `
      <div class="skills-icons">
        ${renderSkillsIconsOnly(skills, profile.skillsOrder)}
      </div>
      ` : ""}

      ${introduction.longDescription ? `
      <section id="about">
        <h2>About</h2>
        <div class="description">${formatDescription(introduction.longDescription)}</div>
      </section>
      ` : ""}

      ${introduction.workingOnTitle && introduction.workingOnLink ? `
      <section id="projects">
        <h2>Currently Working On</h2>
        <div class="links">
          <a href="${escapeHtml(introduction.workingOnLink)}" class="link-button" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(introduction.workingOnTitle)}
          </a>
        </div>
      </section>
      ` : ""}

      ${introduction.portfolioTitle && introduction.portfolioLink ? `
      <section id="portfolio">
        <h2>Portfolio</h2>
        <div class="links">
          <a href="${escapeHtml(introduction.portfolioLink)}" class="link-button" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(introduction.portfolioTitle)}
          </a>
        </div>
      </section>
      ` : ""}

      ${introduction.learning ? `
      <section id="learning">
        <h2>Currently Learning</h2>
        <div class="description">${escapeHtml(introduction.learning)}</div>
      </section>
      ` : ""}

      ${introduction.collaborateOn ? `
      <section id="collaborate">
        <h2>Looking to Collaborate On</h2>
        <div class="description">${escapeHtml(introduction.collaborateOn)}</div>
      </section>
      ` : ""}

      ${Object.keys(socials).length > 0 ? `
      <section id="socials">
        <h2>Connect</h2>
        <div class="socials">
          ${renderSocialsSection(socials, profile.socialOrder)}
        </div>
      </section>
      ` : ""}

      ${introduction.additionalInfo ? `
      <section id="additional">
        <h2>Additional Information</h2>
        <div class="description">${formatDescription(introduction.additionalInfo)}</div>
      </section>
      ` : ""}

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
      font-family: '${escapeHtml(font)}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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
      ${introduction.shortDescription ? `<p class="subtitle">${escapeHtml(introduction.shortDescription)}</p>` : ""}
    </header>
    <div class="content">
      ${introduction.longDescription ? `
      <section id="about">
        <h2>About</h2>
        <p>${formatDescription(introduction.longDescription)}</p>
      </section>
      ` : ""}
      ${Object.keys(skills).length > 0 ? `
      <section id="skills">
        <h2>Skills</h2>
        <div>
          ${renderSkillsSection(skills, profile.skillsOrder, "modern")}
        </div>
      </section>
      ` : ""}
      ${Object.keys(socials).length > 0 ? `
      <section id="socials">
        <h2>Connect</h2>
        <div>
          ${renderSocialsSection(socials, profile.socialOrder, "modern")}
        </div>
      </section>
      ` : ""}
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
      ${introduction.shortDescription ? `<p class="subtitle">${escapeHtml(introduction.shortDescription)}</p>` : ""}
    </header>
    ${introduction.longDescription ? `
    <section id="about">
      <h2>About</h2>
      <p>${formatDescription(introduction.longDescription)}</p>
    </section>
    ` : ""}
    ${Object.keys(skills).length > 0 ? `
    <section id="skills">
      <h2>Skills</h2>
      <div>
        ${renderSkillsSection(skills, profile.skillsOrder, "classic")}
      </div>
    </section>
    ` : ""}
    ${Object.keys(socials).length > 0 ? `
    <section id="socials">
      <h2>Connect</h2>
      <div>
        ${renderSocialsSection(socials, profile.socialOrder, "classic")}
      </div>
    </section>
    ` : ""}
  </div>
</body>
</html>`;
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
  const categories = skillsOrder.length > 0
    ? skillsOrder.filter(cat => skills[cat] && skills[cat].length > 0)
    : Object.keys(skills).filter(cat => skills[cat] && skills[cat].length > 0);
  if (categories.length === 0) return "";

  const getInitials = (name: string): string => {
    const cleaned = name
      .replace(/^(GNU|Microsoft|Visual|Code|Studio|Neo|Vim|Neovim)\s+/i, "")
      .replace(/\s+(Code|Studio|Editor|IDE)$/i, "")
      .trim();
    const words = cleaned.split(/\s+/);
    if (words.length === 1) return cleaned.substring(0, 3).toUpperCase();
    return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
  };

  const renderOneIcon = (skill: any): string => {
    const iconPath = skill.path || (skill.iTag ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg` : null);
    const darkIconPath = skill.darkPath || null;
    if (iconPath) {
      if (darkIconPath) {
        return `<picture><source media="(prefers-color-scheme: dark)" srcset="${escapeHtml(darkIconPath)}"><img src="${escapeHtml(iconPath)}" alt="${escapeHtml(skill.name)}" class="skill-icon" loading="lazy"></picture>`;
      }
      return `<img src="${escapeHtml(iconPath)}" alt="${escapeHtml(skill.name)}" class="skill-icon" loading="lazy">`;
    }
    const initials = getInitials(skill.name);
    return `<span style="font-size: 0.75rem; font-weight: 600; color: #9ca3af; min-width: 2rem; text-align: center;">${escapeHtml(initials)}</span>`;
  };

  const allSkills = categories.flatMap(cat => (skills[cat] || []).map((s: any) => ({ ...s })));
  return allSkills.map(skill =>
    `<span class="skill-icon-wrap" title="${escapeHtml(skill.name)}">${renderOneIcon(skill)}</span>`
  ).join("");
}

// Helper functions
function renderSkillsSection(
  skills: ProfileJson["profile"]["skills"],
  skillsOrder: string[],
  template: "minimal" | "modern" | "classic" = "minimal"
): string {
  const categories = skillsOrder.length > 0 
    ? skillsOrder.filter(cat => skills[cat] && skills[cat].length > 0)
    : Object.keys(skills).filter(cat => skills[cat] && skills[cat].length > 0);

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
      return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
    }
  };

  const renderSkillIcon = (skill: any): string => {
    // Prioritize skill.path and skill.darkPath (for GitHub Pages hosted icons)
    // Fallback to iTag-based URL if path not available
    const iconPath = skill.path || (skill.iTag ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg` : null);
    const darkIconPath = skill.darkPath || null;
    
    if (iconPath) {
      // Use picture element for dark mode support
      if (darkIconPath) {
        return `
          <picture>
            <source media="(prefers-color-scheme: dark)" srcset="${escapeHtml(darkIconPath)}">
            <img src="${escapeHtml(iconPath)}" alt="${escapeHtml(skill.name)}" class="skill-icon" loading="lazy">
          </picture>
        `;
      } else {
        return `<img src="${escapeHtml(iconPath)}" alt="${escapeHtml(skill.name)}" class="skill-icon" loading="lazy">`;
      }
    }
    
    // Fallback to text initials if no icon available
    const initials = getInitials(skill.name);
    return `<span class="skill-item-text">${initials}</span>`;
  };

  if (template === "minimal") {
    return categories.map(category => {
      const items = skills[category] || [];
      return `
        <div class="skill-category">
          <h3>${escapeHtml(category)}</h3>
          <div class="skill-items">
            ${items.map(skill => {
              const iconHtml = renderSkillIcon(skill);
              return `<span class="skill-item" title="${escapeHtml(skill.name)}">${iconHtml}</span>`;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  // For modern and classic, render all skills together
  const allSkills = categories.flatMap(cat => skills[cat] || []);
  return allSkills.map(skill => {
    const iconHtml = renderSkillIcon(skill);
    return `<span class="skill-item" title="${escapeHtml(skill.name)}">${iconHtml}</span>`;
  }).join("");
}

function renderSocialsSection(
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[],
  template: "minimal" | "modern" | "classic" = "minimal"
): string {
  const ordered = socialOrder.length > 0
    ? socialOrder.filter(key => socials[key])
    : Object.keys(socials);

  return ordered.map(key => {
    const social = socials[key];
    if (typeof social === "string") return "";
    const url = `${social.linkPrefix}${social.linkSuffix}${social.linkSuffixTwo || ""}`;
    return `<a href="${escapeHtml(url)}" class="social-link" target="_blank" rel="noopener noreferrer">${escapeHtml(social.label)}</a>`;
  }).join("");
}

function formatDescription(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

function escapeHtml(text: string): string {
  const div = { innerHTML: "" } as any;
  div.textContent = text;
  return div.innerHTML || text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
