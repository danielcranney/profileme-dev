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
      color: #333;
      background: #fff;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      padding: 3rem 0;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 3rem;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }
    
    .subtitle {
      font-size: 1.25rem;
      color: #7f8c8d;
      margin-bottom: 1rem;
    }
    
    .location {
      color: #95a5a6;
      font-size: 1rem;
    }
    
    section {
      margin-bottom: 3rem;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }
    
    .description {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #555;
      margin-bottom: 2rem;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
    
    .skill-category {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }
    
    .skill-category h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .skill-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    .skill-item {
      background: #fff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      font-size: 0.9rem;
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
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }
    
    .social-link:hover {
      background: #2980b9;
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
      background: #2ecc71;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.3s;
    }
    
    .link-button:hover {
      background: #27ae60;
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
      border-top: 2px solid #e0e0e0;
      color: #95a5a6;
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

  return categories.map(category => {
    const items = skills[category] || [];
    return `
      <div class="skill-category">
        <h3>${escapeHtml(category)}</h3>
        <div class="skill-items">
          ${items.map(skill => `
            <span class="skill-item">${escapeHtml(skill.name)}</span>
          `).join("")}
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
