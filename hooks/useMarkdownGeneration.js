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
      if (section.title === "introduction") {
        // Process introduction section
        if (state.introduction) {
          // Create HTML structure for introduction
          let introductionHTML = "";

          if (state.introduction.name) {
            if (state.introduction.animatedHand === 0) {
              introductionHTML += `<h1>Hi 👋 My name is ${state.introduction.name}</h1>`;
            } else {
              introductionHTML += `<h1>Hi <span><img style="display: inline" height="36px" width="36px" src="https://user-images.githubusercontent.com/18350557/176309783-0785949b-9127-417c-8b55-ab5a4333674e.gif" /></span> My name is ${state.introduction.name}</h1>`;
            }
          }

          if (state.introduction.shortDescription) {
            introductionHTML += `<h2>${state.introduction.shortDescription}</h2>`;
          }

          if (state.introduction.longDescription) {
            introductionHTML += `<p>${state.introduction.longDescription.replace(
              /\n/g,
              "</p><p>"
            )}</p>`;
          }

          // Build list items
          const listItems = [];
          if (state.introduction.location) {
            listItems.push(
              `<li>🌍&nbsp; I'm based in ${state.introduction.location}</li>`
            );
          }
          if (
            state.introduction.portfolioTitle &&
            state.introduction.portfolioLink
          ) {
            listItems.push(
              `<li>🖥️&nbsp; See my portfolio at <a href="http://${state.introduction.portfolioLink}" target="_blank" rel="noreferrer">${state.introduction.portfolioTitle}</a></li>`
            );
          }
          if (state.introduction.emailMe) {
            listItems.push(
              `<li>✉️&nbsp; You can contact me at <a href="mailto:${state.introduction.emailMe}">${state.introduction.emailMe}</a></li>`
            );
          }
          if (
            state.introduction.workingOnTitle &&
            state.introduction.workingOnLink
          ) {
            listItems.push(
              `<li>🚀&nbsp; I'm currently working on <a href="http://${state.introduction.workingOnLink}" target="_blank" rel="noreferrer">${state.introduction.workingOnTitle}</a></li>`
            );
          }
          if (state.introduction.learning) {
            listItems.push(
              `<li>🧠&nbsp; I'm currently learning ${state.introduction.learning}</li>`
            );
          }
          if (state.introduction.collaborateOn) {
            listItems.push(
              `<li>👥&nbsp; I'm looking to collaborate on ${state.introduction.collaborateOn}</li>`
            );
          }
          if (state.introduction.additionalInfo) {
            listItems.push(
              `<li>💬&nbsp; Ask me about ${state.introduction.additionalInfo}</li>`
            );
          }

          if (listItems.length > 0) {
            introductionHTML += `<ul>${listItems.join("")}</ul>`;
          }

          // Convert HTML to markdown
          const markdown = turndownService.turndown(introductionHTML);

          setRenderedMarkdown((renderedMarkdown) => ({
            ...renderedMarkdown,
            introduction: markdown,
          }));
        }
      } else if (
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
        ))}
      </>
    );
  };

  return {
    renderedMarkdown,
    buildMarkdownSkill,
  };
};
