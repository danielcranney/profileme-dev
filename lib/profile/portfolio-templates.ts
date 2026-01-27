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
 * Minimal Template (Dark, clean, minimal)
 */
function renderMinimalTemplate(profileJson: ProfileJson): string {
  const { profile } = profileJson;
  const { introduction, skills, socials, badges, support } = profile;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(introduction.name || "Portfolio")} - Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: #e5e7eb;
      background: #1f2937;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 2px solid #374151;
      margin-bottom: 3rem;
    }
    h1 { font-size: 3rem; margin-bottom: 0.5rem; color: #f9fafb; }
    .subtitle { font-size: 1.25rem; color: #9ca3af; margin-bottom: 1rem; }
    .location { color: #6b7280; font-size: 1rem; }
    section { margin-bottom: 3rem; }
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #f9fafb;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 0.5rem;
    }
    .description {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #d1d5db;
      margin-bottom: 2rem;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .skill-category {
      background: #111827;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .skill-category h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #f9fafb;
    }
    .skill-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .skill-item {
      background: #374151;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      border: 1px solid #4b5563;
      font-size: 0.75rem;
      font-weight: 500;
      color: #e5e7eb;
      min-width: 2.5rem;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .socials {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }
    .social-link:hover { background: #2563eb; }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    .link-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }
    .link-button:hover { background: #059669; }
    footer {
      text-align: center;
      padding: 2rem 0;
      margin-top: 3rem;
      border-top: 2px solid #374151;
      color: #6b7280;
    }
    footer a { color: #3b82f6; text-decoration: none; }
    footer a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .container { padding: 1rem; }
      h1 { font-size: 2rem; }
      .skills-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(introduction.name || "Portfolio")}</h1>
      ${introduction.shortDescription ? `<p class="subtitle">${escapeHtml(introduction.shortDescription)}</p>` : ""}
      ${introduction.location ? `<p class="location">📍 ${escapeHtml(introduction.location)}</p>` : ""}
    </header>

    ${introduction.longDescription ? `
    <section id="about">
      <h2>About</h2>
      <div class="description">${formatDescription(introduction.longDescription)}</div>
    </section>
    ` : ""}

    ${Object.keys(skills).length > 0 ? `
    <section id="skills">
      <h2>Skills</h2>
      <div class="skills-grid">
        ${renderSkillsSection(skills, profile.skillsOrder)}
      </div>
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
  </div>
</body>
</html>`;
}

/**
 * Modern Template (Light, colorful, modern)
 */
function renderModernTemplate(profileJson: ProfileJson): string {
  const { profile } = profileJson;
  const { introduction, skills, socials } = profile;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(introduction.name || "Portfolio")} - Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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
      color: #667eea;
      border-left: 4px solid #764ba2;
      padding-left: 1rem;
    }
    .skill-item {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
      margin: 0.25rem;
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
  const { profile } = profileJson;
  const { introduction, skills, socials } = profile;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(introduction.name || "Portfolio")} - Portfolio</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      color: #2c3e50;
      background: #f8f9fa;
    }
    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    header {
      background: white;
      padding: 3rem;
      border-bottom: 3px solid #2c3e50;
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
      padding: 0.5rem 1rem;
      border-radius: 4px;
      display: inline-block;
      margin: 0.25rem;
      font-size: 0.9rem;
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

  if (template === "minimal") {
    return categories.map(category => {
      const items = skills[category] || [];
      return `
        <div class="skill-category">
          <h3>${escapeHtml(category)}</h3>
          <div class="skill-items">
            ${items.map(skill => {
              const initials = getInitials(skill.name);
              return `<span class="skill-item" title="${escapeHtml(skill.name)}">${initials}</span>`;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  // For modern and classic, render all skills together
  const allSkills = categories.flatMap(cat => skills[cat] || []);
  return allSkills.map(skill => {
    const initials = getInitials(skill.name);
    return `<span class="skill-item" title="${escapeHtml(skill.name)}">${initials}</span>`;
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
