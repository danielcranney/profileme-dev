/**
 * Markdown Renderer
 * 
 * Pure function that generates README markdown from Profile JSON.
 * This is the canonical way to render markdown - it's always derived from JSON.
 */

import { ProfileJson } from "./schema";
import type { SocialProfile } from "./types";

// Import turndown (CommonJS module)
import TurndownService from "turndown";

/**
 * Render README markdown from Profile JSON
 */
export function renderReadme(profileJson: ProfileJson): string {
  const turndownService = new TurndownService();
  turndownService.addRule("pRemoval", {
    filter: "p",
    replacement: function (content) {
      return "\n" + content + "\n\n";
    },
  });

  const sections: string[] = [];
  const { profile } = profileJson;

  // Render sections in order
  for (const sectionType of profile.sectionOrder) {
    const sectionMarkdown = renderSection(sectionType, profile, turndownService);
    if (sectionMarkdown) {
      sections.push(sectionMarkdown);
    }
  }

  return sections.join("\n\n").trim() + "\n";
}

/**
 * Render a single section
 */
function renderSection(
  sectionType: string,
  profile: ProfileJson["profile"],
  turndownService: TurndownService
): string | null {
  switch (sectionType) {
    case "introduction":
      return renderIntroduction(profile.introduction, turndownService);
    case "skills":
      return renderSkills(profile.skills, profile.skillsOrder);
    case "socials":
      return renderSocials(profile.socials, profile.socialOrder);
    case "badges":
      return renderBadges(profile.badges, profile.socials);
    case "support":
      return renderSupport(profile.support);
    default:
      return null;
  }
}

/**
 * Render introduction section
 */
function renderIntroduction(
  intro: ProfileJson["profile"]["introduction"],
  turndownService: TurndownService
): string {
  let html = "";

  // Name header
  if (intro.name) {
    if (intro.animatedHand === 0) {
      html += `<h1>Hi 👋 My name is ${escapeHtml(intro.name)}</h1>`;
    } else {
      html += `<h1>Hi <span><img style="display: inline" height="36px" width="36px" src="https://user-images.githubusercontent.com/18350557/176309783-0785949b-9127-417c-8b55-ab5a4333674e.gif" /></span> My name is ${escapeHtml(intro.name)}</h1>`;
    }
  }

  // Short description
  if (intro.shortDescription) {
    html += `<h2>${escapeHtml(intro.shortDescription)}</h2>`;
  }

  // Long description
  if (intro.longDescription) {
    html += `<p>${intro.longDescription.replace(/\n/g, "</p><p>")}</p>`;
  }

  // List items
  const listItems: string[] = [];

  if (intro.location) {
    listItems.push(`🌍&nbsp; I'm based in ${escapeHtml(intro.location)}`);
  }

  if (intro.portfolioTitle && intro.portfolioLink) {
    listItems.push(
      `🖥️&nbsp; See my portfolio at <a href="http://${escapeHtml(intro.portfolioLink)}" target="_blank" rel="noreferrer">${escapeHtml(intro.portfolioTitle)}</a>`
    );
  }

  if (intro.emailMe) {
    listItems.push(
      `✉️&nbsp; You can contact me at <a href="mailto:${escapeHtml(intro.emailMe)}">${escapeHtml(intro.emailMe)}</a>`
    );
  }

  if (intro.workingOnTitle && intro.workingOnLink) {
    listItems.push(
      `🚀&nbsp; I'm currently working on <a href="http://${escapeHtml(intro.workingOnLink)}" target="_blank" rel="noreferrer">${escapeHtml(intro.workingOnTitle)}</a>`
    );
  }

  if (intro.learning) {
    listItems.push(`🧠&nbsp; I'm currently learning ${escapeHtml(intro.learning)}`);
  }

  if (intro.collaborateOn) {
    listItems.push(
      `👥&nbsp; I'm looking to collaborate on ${escapeHtml(intro.collaborateOn)}`
    );
  }

  if (intro.additionalInfo) {
    listItems.push(
      `💬&nbsp; Ask me about ${escapeHtml(intro.additionalInfo)}`
    );
  }

  if (listItems.length > 0) {
    html += `<ul>${listItems.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  return turndownService.turndown(html);
}

/**
 * Render skills section
 */
function renderSkills(
  skills: ProfileJson["profile"]["skills"],
  skillsOrder: string[]
): string | null {
  const skillCategories = Object.keys(skills).filter(
    (category) => skills[category] && skills[category].length > 0
  );

  if (skillCategories.length === 0) {
    return null;
  }

  let markdown = "### Skills\n\n";
  markdown += "<p align=\"left\">\n";

  // Render skills in order if specified, otherwise use natural order
  const orderedCategories = skillsOrder.length > 0 
    ? skillsOrder.filter(cat => skillCategories.includes(cat))
    : skillCategories;

  for (const category of orderedCategories) {
    const categorySkills = skills[category] || [];
    for (const skill of categorySkills) {
      if (skill.darkPath) {
        markdown += `<a href="${skill.link || "#"}" target="_blank" rel="noreferrer"><img src="${skill.path}" width="36" height="36" alt="${escapeHtml(skill.name)}" title="${escapeHtml(skill.name)}"/></a> `;
      } else {
        markdown += `<a href="${skill.link || "#"}" target="_blank" rel="noreferrer"><img src="${skill.path}" width="36" height="36" alt="${escapeHtml(skill.name)}" title="${escapeHtml(skill.name)}"/></a> `;
      }
    }
  }

  markdown += "\n</p>";

  return markdown;
}

