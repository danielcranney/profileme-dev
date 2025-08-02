import { useEffect, useState } from "react";
import { SKILL_CATEGORIES } from "../lib/constants/skillCategories";
import { supportStore } from "../lib/constants/supportStore";
import { SOCIAL_PLATFORMS } from "../lib/constants/socialPlatforms";
import { BADGE_CONFIG } from "../lib/constants/badgeConfig";
let TurndownService = require("turndown").default;

export const useMarkdownGeneration = (state, mounted, theme) => {
  const [renderedMarkdown, setRenderedMarkdown] = useState({
    introduction: "",
    skillsTitle: "",
    skills: Object.fromEntries(
      SKILL_CATEGORIES.map((category) => [category.name, []])
    ),
    socials: SOCIAL_PLATFORMS,
    badges: BADGE_CONFIG,
    support: Object.keys(supportStore).reduce(
      (obj, key) => ({
        ...obj,
        [key]: "",
      }),
      {}
    ),
  });

  // Update Markdown
  useEffect(() => {
    if (!mounted) return;

    var turndownService = new TurndownService();
    turndownService.addRule("pRemoval", {
      filter: "p",
      replacement: function (content) {
        return "\n" + content + "\n\n";
      },
    });

    const sectionsRefs = [
      { ref: "introduction", title: "introduction" },
      { ref: "skillsTitle", title: "skillsTitle" },
      { ref: "skills", title: "skills" },
      { ref: "socialsTitle", title: "socialsTitle" },
      { ref: "socials", title: "socials" },
      { ref: "badgesTitle", title: "badgesTitle" },
      { ref: "badges", title: "badges" },
      { ref: "support", title: "support" },
    ];

    sectionsRefs.forEach((section) => {
      if (
        section.title === "skills" ||
        section.title === "socials" ||
        section.title === "badges" ||
        section.title === "support"
      ) {
        // Add safety check for state[section.title]
        if (state[section.title]) {
          Object.entries(state[section.title]).forEach((entry) => {
            const [key, value] = entry;

            setRenderedMarkdown((renderedMarkdown) => ({
              ...renderedMarkdown,
              [section.title]: {
                ...renderedMarkdown[section.title],
                [key]: state[section.title][key],
              },
            }));
          });
        }
      }
    });
  }, [state, mounted]);

  const buildMarkdownSkill = (category) => {
    return (
      <>
        {category.map((icon) => (
          <>
            <span key={`${icon.path}`}>
              {icon.darkPath ? (
                <>{`<a href="${
                  icon.link
                }" target="_blank" rel="noreferrer"><img src="${
                  theme == "dark" ? icon.darkPath : icon.path
                }" width="36" height="36" alt="${icon.name}" title="${
                  icon.name
                }"/></a>`}</>
              ) : (
                <>{`<a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" title="${icon.name}"/></a>`}</>
              )}
            </span>
          </>
        ))}
      </>
    );
  };

  return {
    renderedMarkdown,
    buildMarkdownSkill,
  };
};
