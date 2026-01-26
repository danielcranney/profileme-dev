/**
 * Portfolio Renderer
 * 
 * Generates a GitHub Pages-compatible HTML portfolio from Profile JSON.
 * This is a minimal v1 implementation.
 */

import type { ProfileJson } from "./types";

/**
 * Render portfolio HTML from Profile JSON
 */
export function renderPortfolio(profileJson: ProfileJson): string {
  const { profile, portfolio } = profileJson;
  const { introduction, skills, socials, badges, support } = profile;

  // Get portfolio template (default to "minimal")
  const template = portfolio?.template || "minimal";

  // Basic HTML structure
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${introduction.name || "Portfolio"} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.6;
      color: #e5e7eb;
      background: #1f2937;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 2px solid #374151;
      margin-bottom: 3rem;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      color: #f9fafb;
    }
    
    .subtitle {
      font-size: 1.25rem;
      color: #9ca3af;
      margin-bottom: 1rem;
    }
    
    .location {
      color: #6b7280;
      font-size: 1rem;
    }
    
    section {
      margin-bottom: 3rem;
    }
    
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
    
    .social-link:hover {
      background: #2563eb;
    }
    
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
    
    .link-button:hover {
      background: #059669;
    }
    
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .badge {
      display: inline-block;
    }
    
    .support {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .support-link {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #e74c3c;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }
    
    .support-link:hover {
      background: #c0392b;
    }
    
    footer {
      text-align: center;
      padding: 2rem 0;
      margin-top: 3rem;
      border-top: 2px solid #374151;
      color: #6b7280;
    }
    
    footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .skills-grid {
        grid-template-columns: 1fr;
      }
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
        ${renderSkills(skills, profile.skillsOrder)}
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
        ${renderSocials(socials, profile.socialOrder)}
      </div>
    </section>
    ` : ""}

    ${renderBadges(badges)}

    ${Object.keys(support).length > 0 ? `
    <section id="support">
      <h2>Support</h2>
      <div class="support">
        ${renderSupport(support)}
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

  return html;
}

/**
 * Render skills section
 */
function renderSkills(skills: ProfileJson["profile"]["skills"], skillsOrder: string[]): string {
  const categories = skillsOrder.length > 0 
    ? skillsOrder.filter(cat => skills[cat] && skills[cat].length > 0)
    : Object.keys(skills).filter(cat => skills[cat] && skills[cat].length > 0);

  if (categories.length === 0) {
    return "";
  }

  // Helper to get initials from skill name
  const getInitials = (name: string): string => {
    // Remove common prefixes/suffixes and get first letters
    const cleaned = name
      .replace(/^(GNU|Microsoft|Visual|Code|Studio|Neo|Vim|Neovim)\s+/i, "")
      .replace(/\s+(Code|Studio|Editor|IDE)$/i, "")
      .trim();
    
    // Get first letter of each word, max 2-3 letters
    const words = cleaned.split(/\s+/);
    if (words.length === 1) {
      // Single word - take first 2-3 letters
      return cleaned.substring(0, 3).toUpperCase();
    } else {
      // Multiple words - take first letter of each, max 2
      return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
    }
  };

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

/**
 * Render socials section
 */
function renderSocials(socials: ProfileJson["profile"]["socials"], socialOrder: string[]): string {
  const ordered = socialOrder.length > 0
    ? socialOrder.filter(key => socials[key])
    : Object.keys(socials);

  return ordered.map(key => {
    const social = socials[key];
    if (typeof social === "string") {
      return "";
    }
    
    const url = `${social.linkPrefix}${social.linkSuffix}${social.linkSuffixTwo || ""}`;
    return `
      <a href="${escapeHtml(url)}" class="social-link" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(social.label)}
      </a>
    `;
  }).join("");
}

/**
 * Render badges section
 */
function renderBadges(badges: ProfileJson["profile"]["badges"]): string {
  const badgeElements: string[] = [];

  // GitHub Stats Card
  if (badges.githubStatsCard?.selected) {
    const config = badges.githubStatsCard;
    const params = new URLSearchParams();
    if (config.stars) params.set("show_icons", "true");
    // Add more params as needed
    badgeElements.push(`
      <img src="https://github-readme-stats.vercel.app/api?username=USERNAME&${params.toString()}" alt="GitHub Stats" class="badge" />
    `);
  }

  // GitHub Streak
  if (badges.githubStreak?.selected) {
    badgeElements.push(`
      <img src="https://github-readme-streak-stats.demolab.com/?user=USERNAME" alt="GitHub Streak" class="badge" />
    `);
  }

  // Top Languages
  if (badges.topLangsCard?.selected) {
    badgeElements.push(`
      <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME" alt="Top Languages" class="badge" />
    `);
  }

  if (badgeElements.length === 0) {
    return "";
  }

  return `
    <section id="badges">
      <h2>Statistics</h2>
      <div class="badges">
        ${badgeElements.join("")}
      </div>
    </section>
  `;
}

/**
 * Render support section
 */
function renderSupport(support: ProfileJson["profile"]["support"]): string {
  return Object.values(support).map(sup => {
    const url = `${sup.linkPrefix}${sup.linkSuffix}`;
    return `
      <a href="${escapeHtml(url)}" class="support-link" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(sup.path.split("/").pop() || "Support")}
      </a>
    `;
  }).join("");
}

/**
 * Format description text (preserve line breaks)
 */
function formatDescription(text: string): string {
  return escapeHtml(text).replace(/\n/g, "<br>");
}

/**
 * Escape HTML to prevent XSS
 */
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