/**
 * Render socials section
 */
function renderSocials(
  socials: ProfileJson["profile"]["socials"],
  socialOrder: string[]
): string | null {
  // Type guard helper
  const isValidSocialProfile = (profile: unknown): profile is SocialProfile => {
    return (
      profile !== undefined &&
      profile !== null &&
      typeof profile === "object" &&
      "linkSuffix" in profile &&
      typeof (profile as SocialProfile).linkSuffix === "string" &&
      (profile as SocialProfile).linkSuffix.trim() !== ""
    );
  };

  const activeSocials: Array<[string, SocialProfile]> = Object.entries(socials)
    .filter((entry) => {
      const profile = entry[1];
      return isValidSocialProfile(profile);
    })
    .map((entry) => [entry[0], entry[1] as SocialProfile]);

  if (activeSocials.length === 0) {
    return null;
  }

  let markdown = "### Socials\n\n";
  markdown += "<p align=\"left\">\n";

  // Render in order if specified
  const orderedSocials: Array<[string, SocialProfile]> = socialOrder.length > 0
    ? socialOrder
        .map((key) => [key, socials[key]] as [string, SocialProfile | undefined])
        .filter((entry) => {
          const profile = entry[1];
          return isValidSocialProfile(profile);
        })
        .map((entry) => [entry[0], entry[1] as SocialProfile])
    : activeSocials;

  for (const [key, profile] of orderedSocials) {
    const link = `${profile.linkPrefix}${profile.linkSuffix}${profile.linkSuffixTwo || ""}`;
    markdown += `<a href="${link}" target="_blank" rel="noreferrer">\n`;
    markdown += `  <picture>\n`;
    if (profile.darkPath) {
      markdown += `    <source media="(prefers-color-scheme: dark)" srcset="${profile.darkPath}" />\n`;
      markdown += `    <source media="(prefers-color-scheme: light)" srcset="${profile.path}" />\n`;
    }
    markdown += `    <img src="${profile.path}" width="32" height="32" alt="${escapeHtml(profile.label)}" title="${escapeHtml(profile.label)}" />\n`;
    markdown += `  </picture>\n`;
    markdown += `</a>`;
  }

  markdown += "\n</p>";

  return markdown;
}

/**
 * Render badges section
 */
