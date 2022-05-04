import React, { useEffect, useContext, useRef, useState } from "react";
import { useTheme } from "next-themes";
// Import state and actions
import { ACTIONS } from "./_app";
import { StateContext } from "./_app";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { colorStore } from "./_app";
let TurndownService = require("turndown").default;
// Import components
import Introduction from "../components/sections/Introduction";
import Skills from "../components/sections/Skills";
import Socials from "../components/sections/Socials";
import Badges from "../components/sections/Badges";
import Support from "../components/sections/Support";

export default function Home() {
  const { state, dispatch } = useContext(StateContext);
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const [renderedMarkdown, setRenderedMarkdown] = useState({
    introduction: "",
    skillsTitle: "",
    skills: {
      core: [],
      frontend: [],
      backend: [],
      other: [],
      software: [],
      web3: [],
    },
    socials: {
      behance: "",
      codepen: "",
      codesandbox: "",
      devdotto: "",
      discord: "",
      dribbble: "",
      facebook: "",
      github: "",
      hashnode: "",
      instagram: "",
      linkedin: "",
      polywork: "",
      medium: "",
      rss: "",
      stackoverflow: "",
      twitter: "",
      youtube: "",
    },
    badges: {
      twitterFollowers: false,
      twitchStatus: false,
      githubStatsCard: false,
      githubVisits: false,
      githubFollowers: false,
      githubCommitsGraph: false,
      githubStreak: false,
      topLangsCard: false,
      reposCard: false,
    },
    support: {
      buymeacoffee: "",
    },
  });
  const [socialsShowing, setSocialsShowing] = useState(false);
  const [badgesShowing, setBadgesShowing] = useState(false);
  const [copySuccess, setCopySuccess] = useState("Copy");

  // Section Refs
  const introductionRef = useRef(null);
  const skillsTitleRef = useRef(null);
  const skillsRef = useRef(null);
  const socialsTitleRef = useRef(null);
  const socialsRef = useRef(null);
  const badgesTitleRef = useRef(null);
  const badgesRef = useRef(null);
  const supportRef = useRef(null);

  // Markdown Container
  const markdownRef = useRef();

  // Scrollable Refs
  const introductionAnchorRef = useRef();
  const skillsAnchorRef = useRef();
  const socialsAnchorRef = useRef();
  const badgesAnchorRef = useRef();
  const supportAnchorRef = useRef();

  // Update Markdown
  useEffect(() => {
    if (!mounted) return;
    // If PreviewRef not showing, return
    if (!introductionRef.current) return;

    var turndownService = new TurndownService();
    turndownService.addRule("pRemoval", {
      filter: "p",
      replacement: function (content) {
        return "\n" + content + "\n\n";
      },
    });

    const sectionsRefs = [
      { ref: introductionRef, title: "introduction" },
      { ref: skillsTitleRef, title: "skillsTitle" },
      { ref: skillsRef, title: "skills" },
      { ref: socialsTitleRef, title: "socialsTitle" },
      { ref: socialsRef, title: "socials" },
      { ref: badgesTitleRef, title: "badgesTitle" },
      { ref: badgesRef, title: "badges" },
      { ref: supportRef, title: "support" },
    ];

    sectionsRefs.map((section, i) => {
      if (
        section.title === "skills" ||
        section.title === "socials" ||
        section.title === "badges" ||
        section.title === "support"
      ) {
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
      } else {
        let htmlOfElement = section.ref.current.innerHTML;
        setRenderedMarkdown((renderedMarkdown) => ({
          ...renderedMarkdown,
          [section.title]: turndownService.turndown(htmlOfElement),
        }));
      }
    });
  }, [state]);

  useEffect(() => {
    if (!mounted) return;
    let linkSuffixes = [];
    Object.entries(renderedMarkdown.socials).map((social) => {
      linkSuffixes.push(social[1].linkSuffix);
    });

    // True is ANY linkSuffixes are filled
    setSocialsShowing(
      linkSuffixes.some(
        (x) => x !== null && x !== "" && typeof x !== "undefined"
      )
    );
  }, [renderedMarkdown.socials]);

  useEffect(() => {
    if (!mounted) return;

    let badgesList = [];
    if (badgesRef.current) {
      badgesRef.current = false;
    } else {
      Object.entries(renderedMarkdown.badges).map((badge) => {
        badgesList.push(badge[1].selected);
      });
    }
    // True is ANY badges are switched on are filled
    if (badgesList.length > 0) {
      setBadgesShowing(badgesList.some((x) => x !== null && x !== false));
    } else {
      setBadgesShowing(false);
    }

    // setBadgesShowing;
  }, [renderedMarkdown.badges]);

  useEffect(() => {
    state.sidebarOpen
      ? disableBodyScroll(document)
      : enableBodyScroll(document);
  }, [state.sidebarOpen]);

  useEffect(() => {
    if (state.section == "introduction") {
      executeScroll(introductionAnchorRef);
    } else if (state.section == "skills") {
      executeScroll(skillsAnchorRef);
    } else if (state.section == "socials") {
      executeScroll(socialsAnchorRef);
    } else if (state.section == "badges") {
      executeScroll(badgesAnchorRef);
    } else if (state.section == "support") {
      executeScroll(supportAnchorRef);
    } else return;
  }, [state.section]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const executeScroll = (ref) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("Copied");
      setTimeout(() => {
        setCopySuccess("Copy");
      }, 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  const handleBadgeToggle = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_BADGE,
      payload: {
        title: e.target.name,
      },
    });
  };

  const handleBadgeElementToggle = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_GITHUB_STATS,
      payload: {
        keyToHide: e.currentTarget.name,
      },
    });
  };

  const handleStyleBadge = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_STYLE_COLOR,
      payload: {
        keyToToggle: e.currentTarget.name,
      },
    });
  };

  const handleChangeBadgeColor = (e, badgeKeyToHide, color) => {
    dispatch({
      type: ACTIONS.STYLE_BADGES,
      payload: {
        keyToStyle: e.target.name,
        keyToToggle: badgeKeyToHide,
        color: color.hex,
      },
    });
  };

  const handleIconToggle = (iconCategory, iconObj, i) => {
    if (state.skills[iconCategory].includes(iconObj)) {
      const iconToRemove = state.skills[iconCategory].indexOf(iconObj);
      if (iconToRemove > -1) {
        dispatch({
          type: ACTIONS.REMOVE_SKILL,
          payload: {
            type: iconCategory,
            icon: iconObj,
          },
        });
      }
    } else {
      dispatch({
        type: ACTIONS.ADD_SKILL,
        payload: {
          type: iconCategory,
          icon: iconObj,
          position: i,
        },
      });
    }
  };

  return (
    <>
      {/* COLUMN 2 - INPUTS */}
      <section
        className={`input-column-wrapper ${
          state.sidebarOpen ? "ml-0 md:ml-64 " : ""
        }`}
      >
        {/* Section Displays */}
        {state.section === "introduction" ? (
          <Introduction ref={introductionAnchorRef} />
        ) : state.section === "skills" ? (
          <Skills ref={skillsAnchorRef} handleIconToggle={handleIconToggle} />
        ) : state.section === "socials" ? (
          <Socials ref={socialsAnchorRef} />
        ) : state.section === "badges" ? (
          <Badges
            ref={badgesAnchorRef}
            colorStore={colorStore}
            handleStyleBadge={handleStyleBadge}
            handleChangeBadgeColor={handleChangeBadgeColor}
            handleBadgeToggle={handleBadgeToggle}
            handleBadgeElementToggle={handleBadgeElementToggle}
            badgesShowing={badgesShowing}
          />
        ) : state.section === "support" ? (
          <Support ref={supportAnchorRef} />
        ) : null}
      </section>
      {/* COLUMN 3 - PREVIEW & MARKDOWN */}
      <section className="preview-column-wrapper">
        {/* Preview, Markdown and Copy Buttons */}
        <div className="buttons-wrapper">
          <button
            id="PreviewButton"
            onClick={() => {
              dispatch({
                type: ACTIONS.SELECT_RENDER_MODE,
                payload: "preview",
              });
            }}
            className={`btn-sm ${
              state.renderMode === "preview" ? "btn-brand" : "btn-gray"
            }`}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            Preview
          </button>

          <button
            id="MarkdownButton"
            onClick={() => {
              dispatch({
                type: ACTIONS.SELECT_RENDER_MODE,
                payload: "markdown",
              });
            }}
            className={`btn-sm mr-auto ${
              state.renderMode === "markdown" ? "btn-brand" : "btn-gray"
            }`}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
            Markdown
          </button>

          <button
            className={`btn-sm ${
              copySuccess !== "Copy" ? "btn-brand" : "btn-gray"
            }`}
            onClick={() => {
              dispatch({
                type: ACTIONS.SELECT_RENDER_MODE,
                payload: "markdown",
              });
              copyToClipBoard(markdownRef.current.innerText);
              dispatch({
                type: ACTIONS.TOGGLE_COPY_MODAL,
                payload: true,
              });
            }}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
            </svg>
            {copySuccess}
          </button>
        </div>

        {/* Preview Section */}
        <article
          id="preview-container"
          className={`${
            state.renderMode === "preview" ? "relative" : "hidden"
          }`}
        >
          {/* Introduce Section Preview */}
          <div
            ref={introductionRef}
            className={`${
              state.introduction.name ||
              state.introduction.shortDescription ||
              state.introduction.longDescription ||
              state.introduction.location ||
              (state.introduction.workingOnTitle &&
                state.introduction.workingOnLink) ||
              (state.introduction.portfolioTitle &&
                state.introduction.portfolioLink) ||
              state.introduction.emailMe ||
              state.introduction.learning ||
              state.introduction.collaborateOn ||
              state.introduction.additionalInfo
                ? "mb-4"
                : ""
            }`}
          >
            {!state.introduction.name ? null : (
              <h1>Hi 👋 My name is {state.introduction.name}</h1>
            )}
            {state.introduction.shortDescription ? (
              <h2>{state.introduction.shortDescription}</h2>
            ) : null}

            {state.introduction.longDescription ? (
              <p className="whitespace-pre-line">
                {state.introduction.longDescription}
              </p>
            ) : null}

            <ul
              className={`${
                state.introduction.location ||
                (state.introduction.workingOnTitle &&
                  state.introduction.workingOnLink) ||
                (state.introduction.portfolioTitle &&
                  state.introduction.portfolioLink) ||
                state.introduction.learning ||
                state.introduction.emailMe ||
                state.introduction.collaborateOn ||
                state.introduction.additionalInfo
                  ? "mt-4 "
                  : ""
              }list-disc list-inside`}
            >
              {state.introduction.location ? (
                <li>
                  🌍&nbsp; I&apos;m based in {state.introduction.location}
                </li>
              ) : null}
              {state.introduction.portfolioTitle &&
              state.introduction.portfolioLink ? (
                <li>
                  🖥️&nbsp; See my portfolio at{" "}
                  <a
                    href={`http://${state.introduction.portfolioLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {state.introduction.portfolioTitle}
                  </a>
                </li>
              ) : null}
              {state.introduction.emailMe ? (
                <li>
                  ✉️&nbsp; You can contact me at{" "}
                  <a href={`mailto:${state.introduction.emailMe}`}>
                    {state.introduction.emailMe}
                  </a>
                </li>
              ) : null}
              {state.introduction.workingOnTitle &&
              state.introduction.workingOnLink ? (
                <li>
                  🚀&nbsp; I&apos;m currently working on{" "}
                  <a
                    href={`http://${state.introduction.workingOnLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {state.introduction.workingOnTitle}
                  </a>
                </li>
              ) : null}
              {state.introduction.learning ? (
                <li>
                  🧠&nbsp; I&apos;m learning {state.introduction.learning}
                </li>
              ) : null}
              {state.introduction.collaborateOn ? (
                <li>
                  🤝&nbsp; I&apos;m open to collaborating on{" "}
                  {state.introduction.collaborateOn}
                </li>
              ) : null}
              {state.introduction.additionalInfo ? (
                <li>⚡&nbsp; {state.introduction.additionalInfo}</li>
              ) : null}
            </ul>
          </div>

          {/* GitHub, Twitter and Titch Badges */}
          <div
            className={`flex flex-wrap gap-x-2 gap-y-2 ${
              state.badges.githubFollowers.selected ||
              state.badges.twitterFollowers.selected
                ? "mb-4"
                : "mb-0"
            }`}
          >
            {state.badges.githubFollowers.selected ? (
              <img
                src={`https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
                className="object-scale-down"
              />
            ) : null}
            {state.badges.twitterFollowers.selected ? (
              <img
                src={`https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
                className="object-scale-down"
              />
            ) : null}
            {state.badges.twitchStatus.selected ? (
              <img
                src={`https://img.shields.io/twitch/status/${state.socials.twitch.linkSuffix}?logo=twitchsx&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}&label=TWITCH+STATUS`}
                className="object-scale-down"
              />
            ) : null}
          </div>

          {/* Skills Section Preview */}
          <div ref={skillsTitleRef} className="flex">
            {state.skills.core.length === 0 &&
            state.skills.frontend.length === 0 &&
            state.skills.backend.length === 0 &&
            state.skills.other.length === 0 &&
            state.skills.software.length === 0 &&
            state.skills.web3.length === 0 ? null : (
              <h3>Skills</h3>
            )}
          </div>

          {/* Skills Section Preview */}
          <div
            ref={skillsRef}
            className={`flex flex-wrap gap-y-1.5 gap-x-1.5 ${
              state.skills.core.length < 1 &&
              state.skills.frontend.length < 1 &&
              state.skills.backend.length < 1 &&
              state.skills.other.length < 1 &&
              state.skills.software.length < 1 &&
              state.skills.web3.length < 1
                ? "mb-0"
                : "mb-4"
            }`}
          >
            {/* Core Icons Display */}
            {!state.skills.core || state.skills.core.length < 1 ? null : (
              <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                {state.skills.core.map((icon) => {
                  return (
                    <div key={`${icon.path}`} className="relative">
                      <a href={`${icon.link}`} target="_blank" rel="noreferrer">
                        {icon.darkPath ? (
                          <img
                            src={
                              theme == "dark"
                                ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored-dark.svg`
                                : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`
                            }
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        ) : (
                          <img
                            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Frontend Icons Display */}
            {!state.skills.frontend ||
            state.skills.frontend.length < 1 ? null : (
              <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                {state.skills.frontend.map((icon) => {
                  return (
                    <div key={`${icon.path}`} className="relative">
                      <a href={`${icon.link}`} target="_blank" rel="noreferrer">
                        {icon.darkPath ? (
                          <img
                            src={
                              theme == "dark"
                                ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored-dark.svg`
                                : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`
                            }
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        ) : (
                          <img
                            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Backend Icons Display */}
            {!state.skills.backend || state.skills.backend.length < 1 ? null : (
              <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                {state.skills.backend.map((icon) => {
                  return (
                    <div key={`${icon.path}`} className="relative">
                      <a href={`${icon.link}`} target="_blank" rel="noreferrer">
                        {icon.darkPath ? (
                          <img
                            src={
                              theme == "dark"
                                ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored-dark.svg`
                                : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`
                            }
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        ) : (
                          <img
                            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Other Icons Display */}
            {!state.skills.other || state.skills.other.length < 1 ? null : (
              <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                {state.skills.other.map((icon) => {
                  return (
                    <div key={`${icon.path}`} className="relative">
                      <a href={`${icon.link}`} target="_blank" rel="noreferrer">
                        {icon.darkPath ? (
                          <img
                            src={
                              theme == "dark"
                                ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored-dark.svg`
                                : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`
                            }
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        ) : (
                          <img
                            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Software Icons Display */}
            {!state.skills.software ||
            state.skills.software.length < 1 ? null : (
              <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                {state.skills.software.map((icon) => {
                  return (
                    <div key={`${icon.path}`} className="relative">
                      <a href={`${icon.link}`} target="_blank" rel="noreferrer">
                        {icon.darkPath ? (
                          <img
                            src={
                              theme == "dark"
                                ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored-dark.svg`
                                : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`
                            }
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        ) : (
                          <img
                            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Web3 Icons Display */}
            {!state.skills.web3 || state.skills.web3.length < 1 ? null : (
              <div className="flex gap-x-1.5 flex-wrap gap-y-1.5">
                {state.skills.web3.map((icon) => {
                  return (
                    <div key={`${icon.path}`} className="relative">
                      <a href={`${icon.link}`} target="_blank" rel="noreferrer">
                        {icon.darkPath ? (
                          <img
                            src={
                              theme == "dark"
                                ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored-dark.svg`
                                : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`
                            }
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        ) : (
                          <img
                            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${icon.iTag}-colored.svg`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Socials Title Preview */}
          <div ref={socialsTitleRef} className="flex">
            {socialsShowing ? <h3>Socials</h3> : null}
          </div>

          {/* Socials Section Preview */}
          <div
            ref={socialsRef}
            className={`flex flex-wrap gap-x-2 gap-y-2 ${
              socialsShowing ? "mb-4" : ""
            }`}
          >
            {Object.entries(state.socials).map((profile) => {
              return profile[1].linkSuffix ? (
                <a
                  key={`${profile[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  href={`${profile[1].linkPrefix}${profile[1].linkSuffix}${
                    profile[1].linkSuffixTwo
                      ? `${profile[1].linkSuffixTwo}`
                      : ""
                  }`}
                >
                  <img
                    height="32"
                    width="32"
                    src={
                      profile[1].darkPath
                        ? theme == "dark"
                          ? `${profile[1].darkPath}`
                          : `${profile[1].path}`
                        : `${profile[1].path}`
                    }
                  />
                </a>
              ) : null;
            })}
          </div>

          <div ref={badgesTitleRef} className="flex">
            {badgesShowing ? <h3>Badges</h3> : null}
          </div>

          {/* Badges Section Preview */}
          <div
            ref={badgesRef}
            className="flex flex-col items-start gap-x-2 gap-y-2"
          >
            {state.badges.githubStatsCard.selected ||
            state.badges.githubCommitsGraph.selected ||
            state.badges.githubStreak.selected ||
            state.badges.topLangsCard.selected ? (
              <p className="font-bold">My GitHub Stats</p>
            ) : null}

            {state.badges.githubStatsCard.selected ? (
              <a
                href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${
                    state.socials.github.linkSuffix
                  }&hide=${state.badges.githubStatsCard.stars ? "" : "stars,"}${
                    state.badges.githubStatsCard.commits ? "" : "commits,"
                  }${state.badges.githubStatsCard.prs ? "" : "prs,"}${
                    state.badges.githubStatsCard.issues ? "" : "issues,"
                  }${state.badges.githubStatsCard.contribs ? "" : "contribs"}${
                    state.badges.githubStatsCard.privateCommits
                      ? "&count_private=true"
                      : ""
                  }&title_color=${
                    state.badges.cardStyle.titleColor
                  }&text_color=${state.badges.cardStyle.textColor}&icon_color=${
                    state.badges.cardStyle.iconColor
                  }&bg_color=${
                    state.badges.cardStyle.bgColor
                  }&hide_border=true&border_radius=0&show_icons=true`}
                  className="object-scale-down"
                />
              </a>
            ) : null}

            {state.badges.githubStreak.selected ? (
              <a
                href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${state.socials.github.linkSuffix}&stroke=${state.badges.cardStyle.textColor}&background=${state.badges.cardStyle.bgColor}&ring=${state.badges.cardStyle.titleColor}&fire=${state.badges.cardStyle.titleColor}&currStreakNum=${state.badges.cardStyle.textColor}&currStreakLabel=${state.badges.cardStyle.titleColor}&sideNums=${state.badges.cardStyle.textColor}&sideLabels=${state.badges.cardStyle.textColor}&dates=${state.badges.cardStyle.textColor}&hide_border=true`}
                  className="object-scale-down"
                />
              </a>
            ) : null}

            {state.badges.githubCommitsGraph.selected ? (
              <a
                href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://activity-graph.herokuapp.com/graph?username=${state.socials.github.linkSuffix}&bg_color=${state.badges.cardStyle.bgColor}&color=${state.badges.cardStyle.textColor}&line=${state.badges.cardStyle.iconColor}&point=${state.badges.cardStyle.textColor}&area_color=${state.badges.cardStyle.bgColor}&area=true&hide_border=true&custom_title=GitHub%20Commits%20Graph`}
                />
              </a>
            ) : null}

            {state.badges.topLangsCard.selected ? (
              <a
                href={`http://www.github.com/${state.socials.github.linkSuffix}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=danielcranney&langs_count=10&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en&custom_title=Top%20%Languages`}
                />
              </a>
            ) : null}

            {/* Repo Cards */}
            {state.badges.reposCard.selected ? (
              <>
                <p className="mt-2 font-bold text-dark-300">Top Repositories</p>
                <div className="grid grid-cols-2 gap-4">
                  {state.badges.reposCard.repoOne ? (
                    <a
                      href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoOne}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoOne}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                      />
                    </a>
                  ) : (
                    <span className="text-sm">
                      Please enter a repository name.
                    </span>
                  )}

                  {state.badges.reposCard.repoTwo ? (
                    <a
                      href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoTwo}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoTwo}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                      />
                    </a>
                  ) : null}

                  {state.badges.reposCard.repoThree ? (
                    <a
                      href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoThree}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoThree}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                      />
                    </a>
                  ) : null}

                  {state.badges.reposCard.repoFour ? (
                    <a
                      href={`https://www.github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoFour}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={`https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoFour}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                      />
                    </a>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <div
            ref={supportRef}
            className={`flex flex-col gap-x-2 gap-y-2 ${
              state.support.buymeacoffee.linkSuffix ? "mt-4" : ""
            }`}
          >
            {state.support.buymeacoffee.linkSuffix ? (
              <>
                <h3>Support</h3>
                <a
                  href={`${state.support.buymeacoffee.linkPrefix}${state.support.buymeacoffee.linkSuffix}`}
                >
                  <img
                    src={`https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png`}
                    className="object-scale-down"
                    width="150"
                  />
                </a>
              </>
            ) : null}
          </div>
        </article>

        {/* Markdown Section Preview */}
        <article
          id="markdown-container"
          ref={markdownRef}
          className={`${
            state.renderMode === "markdown" ? "relative" : "hidden"
          }`}
        >
          {!renderedMarkdown ? (
            <div>You have not rendered any code yet</div>
          ) : (
            <>
              {renderedMarkdown.introduction ? (
                <p className="text-xs whitespace-pre-line">
                  {renderedMarkdown.introduction}
                </p>
              ) : null}

              {!renderedMarkdown.badges.twitterFollowers.selected ? null : (
                <span className="text-xs break-all whitespace-pre-line">
                  {`<a href="${state.socials.twitter.linkPrefix}${state.socials.twitter.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}"
                /></a>`}
                </span>
              )}
              {!renderedMarkdown.badges.githubFollowers.selected ? null : (
                <span className="text-xs break-all whitespace-pre-line">
                  {`<a href="${state.socials.github.linkPrefix}${state.socials.github.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}" /></a>`}
                </span>
              )}
              {!renderedMarkdown.badges.twitchStatus.selected ? null : (
                <span className="text-xs break-all whitespace-pre-line">
                  {`<a href="${state.socials.twitch.linkPrefix}${state.socials.twitch.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/twitch/status/${state.socials.twitch.linkSuffix}?logo=twitchsx&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}&label=TWITCH+STATUS" /></a>`}
                </span>
              )}

              {renderedMarkdown.skillsTitle ? (
                <p className="mt-4 whitespace-pre-line">{`### Skills`}</p>
              ) : null}

              <div className="break-all whitespace-pre-line">
                {renderedMarkdown.skills.core.length < 1 &&
                renderedMarkdown.skills.frontend.length < 1 &&
                renderedMarkdown.skills.backend.length < 1 &&
                renderedMarkdown.skills.other.length < 1 &&
                renderedMarkdown.skills.software.length < 1 &&
                renderedMarkdown.skills.web3.length < 1 ? null : (
                  <span>{`<p align="left">`}</span>
                )}

                {renderedMarkdown.skills.core.length > 0 ? (
                  <>
                    {renderedMarkdown.skills.core.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {icon.darkPath ? (
                            <>{`
                                <a href="${
                                  icon.link
                                }" target="_blank" rel="noreferrer"><img src="${
                              theme == "dark" ? icon.darkPath : icon.path
                            }" width="36" height="36" alt="${
                              icon.name
                            }" /></a>`}</>
                          ) : (
                            <>{`
                                <a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}</>
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : null}

                {renderedMarkdown.skills.frontend.length > 0 ? (
                  <>
                    {renderedMarkdown.skills.frontend.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {icon.darkPath ? (
                            <>{`
                                <a href="${
                                  icon.link
                                }" target="_blank" rel="noreferrer"><img src="${
                              theme == "dark" ? icon.darkPath : icon.path
                            }" width="36" height="36" alt="${
                              icon.name
                            }" /></a>`}</>
                          ) : (
                            <>{`
                                <a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}</>
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : null}

                {renderedMarkdown.skills.backend.length > 0 ? (
                  <>
                    {renderedMarkdown.skills.backend.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {icon.darkPath ? (
                            <>{`
                                <a href="${
                                  icon.link
                                }" target="_blank" rel="noreferrer"><img src="${
                              theme == "dark" ? icon.darkPath : icon.path
                            }" width="36" height="36" alt="${
                              icon.name
                            }" /></a>`}</>
                          ) : (
                            <>{`
                                <a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}</>
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : null}

                {renderedMarkdown.skills.other.length > 0 ? (
                  <>
                    {renderedMarkdown.skills.other.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {icon.darkPath ? (
                            <>{`
                                <a href="${
                                  icon.link
                                }" target="_blank" rel="noreferrer"><img src="${
                              theme == "dark" ? icon.darkPath : icon.path
                            }" width="36" height="36" alt="${
                              icon.name
                            }" /></a>`}</>
                          ) : (
                            <>{`
                                <a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}</>
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : null}

                {renderedMarkdown.skills.software.length > 0 ? (
                  <>
                    {renderedMarkdown.skills.software.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {icon.darkPath ? (
                            <>{`
                                <a href="${
                                  icon.link
                                }" target="_blank" rel="noreferrer"><img src="${
                              theme == "dark" ? icon.darkPath : icon.path
                            }" width="36" height="36" alt="${
                              icon.name
                            }" /></a>`}</>
                          ) : (
                            <>{`
                                <a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}</>
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : null}

                {renderedMarkdown.skills.web3.length > 0 ? (
                  <>
                    {renderedMarkdown.skills.web3.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {icon.darkPath ? (
                            <>{`
                                <a href="${
                                  icon.link
                                }" target="_blank" rel="noreferrer"><img src="${
                              theme == "dark" ? icon.darkPath : icon.path
                            }" width="36" height="36" alt="${
                              icon.name
                            }" /></a>`}</>
                          ) : (
                            <>{`
                                <a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}</>
                          )}
                        </span>
                      );
                    })}
                  </>
                ) : null}

                {renderedMarkdown.skills.core.length < 1 &&
                renderedMarkdown.skills.frontend.length < 1 &&
                renderedMarkdown.skills.backend.length < 1 &&
                renderedMarkdown.skills.other.length < 1 &&
                renderedMarkdown.skills.software.length < 1 &&
                renderedMarkdown.skills.web3.length < 1 ? null : (
                  <span>{`
                    </p>
                    `}</span>
                )}
              </div>

              {socialsShowing ? (
                <span className="mt-4 whitespace-pre-line">{`
                  ### Socials
                  
                  `}</span>
              ) : null}

              {socialsShowing ? (
                <span>{`
                <p align="left">`}</span>
              ) : null}
              {Object.entries(renderedMarkdown.socials).map((profile) => {
                return profile[1].linkSuffix ? (
                  <span key={`profile-${profile[0]}`}>
                    {`
                          
                      <a href="${profile[1].linkPrefix}${
                      profile[1].linkSuffix
                    }" target="_blank" rel="noreferrer"><img src="${
                      profile[1].darkPath
                        ? theme == "dark"
                          ? `${profile[1].darkPath}`
                          : `${profile[1].path}`
                        : `${profile[1].path}`
                    }" width="32" height="32" /></a>`}
                  </span>
                ) : null;
              })}
              {socialsShowing ? <span>{`</p>`}</span> : null}

              {badgesShowing ? (
                <p className="mt-4 break-all whitespace-pre-line">{`### Badges`}</p>
              ) : null}

              {renderedMarkdown.badges.githubStatsCard.selected ||
              renderedMarkdown.badges.githubCommitsGraph.selected ||
              renderedMarkdown.badges.githubStreak.selected ? (
                <p className="break-all whitespace-pre-line">{`<b>My GitHub Stats</b>`}</p>
              ) : null}
              {!renderedMarkdown.badges.githubStatsCard.selected ? null : (
                <p className="mb-0 break-all">
                  {`<a
                      href="http://www.github.com/${
                        state.socials.github.linkSuffix
                      }"><img src="https://github-readme-stats.vercel.app/api?username=${
                    state.socials.github.linkSuffix
                  }&show_icons=true&hide=${
                    state.badges.githubStatsCard.stars ? "" : "stars,"
                  }${state.badges.githubStatsCard.commits ? "" : "commits,"}${
                    state.badges.githubStatsCard.prs ? "" : "prs,"
                  }${state.badges.githubStatsCard.issues ? "" : "issues,"}${
                    state.badges.githubStatsCard.contribs ? "" : "contribs"
                  }${
                    state.badges.githubStatsCard.privateCommits
                      ? "&count_private=true"
                      : ""
                  }&title_color=${
                    state.badges.cardStyle.titleColor
                  }&text_color=${state.badges.cardStyle.textColor}&icon_color=${
                    state.badges.cardStyle.iconColor
                  }&bg_color=${
                    state.badges.cardStyle.bgColor
                  }&hide_border=true&show_icons=true" alt="${
                    state.socials.github.linkSuffix
                  }'s GitHub stats" /></a>`}
                </p>
              )}

              {!renderedMarkdown.badges.githubStreak.selected ? null : (
                <p className="mb-0 break-all">
                  {`<a
                      href="http://www.github.com/${state.socials.github.linkSuffix}"><img
                  src="https://github-readme-streak-stats.herokuapp.com/?user=${state.socials.github.linkSuffix}&stroke=${state.badges.cardStyle.textColor}&background=${state.badges.cardStyle.bgColor}&ring=${state.badges.cardStyle.titleColor}&fire=${state.badges.cardStyle.titleColor}&currStreakNum=${state.badges.cardStyle.textColor}&currStreakLabel=${state.badges.cardStyle.titleColor}&sideNums=${state.badges.cardStyle.textColor}&sideLabels=${state.badges.cardStyle.textColor}&dates=${state.badges.cardStyle.textColor}&hide_border=true" /></a>`}
                </p>
              )}

              {!renderedMarkdown.badges.githubCommitsGraph.selected ? null : (
                <p className="mb-0 break-all">
                  {`<a
                      href="http://www.github.com/${state.socials.github.linkSuffix}"><img src="https://activity-graph.herokuapp.com/graph?username=${state.socials.github.linkSuffix}&bg_color=${state.badges.cardStyle.bgColor}&color=${state.badges.cardStyle.textColor}&line=${state.badges.cardStyle.iconColor}&point=${state.badges.cardStyle.textColor}&area_color=${state.badges.cardStyle.bgColor}&area=true&hide_border=true&custom_title=GitHub%20Commits%20Graph" alt="GitHub Commits Graph" /></a>`}
                </p>
              )}

              {!renderedMarkdown.badges.topLangsCard.selected ? null : (
                <p className="mb-0 break-all whitespace-pre-line">
                  {`<a href="https://github.com/${state.socials.github.linkSuffix}" align="left"><img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${state.socials.github.linkSuffix}&langs_count=10&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en&custom_title=Top%20%Languages" alt="Top Languages" /></a>`}
                </p>
              )}

              {renderedMarkdown.badges.reposCard.selected ? (
                <p className="mt-4 whitespace-pre-line">
                  {`<b>Top Repositories</b>`}
                </p>
              ) : null}

              <p className="mt-4 break-all whitespace-pre-line">
                {renderedMarkdown.badges.reposCard.selected ? (
                  <>{`<div width="100%" align="center">`}</>
                ) : null}

                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoOne ? (
                  <>
                    {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoOne}" align="left"><img align="left" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoOne}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                  </>
                ) : null}

                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoTwo ? (
                  <>
                    {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoTwo}" align="right"><img align="right" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoTwo}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                  </>
                ) : null}

                {renderedMarkdown.badges.reposCard.selected ? (
                  <>{`</div><br /><br /><br /><br /><br /><br /><br />`}</>
                ) : null}
              </p>

              <p className="mt-4 break-all whitespace-pre-line">
                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoThree ? (
                  <>{`<br /><br /><br /><br /><br />`}</>
                ) : null}
              </p>

              <p className="mt-4 break-all whitespace-pre-line">
                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoThree ? (
                  <>{`<div width="100%" align="center">`}</>
                ) : null}

                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoThree ? (
                  <>
                    {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoThree}" align="left"><img align="left" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoThree}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                  </>
                ) : null}

                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoFour ? (
                  <>
                    {`<a href="https://github.com/${state.socials.github.linkSuffix}/${state.badges.reposCard.repoFour}" align="right"><img align="right" width="45%" src="https://github-readme-stats.vercel.app/api/pin/?username=${state.socials.github.linkSuffix}&repo=${state.badges.reposCard.repoFour}&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en" /></a>`}
                  </>
                ) : null}

                {renderedMarkdown.badges.reposCard.selected &&
                state.badges.reposCard.repoThree ? (
                  <>{`</div>`}</>
                ) : null}
              </p>

              {!renderedMarkdown.support.buymeacoffee.linkSuffix ? null : (
                <>
                  <p className="mt-4 whitespace-pre-line">### Support Me</p>
                  {`<a
                  href="${state.support.buymeacoffee.linkPrefix}${state.support.buymeacoffee.linkSuffix}"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" width="200" /></a>`}
                </>
              )}
            </>
          )}
        </article>
      </section>
    </>
  );
}
