import React, { useEffect, useContext, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
// Import state and actions
import { ACTIONS } from "./_app";
import { StateContext } from "./_app";
// Import frontend icons
import { iconData } from "./_app";
// Import components
import { FormLabel } from "../components/FormLabel";
import { MenuItem } from "../components/MenuItem";
import { FormInput } from "../components/FormInput";
import SectionHeader from "../components/SectionHeader";
import { SocialInput } from "../components/SocialInput";
import { SocialArticle } from "../components/SocialArticle";
import { IntroductionArticle } from "../components/IntroductionArticle";
import { ExtraSmallTick } from "../components/ExtraSmallTick";
import { IconSelector } from "../components/IconSelector";
import { BadgeSelector } from "../components/BadgeSelector";
import { IntroductionArticleWithLink } from "../components/IntroductionArticleWithLink";
let TurndownService = require("turndown").default;

export default function Home() {
  const { state, dispatch } = useContext(StateContext);
  const [renderedMarkdown, setRenderedMarkdown] = useState({
    introduction: "",
    skillsTitle: "",
    skills: {
      core: [],
      frontend: [],
      backend: [],
      other: [],
      software: [],
    },
    socials: {
      behance: "",
      codesandbox: "",
      devdotto: "",
      discord: "",
      dribbble: "",
      facebook: "",
      github: "",
      hashnode: "",
      instagram: "",
      linkedin: "",
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
  const badgesRef = useRef(null);

  // Introduction refs
  const nameRef = useRef();
  const descriptionRef = useRef();
  const locationRef = useRef();
  const workingOnTitleRef = useRef();
  const workingOnLinkRef = useRef();
  const learningRef = useRef();
  const collaborateOnRef = useRef();
  const portfolioRef = useRef();
  const additionalInfoRef = useRef();

  // Socials refs
  const behanceRef = useRef();
  const codesandboxRef = useRef();
  const devdottoRef = useRef();
  const discordRef = useRef();
  const dribbbleRef = useRef();
  const facebookRef = useRef();
  const githubRef = useRef();
  const hashnodeRef = useRef();
  const instagramRef = useRef();
  const linkedinRef = useRef();
  const mediumRef = useRef();
  const rssRef = useRef();
  const stackoverflowRef = useRef();
  const twitchRef = useRef();
  const twitterRef = useRef();
  const youtubeRef = useRef();

  // Markdown Container
  const markdownRef = useRef();

  // Update Markdown
  useEffect(() => {
    console.log("The updated state is: ", state);

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
      { ref: badgesRef, title: "badges" },
    ];

    sectionsRefs.map((section, i) => {
      if (
        section.title === "skills" ||
        section.title === "socials" ||
        section.title === "badges"
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
    let linkSuffixes = [];
    Object.entries(renderedMarkdown.socials).map((social) => {
      linkSuffixes.push(social[1].linkSuffix);
      console.log(linkSuffixes);
    });

    console.log(
      linkSuffixes.some(
        (x) => x !== null && x !== "" && typeof x !== "undefined"
      )
    );

    // True is ANY linkSuffixes are filled
    setSocialsShowing(
      linkSuffixes.some(
        (x) => x !== null && x !== "" && typeof x !== "undefined"
      )
    );
  }, [renderedMarkdown.socials]);

  useEffect(() => {
    let badgesList = [];
    if (badgesRef.current) {
      badgesRef.current = false;
    } else {
      Object.entries(renderedMarkdown.badges).map((badge) => {
        badgesList.push(badge[1]);
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

  const handleBadgeClick = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_BADGE,
      payload: {
        title: e.target.name,
      },
    });
  };

  const handleIconToggle = (iconCategory, iconObj, i) => {
    if (state.skills[iconCategory].includes(iconObj)) {
      const iconToRemove = state.skills[iconCategory].indexOf(iconObj);
      if (iconToRemove > -1) {
        console.log(iconCategory);
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
    <main className="flex flex-col h-screen">
      <Head>
        <title>GitHub Profile Generator</title>
      </Head>
      <header className="flex items-center h-16 p-6 border-b bg-dark-800 border-dark-600">
        <svg
          className="w-6 h-6 mr-2 text-brand"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          ></path>
        </svg>
        <h1 className="mb-0 text-xl">
          ReadMe <span className="text-brand">Generator</span>
        </h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* COLUMN 1 - SIDEBAR */}
        <aside className="flex flex-col p-6 overflow-auto border-r bg-dark-800 w-72 border-dark-600">
          <p className="mb-4 text-xs font-semibold text-white uppercase">
            Sections
          </p>
          <ul className="menu">
            <MenuItem text={"Introduction"} section={"introduction"} />
            <MenuItem text={"Skills"} section={"skills"} />
            <MenuItem text={"Socials"} section={"socials"} />
            <MenuItem text={"Badges"} section={"badges"} />
          </ul>
        </aside>
        {/* COLUMN 2 - INPUTS */}
        <section className="flex flex-col flex-1 border-r border-dark-600 bg-dark-800">
          {/* Section Displays */}
          {state.section === "introduction" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Introduction"}
                  subhead={`Introduce yourself to visitors. Tell them a little bit about you and who you are as a developer.`}
                />
              </section>
              <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
                {/* Name */}
                <IntroductionArticle
                  ref={nameRef}
                  formLabelText={"Hi! My name is:"}
                  formLabelIcon={"👋"}
                  section={"introduction"}
                  type={"name"}
                  inputPlaceholder={"Peter Parker"}
                />
                {/* Description */}
                <IntroductionArticle
                  ref={descriptionRef}
                  formLabelText={"More about me:"}
                  formLabelIcon={"💡"}
                  section={"introduction"}
                  type={"description"}
                  inputPlaceholder={"I am a web developer and designer"}
                />
                {/* Location */}
                <IntroductionArticle
                  ref={locationRef}
                  formLabelText={"I'm based in:"}
                  formLabelIcon={"🌍"}
                  section={"introduction"}
                  type={"location"}
                  inputPlaceholder={"New York"}
                />
                {/* Currently working on */}
                <article>
                  <IntroductionArticle
                    ref={workingOnTitleRef}
                    formLabelText={"I'm currently working on:"}
                    formLabelIcon={"🧰"}
                    section={"introduction"}
                    type={"workingOnTitle"}
                    inputPlaceholder={"MyApp"}
                  />
                  <IntroductionArticleWithLink
                    ref={workingOnLinkRef}
                    section={"introduction"}
                    type={"workingOnLink"}
                    linkPrefix={"http://www."}
                    inputPlaceholder={"myapp.com"}
                  />
                </article>
                {/* Currently learning */}
                <IntroductionArticle
                  ref={learningRef}
                  formLabelText={"I'm currently learning:"}
                  formLabelIcon={"🎓"}
                  section={"introduction"}
                  type={"learning"}
                  inputPlaceholder={"a new framework"}
                />
                {/* Collaborate on */}
                <IntroductionArticle
                  ref={collaborateOnRef}
                  formLabelText={"I'm open to collaborate on:"}
                  formLabelIcon={"🤝"}
                  section={"introduction"}
                  type={"collaborateOn"}
                  inputPlaceholder={"interesting projects"}
                />
                {/* Additional info */}
                <IntroductionArticle
                  ref={additionalInfoRef}
                  formLabelText={"Additional information:"}
                  formLabelIcon={"⚡"}
                  section={"introduction"}
                  type={"additionalInfo"}
                  inputPlaceholder={"I can kick myself in the head"}
                />
              </section>
            </>
          ) : state.section === "skills" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Skills"}
                  subhead={`Add some icons to your profile. Select the languages,
                frameworks, software and tech that you use.`}
                />{" "}
              </section>
              <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
                {/* Core */}
                <IconSelector
                  handleIconToggle={handleIconToggle}
                  title={"Core"}
                  iconType={"core"}
                />
                {/* Frontend */}
                <IconSelector
                  handleIconToggle={handleIconToggle}
                  title={"Frontend"}
                  iconType={"frontend"}
                />
                {/* Backend and DB */}
                <IconSelector
                  handleIconToggle={handleIconToggle}
                  title={"Backend and Database"}
                  iconType={"backend"}
                />
                {/* Other */}
                <IconSelector
                  handleIconToggle={handleIconToggle}
                  title={"Other"}
                  iconType={"other"}
                />
                {/* Software */}
                <IconSelector
                  handleIconToggle={handleIconToggle}
                  title={"Software"}
                  iconType={"software"}
                />
              </section>
            </>
          ) : state.section === "socials" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Socials"}
                  subhead={`Include links to socials you have on different platforms, from
                social media to your portfolio.`}
                />
              </section>
              <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
                {/* GitHub Input */}
                <SocialArticle
                  ref={githubRef}
                  socialAccount={"github"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"GitHub profile:"}
                  linkPrefix={state.socials.github.linkPrefix}
                />

                {/* Twitter Input */}
                <SocialArticle
                  ref={twitterRef}
                  socialAccount={"twitter"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Twitter profile:"}
                  linkPrefix={state.socials.twitter.linkPrefix}
                />

                {/* Medium Input */}
                <SocialArticle
                  ref={mediumRef}
                  socialAccount={"medium"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Medium profile:"}
                  linkPrefix={state.socials.medium.linkPrefix}
                />

                {/* Hashnode Input */}
                <SocialArticle
                  ref={hashnodeRef}
                  socialAccount={"hashnode"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Hashnode profile:"}
                  linkPrefix={state.socials.hashnode.linkPrefix}
                />

                {/* DevDotTo Input */}
                <SocialArticle
                  ref={devdottoRef}
                  socialAccount={"devdotto"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Dev.to profile:"}
                  linkPrefix={state.socials.devdotto.linkPrefix}
                />

                {/* LinkedIn Input */}
                <SocialArticle
                  ref={linkedinRef}
                  socialAccount={"linkedin"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"LinkedIn profile:"}
                  linkPrefix={state.socials.linkedin.linkPrefix}
                />

                {/* Twitch Input */}
                <SocialArticle
                  ref={twitchRef}
                  socialAccount={"twitch"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Twitch channel:"}
                  linkPrefix={state.socials.twitch.linkPrefix}
                />

                {/* YouTube Input */}
                <SocialArticle
                  ref={youtubeRef}
                  socialAccount={"youtube"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"YouTube channel:"}
                  linkPrefix={state.socials.youtube.linkPrefix}
                />

                {/* Discord Input */}
                <SocialArticle
                  ref={discordRef}
                  socialAccount={"discord"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Discord code:"}
                  linkPrefix={state.socials.discord.linkPrefix}
                />

                {/* Instagram Input */}
                <SocialArticle
                  ref={instagramRef}
                  socialAccount={"instagram"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Instagram profile:"}
                  linkPrefix={state.socials.instagram.linkPrefix}
                />

                {/* Facebook Input */}
                <SocialArticle
                  ref={facebookRef}
                  socialAccount={"facebook"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Facebook profile:"}
                  linkPrefix={state.socials.facebook.linkPrefix}
                />

                {/* Dribbble Input */}
                <SocialArticle
                  ref={dribbbleRef}
                  socialAccount={"dribbble"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Dribbble profile:"}
                  linkPrefix={state.socials.dribbble.linkPrefix}
                />

                {/* Behance Input */}
                <SocialArticle
                  ref={behanceRef}
                  socialAccount={"behance"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Behance profile:"}
                  linkPrefix={state.socials.behance.linkPrefix}
                />

                {/* Code Sandbox Input */}
                <SocialArticle
                  ref={codesandboxRef}
                  socialAccount={"codesandbox"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"CodeSandbox profile:"}
                  linkPrefix={state.socials.codesandbox.linkPrefix}
                />

                {/* Stack Overflow Input */}
                <SocialArticle
                  ref={stackoverflowRef}
                  socialAccount={"stackoverflow"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"StackOverflow profile:"}
                  linkPrefix={state.socials.stackoverflow.linkPrefix}
                />

                {/* RSS Input */}
                <SocialArticle
                  ref={rssRef}
                  socialAccount={"rss"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"RSS url:"}
                  linkPrefix={state.socials.rss.linkPrefix}
                />
              </section>
            </>
          ) : state.section === "badges" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Badges"}
                  subhead={`Add some badges to your profile.`}
                />
              </section>
              <section className="flex flex-col p-6 mt-3 overflow-y-auto gap-y-3 gap-x-3">
                {/* Twitter Followers Badge */}
                <BadgeSelector
                  badgeType={"twitterFollowers"}
                  profileLink={"twitter"}
                  badgeText={"Twitter Follower Count"}
                  handleBadgeClick={handleBadgeClick}
                />

                {/* Twitch Channel Badge */}
                <BadgeSelector
                  badgeType={"twitchStatus"}
                  profileLink={"twitch"}
                  badgeText={"Twitch Streaming Status"}
                  handleBadgeClick={handleBadgeClick}
                />

                {/* GitHub Followers Badge */}
                <BadgeSelector
                  badgeType={"githubFollowers"}
                  profileLink={"github"}
                  badgeText={"GitHub Follower Count"}
                  handleBadgeClick={handleBadgeClick}
                />
                {/* GitHub Visits Badge */}
                <BadgeSelector
                  badgeType={"githubVisits"}
                  profileLink={"github"}
                  badgeText={"GitHub Visitor Count"}
                  handleBadgeClick={handleBadgeClick}
                />

                {/* GitHub Stats Card */}
                <BadgeSelector
                  badgeType={"githubStatsCard"}
                  profileLink={"github"}
                  badgeText={"GitHub Stats Card"}
                  handleBadgeClick={handleBadgeClick}
                />
              </section>
            </>
          ) : null}
        </section>
        {/* COLUMN 3 - PREVIEW & MARKDOWN */}
        <section className="relative flex flex-col flex-1 bg-dark-800">
          {/* Preview, Markdown and Copy Buttons */}
          <div className="relative flex w-full border-b bg-dark-900 border-dark-600">
            <button
              id="PreviewButton"
              onClick={() => {
                dispatch({
                  type: ACTIONS.SELECT_RENDER_MODE,
                  payload: "preview",
                });
              }}
              className={`btn-sm border-r ${
                state.renderMode === "preview"
                  ? "bg-dark-700 text-white"
                  : "bg-dark-900 text-dark-300"
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
              className={`btn-sm border-r mr-auto ${
                state.renderMode === "markdown"
                  ? "bg-dark-700 text-white"
                  : "bg-dark-900 text-dark-300"
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
              className={`btn-sm border-l ${
                copySuccess === "Copy" ? "text-dark-300" : "text-white"
              }`}
              onClick={() => {
                copyToClipBoard(markdownRef.current.innerText);
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
            className={`previewContainer p-6 bg-dark-900 h-full overflow-y-auto ${
              state.renderMode === "preview" ? "relative" : "hidden"
            }`}
          >
            {/* Introduce Section Preview */}
            <div
              ref={introductionRef}
              className={`${!state.introduction.name ? "" : "mb-8"}`}
            >
              {!state.introduction.name ? null : (
                <h1>Hi 👋 My name is {state.introduction.name}</h1>
              )}
              {state.introduction.description ? (
                <h2>{state.introduction.description}</h2>
              ) : null}
              {state.introduction.location ? (
                <p>🌍&nbsp; I'm based in {state.introduction.location}</p>
              ) : null}
              {state.introduction.workingOnTitle &&
              state.introduction.workingOnLink ? (
                <p>
                  🧰&nbsp; I'm currently working on{" "}
                  <a
                    href={`http://www.${state.introduction.workingOnLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {state.introduction.workingOnTitle}
                  </a>
                </p>
              ) : null}
              {state.introduction.learning ? (
                <p>🎓&nbsp; I'm learning {state.introduction.learning}</p>
              ) : null}
              {state.introduction.collaborateOn ? (
                <p>
                  🤝&nbsp; I'm open to collaborating on{" "}
                  {state.introduction.collaborateOn}
                </p>
              ) : null}
              {state.introduction.additionalInfo ? (
                <p>⚡&nbsp;{state.introduction.additionalInfo}</p>
              ) : null}
            </div>

            {/* Skills Section Preview */}
            <div ref={skillsTitleRef} className="flex">
              {!state.skills.frontend ||
              state.skills.frontend.length === 0 ? null : (
                <h3>My Skills</h3>
              )}
            </div>

            {/* Skills Section Preview */}
            <div ref={skillsRef} className="flex flex-col">
              {/* Core Icons Display */}

              {!state.skills.core || state.skills.core.length < 1 ? null : (
                <div className="flex flex-col">
                  <p>Core </p>
                  <div className="flex flex-wrap mb-8 gap-x-2 gap-y-2">
                    {state.skills.core.map((icon) => {
                      return (
                        <div key={`${icon.path}`} className="relative">
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="32"
                            height="32"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Frontend Icons Display */}
              {!state.skills.frontend ||
              state.skills.frontend.length < 1 ? null : (
                <div className="flex flex-col">
                  <p>Frontend </p>
                  <div className="flex flex-wrap mb-8 gap-x-2 gap-y-2">
                    {state.skills.frontend.map((icon) => {
                      return (
                        <div key={`${icon.path}`} className="relative">
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="32"
                            height="32"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Backend Icons Display */}
              {!state.skills.backend ||
              state.skills.backend.length < 1 ? null : (
                <div className="flex flex-col">
                  <p>Backend &amp; Database</p>
                  <div className="flex flex-wrap mb-8 gap-x-2 gap-y-2">
                    {state.skills.backend.map((icon) => {
                      return (
                        <div key={`${icon.path}`} className="relative">
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="32"
                            height="32"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Icons Display */}
              {!state.skills.other || state.skills.other.length < 1 ? null : (
                <div className="flex flex-col">
                  <p>Other</p>
                  <div className="flex flex-wrap mb-8 gap-x-2 gap-y-2">
                    {state.skills.other.map((icon) => {
                      return (
                        <div key={`${icon.path}`} className="relative">
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="32"
                            height="32"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Software Icons Display */}
              {!state.skills.software ||
              state.skills.software.length < 1 ? null : (
                <div className="flex flex-col">
                  <p>Software</p>
                  <div className="flex flex-wrap mb-8 gap-x-2 gap-y-2">
                    {state.skills.software.map((icon) => {
                      return (
                        <div key={`${icon.path}`} className="relative">
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="32"
                            height="32"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Socials Title Preview */}
            <div ref={socialsTitleRef} className="flex">
              {socialsShowing ? <h3>Socials</h3> : null}
            </div>

            {/* Socials Section Preview */}
            <div ref={socialsRef} className={`flex flex-wrap gap-x-2 mb-8`}>
              {Object.entries(state.socials).map((profile) => {
                return profile[1].linkSuffix ? (
                  <a
                    key={`${profile[0]}`}
                    target="_blank"
                    href={`${profile[1].linkPrefix}${profile[1].linkSuffix}`}
                  >
                    <img height="32" width="32" src={`${profile[1].path}`} />
                  </a>
                ) : null;
              })}
            </div>

            {/* Badges Section Preview */}
            <div ref={badgesRef} className="flex flex-wrap gap-x-3 gap-y-3">
              {state.badges.githubStatsCard ? (
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${state.socials.github.linkSuffix}&show_icons=true&hide_border=true`}
                  className="object-scale-down"
                />
              ) : null}

              {state.badges.twitterFollowers ? (
                <img
                  src={`https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=2563eb&labelColor=29293b`}
                  className="object-scale-down"
                />
              ) : null}

              {state.badges.githubFollowers ? (
                <img
                  src={`https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=2563eb&labelColor=29293b`}
                  className="object-scale-down"
                />
              ) : null}

              {state.badges.githubVisits ? (
                <img
                  src={`https://komarev.com/ghpvc/?username=${state.socials.github.linkSuffix}&style=for-the-badge&label=GITHUB+PROFILE+VIEWS&color=2563eb&labelColor=29293b`}
                  className="object-scale-down"
                />
              ) : null}

              {state.badges.twitchStatus ? (
                <img
                  src={`https://img.shields.io/twitch/status/${state.socials.twitch.linkSuffix}?logo=twitchsx&style=for-the-badge&color=2563eb&labelColor=29293b&label=TWITCH+STATUS`}
                  className="object-scale-down"
                />
              ) : null}
            </div>
          </article>

          {/* Markdown Section Preview */}
          <article
            id="markdownElement"
            ref={markdownRef}
            className={`p-6 overflow-y-auto h-full bg-dark-900 text-xs font-code text-dark-300 ${
              state.renderMode === "markdown" ? "relative" : "hidden"
            }`}
          >
            {!renderedMarkdown ? (
              <div>You have not rendered any code yet</div>
            ) : (
              <>
                {renderedMarkdown.introduction ? (
                  <p className="whitespace-pre-line">
                    {renderedMarkdown.introduction}
                  </p>
                ) : null}
                {renderedMarkdown.skillsTitle ? (
                  <p className="whitespace-pre-line">
                    {renderedMarkdown.skillsTitle}
                  </p>
                ) : null}

                {renderedMarkdown.skills.core.length > 0 ? (
                  <p className="break-all">
                    {`<p align="left">`}
                    {renderedMarkdown.skills.core.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {`<img src="${icon.path}" width="32" height="32" alt="${icon.name}" />`}
                        </span>
                      );
                    })}
                    {`</p>`}
                  </p>
                ) : null}

                {renderedMarkdown.skills.frontend.length > 0 ? (
                  <p className="break-all">
                    {`<p align="left">`}
                    {renderedMarkdown.skills.frontend.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {`<img src="${icon.path}" width="32" height="32" alt="${icon.name}" />`}
                        </span>
                      );
                    })}
                    {`</p>`}
                  </p>
                ) : null}

                {renderedMarkdown.skills.backend.length > 0 ? (
                  <p className="break-all">
                    {`<p align="left">`}
                    {renderedMarkdown.skills.backend.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {`<img src="${icon.path}" width="32" height="32" alt="${icon.name}" />`}
                        </span>
                      );
                    })}
                    {`</p>`}
                  </p>
                ) : null}

                {renderedMarkdown.skills.other.length > 0 ? (
                  <p className="break-all">
                    {`<p align="left">`}
                    {renderedMarkdown.skills.other.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {`<img src="${icon.path}" width="32" height="32" alt="${icon.name}" />`}
                        </span>
                      );
                    })}
                    {`</p>`}
                  </p>
                ) : null}

                {renderedMarkdown.skills.software.length > 0 ? (
                  <p className="break-all">
                    {`<p align="left">`}
                    {renderedMarkdown.skills.software.map((icon) => {
                      return (
                        <span key={`${icon.path}`}>
                          {`<img src="${icon.path}" width="32" height="32" alt="${icon.name}" />`}
                        </span>
                      );
                    })}
                    {`</p>`}
                  </p>
                ) : null}

                {socialsShowing ? (
                  <p className="whitespace-pre-line">## Socials</p>
                ) : null}

                {socialsShowing ? <>{`<p align="left">`}</> : null}
                {Object.entries(renderedMarkdown.socials).map((profile) => {
                  return profile[1].linkSuffix ? (
                    <div key={`profile-${profile[0]}`}>
                      {`<a href="${profile[1].linkPrefix}${profile[1].linkSuffix}" target="_blank" rel="noreferrer"><img src="${profile[1].path}" width="32" height="32" /></a>`}
                    </div>
                  ) : null;
                })}
                {socialsShowing ? <>{`</p>`}</> : null}

                <p className="mt-4 whitespace-pre-line">
                  {badgesShowing ? <>{`<p align="left">`}</> : null}
                  {!renderedMarkdown.badges.githubStatsCard ? null : (
                    <span className="whitespace-pre-line">
                      {`[![${state.introduction.name}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${state.socials.github.linkSuffix})](https://github.com/anuraghazra/github-readme-stats)
`}
                    </span>
                  )}
                  {!renderedMarkdown.badges.twitterFollowers ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.twitter.linkPrefix}${state.socials.twitter.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=ff0000"
                /></a>`}
                    </span>
                  )}
                  {!renderedMarkdown.badges.githubFollowers ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.github.linkPrefix}${state.socials.github.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=2563eb&labelColor=29293b" /></a>`}
                    </span>
                  )}
                  {!renderedMarkdown.badges.githubVisits ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.github.linkPrefix}${state.socials.github.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://komarev.com/ghpvc/?username=${state.socials.github.linkSuffix}&style=for-the-badge&label=GITHUB+PROFILE+VIEWS" /></a>`}
                    </span>
                  )}
                  {badgesShowing ? <>{`</p>`}</> : null}
                </p>
              </>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