function renderBadges(
  badges: ProfileJson["profile"]["badges"],
  socials: ProfileJson["profile"]["socials"]
): string | null {
  const badgeParts: string[] = [];

  // GitHub followers badge
  if (badges.githubFollowers.selected && socials.github?.linkSuffix) {
    badgeParts.push(
      `<a href="${socials.github.linkPrefix}${socials.github.linkSuffix}" target="_blank" rel="noreferrer"><img src="https://img.shields.io/github/followers/${socials.github.linkSuffix}?logo=github&style=for-the-badge&color=${badges.cardStyle.iconColor}&labelColor=${badges.cardStyle.bgColor}" /></a>`
    );
  }

  // Twitter followers badge
  if (badges.twitterFollowers.selected && socials.twitter?.linkSuffix) {
    badgeParts.push(
      `<a href="${socials.twitter.linkPrefix}${socials.twitter.linkSuffix}" target="_blank" rel="noreferrer"><img src="https://img.shields.io/twitter/follow/${socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=${badges.cardStyle.iconColor}&labelColor=${badges.cardStyle.bgColor}" /></a>`
    );
  }

  // Twitch status badge
  if (badges.twitchStatus.selected && socials.twitch?.linkSuffix) {
    badgeParts.push(
      `<a href="${socials.twitch.linkPrefix}${socials.twitch.linkSuffix}" target="_blank" rel="noreferrer"><img src="https://img.shields.io/twitch/status/${socials.twitch.linkSuffix}?logo=twitchsx&style=for-the-badge&color=${badges.cardStyle.iconColor}&labelColor=${badges.cardStyle.bgColor}&label=TWITCH+STATUS" /></a>`
    );
  }

  if (badgeParts.length === 0 && 
      !badges.githubStatsCard.selected &&
      !badges.githubCommitsGraph.selected &&
      !badges.githubStreak.selected &&
      !badges.topLangsCard.selected &&
      !badges.reposCard.selected) {
    return null;
  }

  let markdown = "";

  // Add top badges
  if (badgeParts.length > 0) {
    markdown += badgeParts.join("\n") + "\n\n";
  }

  // GitHub stats section
  const hasGitHubStats = badges.githubStatsCard.selected ||
    badges.githubCommitsGraph.selected ||
    badges.githubStreak.selected;

  if (hasGitHubStats && socials.github?.linkSuffix) {
    markdown += "### Badges\n\n";
    markdown += "<b>My GitHub Stats</b>\n\n";

    // GitHub stats card
    if (badges.githubStatsCard.selected) {
      const stats = badges.githubStatsCard;
      const hideParams: string[] = [];
      if (!stats.stars) hideParams.push("stars");
      if (!stats.commits) hideParams.push("commits");
      if (!stats.prs) hideParams.push("prs");
      if (!stats.issues) hideParams.push("issues");
      if (!stats.contribs) hideParams.push("contribs");
      if (!stats.privateCommits) hideParams.push("privateCommits");

      const hideQuery = hideParams.length > 0 ? `&hide=${hideParams.join(",")}` : "";
      const styleQuery = badges.cardStyle.hideBorder ? "&hide_border=true" : "";
      const showIconsQuery = badges.cardStyle.showIcons ? "&show_icons=true" : "";
      const colorQuery = `&title_color=${badges.cardStyle.titleColor}&text_color=${badges.cardStyle.textColor}&icon_color=${badges.cardStyle.iconColor}&bg_color=${badges.cardStyle.bgColor}`;

      markdown += `<a href="http://www.github.com/${socials.github.linkSuffix}"><img src="https://github-readme-stats.vercel.app/api?username=${socials.github.linkSuffix}${hideQuery}${styleQuery}${showIconsQuery}${colorQuery}" /></a>\n\n`;
    }

    // GitHub commits graph
    if (badges.githubCommitsGraph.selected) {
      markdown += `<a href="http://www.github.com/${socials.github.linkSuffix}"><img src="https://github-readme-activity-graph.vercel.app/graph?username=${socials.github.linkSuffix}&theme=${badges.cardStyle.bgColor}" /></a>\n\n`;
    }

    // GitHub streak
    if (badges.githubStreak.selected) {
      const styleQuery = badges.cardStyle.hideBorder ? "&hide_border=true" : "";
      const colorQuery = `&ring=${badges.cardStyle.iconColor}&fire=${badges.cardStyle.iconColor}&currStreakLabel=${badges.cardStyle.textColor}&currStreakNum=${badges.cardStyle.textColor}&sideLabels=${badges.cardStyle.textColor}&sideNums=${badges.cardStyle.textColor}&dates=${badges.cardStyle.textColor}&bg_color=${badges.cardStyle.bgColor}`;
      markdown += `<a href="http://www.github.com/${socials.github.linkSuffix}"><img src="https://github-readme-streak-stats.demolab.com/?user=${socials.github.linkSuffix}${styleQuery}${colorQuery}" /></a>\n\n`;
    }
  }

  // Top languages card
  if (badges.topLangsCard.selected && socials.github?.linkSuffix) {
    const styleQuery = badges.cardStyle.hideBorder ? "&hide_border=true" : "";
    const colorQuery = `&title_color=${badges.cardStyle.titleColor}&text_color=${badges.cardStyle.textColor}&icon_color=${badges.cardStyle.iconColor}&bg_color=${badges.cardStyle.bgColor}`;
    markdown += `<a href="http://www.github.com/${socials.github.linkSuffix}"><img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${socials.github.linkSuffix}${styleQuery}${colorQuery}" /></a>\n\n`;
  }

  // Repos card
  if (badges.reposCard.selected && socials.github?.linkSuffix) {
    const repos = [
      badges.reposCard.repoOne,
      badges.reposCard.repoTwo,
      badges.reposCard.repoThree,
      badges.reposCard.repoFour,
    ].filter(Boolean);

    if (repos.length > 0) {
      const styleQuery = badges.cardStyle.hideBorder ? "&hide_border=true" : "";
      const colorQuery = `&title_color=${badges.cardStyle.titleColor}&text_color=${badges.cardStyle.textColor}&icon_color=${badges.cardStyle.iconColor}&bg_color=${badges.cardStyle.bgColor}`;
      markdown += `<a href="http://www.github.com/${socials.github.linkSuffix}"><img src="https://github-readme-stats.vercel.app/api/pin/?username=${socials.github.linkSuffix}&repo=${repos[0]}${styleQuery}${colorQuery}" /></a>\n\n`;
    }
  }

  return markdown.trim() || null;
}

/**
 * Render support section
 */
function renderSupport(support: ProfileJson["profile"]["support"]): string | null {
  const activeSupport = Object.entries(support).filter(
    ([_, profile]) => profile.linkSuffix && profile.linkSuffix.trim() !== ""
  );

  if (activeSupport.length === 0) {
    return null;
  }

  let markdown = "### Support Me\n\n";
  markdown += "<p align=\"left\">\n";

  for (const [key, profile] of activeSupport) {
    const link = `${profile.linkPrefix}${profile.linkSuffix}`;
    markdown += `<a href="${link}" target="_blank" rel="noreferrer"><img src="${profile.previewIMG}" alt="${escapeHtml(key)}" /></a>`;
  }

  markdown += "\n</p>";

  return markdown;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
