import React, { useEffect, useContext, useRef, useState } from "react";
import Head from "next/head";
// Import state and actions
import { ACTIONS } from "./_app";
import { StateContext } from "./_app";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { colorStore } from "./_app";
// Import components
import MenuItem from "../components/buttons/MenuItem";
import AddRepoInput from "../components/forms/AddRepoInput";
import SectionHeader from "../components/SectionHeader";
import SocialItem from "../components/SocialItem";
import IntroItem from "../components/IntroItem";
import IntroLinkItem from "../components/IntroLinkItem";
import IntroTextarea from "../components/IntroTextarea";
import IconSelector from "../components/IconSelector";
import ToggleBadgeButton from "../components/buttons/ToggleBadgeButton";
import ToggleBadgeElementCheckbox from "../components/buttons/ToggleBadgeElementCheckbox";
import StyleBadgeButton from "../components/buttons/StyleBadgeButton";
import NextSection from "../components/buttons/NextSection";
import PreviousSection from "../components/buttons/PreviousSection";
import CopyrightLabel from "../components/misc/CopyrightLabel";
import AddRepo from "../components/buttons/AddRepo";
import DeleteRepo from "../components/buttons/DeleteRepo";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("Copy");

  const executeScroll = (ref) =>
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

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

  // Section Refs
  const introductionRef = useRef(null);
  const skillsTitleRef = useRef(null);
  const skillsRef = useRef(null);
  const socialsTitleRef = useRef(null);
  const socialsRef = useRef(null);
  const badgesTitleRef = useRef(null);
  const badgesRef = useRef(null);
  const supportRef = useRef(null);

  // Introduction refs
  const nameRef = useRef();
  const shortDescriptionRef = useRef();
  const longDescriptionRef = useRef();
  const locationRef = useRef();
  const workingOnTitleRef = useRef();
  const workingOnLinkRef = useRef();
  const portfolioTitleRef = useRef();
  const portfolioLinkRef = useRef();
  const emailMeRef = useRef();
  const learningRef = useRef();
  const collaborateOnRef = useRef();
  const additionalInfoRef = useRef();

  // Socials refs
  const behanceRef = useRef();
  const codesandboxRef = useRef();
  const codepenRef = useRef();
  const devdottoRef = useRef();
  const discordRef = useRef();
  const dribbbleRef = useRef();
  const facebookRef = useRef();
  const githubRef = useRef();
  const hashnodeRef = useRef();
  const polyworkRef = useRef();
  const instagramRef = useRef();
  const linkedinRef = useRef();
  const mediumRef = useRef();
  const rssRef = useRef();
  const stackoverflowRef = useRef();
  const twitchRef = useRef();
  const twitterRef = useRef();
  const youtubeRef = useRef();

  // Repo Card Refs
  const repoOneRef = useRef();
  const repoTwoRef = useRef();
  const repoThreeRef = useRef();
  const repoFourRef = useRef();

  // Support Ref
  const buymeacoffeeRef = useRef();

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
    sidebarOpen ? disableBodyScroll(document) : enableBodyScroll(document);
  }, [sidebarOpen]);

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
    <main className="flex flex-col h-auto md:h-screen">
      <Head>
        <title>
          ProfileMe.dev | Create an awesome GitHub profile in minutes
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="ProfileMe.dev | Create an awesome GitHub profile in minutes"
        />
        <meta name="author" content="Dan Cranney" />
        <meta property="og:site_name" content="ProfileMe.dev" />
        <meta property="og:site" content="http://www.profileme.dev" />
        <meta property="og:title" content="ProfileMe.dev" />
        <meta
          property="og:description"
          content="Create an awesome GitHub profile in minutes"
        />
        <meta
          property="og:image"
          content="http://raw.githubusercontent.com/danielcranney/readme-generator/main/public/social-image.jpg"
        />
        <meta property="og:url" content="http://www.profileme.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="ProfileMe.dev" />
        <meta
          property="twitter:image"
          content="http://raw.githubusercontent.com/danielcranney/readme-generator/main/public/social-image.jpg"
        />
        <meta
          property="twitter:description"
          content="Create an awesome GitHub profile in minutes"
        />
        <meta property="twitter:creator" content="@danielcranney" />
      </Head>
      <header className="fixed z-40 flex items-center w-full h-16 px-6 border-b md:relative bg-dark-800 border-dark-600">
        <button
          className="relative z-20 flex items-center justify-center mr-2 border w-9 h-9 border-dark-600 bg-dark-700"
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        >
          <svg
            className={`w-6 h-6 transition-all duration-150 ease-in-out ${
              sidebarOpen ? "text-white" : "text-brand"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            ></path>
          </svg>
        </button>

        <h1 className="mb-0 text-base md:text-xl">
          ProfileMe<span className="text-brand">.dev</span>
        </h1>
        <a
          href="mailto:danielcranney@gmail.com"
          className="flex items-center px-2 ml-auto text-xs font-semibold tracking-wide no-underline uppercase transition-all duration-150 ease-in-out border h-9 text-dark-300 border-dark-600 bg-dark-700 hover:text-white"
        >
          Leave Feedback
        </a>
      </header>
      <div className="relative flex flex-col flex-1 overflow-hidden md:flex-row top-16 md:top-0">
        {/* COLUMN 1 - SIDEBAR */}
        <aside
          className={`fixed left-0 z-10 flex flex-col w-full h-full px-6 pb-6 pt-22 border-t-0 border-b border-r-0 bg-dark-800 border-dark-600 md:flex-grow md:border-b-0 transform transition-all duration-200 ease-in-out overflow-hidden md:w-64 top-0 ${
            sidebarOpen
              ? "translate-x-0 md:border-r"
              : "-translate-x-full md:-translate-x-64"
          }`}
        >
          <p className="mb-4 text-xs font-semibold text-white uppercase">
            Sections
          </p>
          <ul className="mb-auto menu">
            <MenuItem
              text={"Introduction"}
              section={"introduction"}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <MenuItem
              text={"Skills"}
              section={"skills"}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <MenuItem
              text={"Socials"}
              section={"socials"}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <MenuItem
              text={"Badges"}
              section={"badges"}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <MenuItem
              text={"Support"}
              section={"support"}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </ul>
          <CopyrightLabel />
        </aside>
        {/* COLUMN 2 - INPUTS */}
        <section
          className={`flex flex-col flex-1 border-r-0 md:border-r border-dark-600 bg-dark-800 transition-all duration-200 ease-in-out ${
            sidebarOpen ? "ml-0 md:ml-64" : ""
          }`}
        >
          {/* Section Displays */}
          {state.section === "introduction" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Introduction"}
                  subhead={`Introduce yourself. Tell visitors about you and who you are.`}
                />
                <section className="flex mt-4">
                  <NextSection sectionToGoTo={"skills"} />
                </section>
              </section>
              <section className="flex flex-col overflow-y-auto">
                <div ref={introductionAnchorRef}></div>
                <section className="flex flex-col p-6 gap-y-5">
                  {/* Name */}
                  <IntroItem
                    ref={nameRef}
                    formLabelText={"Hi! My name is:"}
                    formLabelIcon={"👋"}
                    section={"introduction"}
                    type={"name"}
                    inputPlaceholder={"Peter Parker"}
                  />
                  {/* Short Description */}
                  <IntroItem
                    ref={shortDescriptionRef}
                    formLabelText={"Subtitle:"}
                    formLabelIcon={"💡"}
                    section={"introduction"}
                    type={"shortDescription"}
                    inputPlaceholder={"Web Developer and Designer"}
                  />
                  {/* Long Description */}
                  <IntroTextarea
                    ref={longDescriptionRef}
                    formLabelText={"Long Description:"}
                    formLabelIcon={"✏️"}
                    section={"introduction"}
                    type={"longDescription"}
                    inputPlaceholder={
                      "eg: I've been learning to code for 5 years, after switching careers. I started with HTML, but have really found a passion for backend development..."
                    }
                  />
                  {/* Location */}
                  <h4 className="mb-0">About me</h4>
                  <IntroItem
                    ref={locationRef}
                    formLabelText={"I'm based in:"}
                    formLabelIcon={"🌍"}
                    section={"introduction"}
                    type={"location"}
                    inputPlaceholder={"New York"}
                  />
                  {/* Portfolio  */}
                  <article>
                    <IntroItem
                      ref={portfolioTitleRef}
                      formLabelText={"See my portfolio:"}
                      formLabelIcon={"🖥️"}
                      section={"introduction"}
                      type={"portfolioTitle"}
                      inputPlaceholder={"MyPortfolio"}
                    />
                    <IntroLinkItem
                      ref={portfolioLinkRef}
                      section={"introduction"}
                      linkPrefix={"http://"}
                      type={"portfolioLink"}
                      inputPlaceholder={"myapp.com"}
                    />
                  </article>
                  {/* Email  */}
                  <IntroItem
                    ref={emailMeRef}
                    formLabelText={"Contact me at:"}
                    formLabelIcon={"✉️"}
                    section={"introduction"}
                    type={"emailMe"}
                    inputPlaceholder={"myemail@gmail.com"}
                  />
                  {/* Currently working on */}
                  <article>
                    <IntroItem
                      ref={workingOnTitleRef}
                      formLabelText={"I'm currently working on:"}
                      formLabelIcon={"🚀"}
                      section={"introduction"}
                      type={"workingOnTitle"}
                      inputPlaceholder={"MyApp"}
                    />
                    <IntroLinkItem
                      ref={workingOnLinkRef}
                      section={"introduction"}
                      type={"workingOnLink"}
                      linkPrefix={"http://"}
                      inputPlaceholder={"myapp.com"}
                    />
                  </article>

                  {/* Currently learning */}
                  <IntroItem
                    ref={learningRef}
                    formLabelText={"I'm currently learning:"}
                    formLabelIcon={"🧠"}
                    section={"introduction"}
                    type={"learning"}
                    inputPlaceholder={"a new framework"}
                  />
                  {/* Collaborate on */}
                  <IntroItem
                    ref={collaborateOnRef}
                    formLabelText={"I'm open to collaborating on:"}
                    formLabelIcon={"🤝"}
                    section={"introduction"}
                    type={"collaborateOn"}
                    inputPlaceholder={"interesting projects"}
                  />
                  {/* Additional info */}
                  <IntroItem
                    ref={additionalInfoRef}
                    formLabelText={"Anything else:"}
                    formLabelIcon={"⚡"}
                    section={"introduction"}
                    type={"additionalInfo"}
                    inputPlaceholder={
                      "I'm secretly Spiderman... but don't tell anyone"
                    }
                  />
                  <section className="flex mt-4">
                    <NextSection sectionToGoTo={"skills"} />
                  </section>
                </section>
              </section>
            </>
          ) : state.section === "skills" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Skills"}
                  subhead={`Show off the languages,
                frameworks, software and tech that you use.`}
                />
                <section className="flex mt-4">
                  <PreviousSection sectionToGoTo={"introduction"} />
                  <NextSection sectionToGoTo={"socials"} />
                </section>
              </section>
              <section className="flex flex-col overflow-y-auto">
                {/* Core */}
                <div ref={skillsAnchorRef}></div>
                <section className="flex flex-col px-6 pt-6 pb-6 gap-y-3">
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
                  <section className="flex mt-4">
                    <PreviousSection sectionToGoTo={"introduction"} />
                    <NextSection sectionToGoTo={"socials"} />
                  </section>
                </section>
              </section>
            </>
          ) : state.section === "socials" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Socials"}
                  subhead={`Connect with your visitors by adding links to your socials.`}
                />
                <section className="flex mt-4">
                  <PreviousSection sectionToGoTo={"skills"} />
                  <NextSection sectionToGoTo={"badges"} />
                </section>
              </section>
              <section className="flex flex-col overflow-y-auto">
                <div ref={socialsAnchorRef}></div>
                <section className="flex flex-col p-6 gap-y-5">
                  {/* GitHub Input */}
                  <SocialItem
                    ref={githubRef}
                    section={"socials"}
                    account={"github"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"GitHub profile:"}
                    linkPrefix={state.socials.github.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Twitter Input */}
                  <SocialItem
                    ref={twitterRef}
                    section={"socials"}
                    account={"twitter"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Twitter profile:"}
                    linkPrefix={state.socials.twitter.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Hashnode Input */}
                  <SocialItem
                    ref={hashnodeRef}
                    section={"socials"}
                    account={"hashnode"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Hashnode profile:"}
                    linkPrefix={state.socials.hashnode.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                    linkSuffixTwo={
                      <>
                        <div className="flex items-center text-sm text-dark-300 bg-dark-900">
                          <span className="py-2 pr-2 leading-4 select-none">
                            .hashnode.dev
                          </span>
                        </div>
                      </>
                    }
                  />

                  {/* Medium Input */}
                  <SocialItem
                    ref={mediumRef}
                    section={"socials"}
                    account={"medium"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Medium profile:"}
                    linkPrefix={state.socials.medium.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* DevDotTo Input */}
                  <SocialItem
                    ref={devdottoRef}
                    section={"socials"}
                    account={"devdotto"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Dev.to profile:"}
                    linkPrefix={state.socials.devdotto.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* LinkedIn Input */}
                  <SocialItem
                    ref={linkedinRef}
                    section={"socials"}
                    account={"linkedin"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"LinkedIn profile:"}
                    linkPrefix={state.socials.linkedin.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Polywork Input */}
                  <SocialItem
                    ref={polyworkRef}
                    section={"socials"}
                    account={"polywork"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Polywork profile:"}
                    linkPrefix={state.socials.polywork.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Twitch Input */}
                  <SocialItem
                    ref={twitchRef}
                    section={"socials"}
                    account={"twitch"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Twitch channel:"}
                    linkPrefix={state.socials.twitch.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* YouTube Input */}
                  <SocialItem
                    ref={youtubeRef}
                    section={"socials"}
                    account={"youtube"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"YouTube channel:"}
                    linkPrefix={state.socials.youtube.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Discord Input */}
                  <SocialItem
                    ref={discordRef}
                    section={"socials"}
                    account={"discord"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Discord code:"}
                    linkPrefix={state.socials.discord.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Instagram Input */}
                  <SocialItem
                    ref={instagramRef}
                    section={"socials"}
                    account={"instagram"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Instagram profile:"}
                    linkPrefix={state.socials.instagram.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Facebook Input */}
                  <SocialItem
                    ref={facebookRef}
                    section={"socials"}
                    account={"facebook"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Facebook profile:"}
                    linkPrefix={state.socials.facebook.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Dribbble Input */}
                  <SocialItem
                    ref={dribbbleRef}
                    section={"socials"}
                    account={"dribbble"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Dribbble profile:"}
                    linkPrefix={state.socials.dribbble.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Behance Input */}
                  <SocialItem
                    ref={behanceRef}
                    section={"socials"}
                    account={"behance"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Behance profile:"}
                    linkPrefix={state.socials.behance.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Code Sandbox Input */}
                  <SocialItem
                    ref={codesandboxRef}
                    section={"socials"}
                    account={"codesandbox"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"CodeSandbox profile:"}
                    linkPrefix={state.socials.codesandbox.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Codepen Input */}
                  <SocialItem
                    ref={codepenRef}
                    section={"socials"}
                    account={"codepen"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Codepen profile:"}
                    linkPrefix={state.socials.codepen.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* Stack Overflow Input */}
                  <SocialItem
                    ref={stackoverflowRef}
                    section={"socials"}
                    account={"stackoverflow"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"StackOverflow profile:"}
                    linkPrefix={state.socials.stackoverflow.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />

                  {/* RSS Input */}
                  <SocialItem
                    ref={rssRef}
                    section={"socials"}
                    account={"rss"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"RSS url:"}
                    linkPrefix={state.socials.rss.linkPrefix}
                    action={ACTIONS.ADD_SOCIAL_PROFILE}
                  />
                  <section className="flex mt-4">
                    <PreviousSection sectionToGoTo={"skills"} />
                    <NextSection sectionToGoTo={"badges"} />
                  </section>
                </section>
              </section>
            </>
          ) : state.section === "badges" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Badges"}
                  subhead={`Add some badges and stats to your profile.`}
                />
                <section className="flex mt-4">
                  <PreviousSection sectionToGoTo={"socials"} />
                  <NextSection sectionToGoTo={"support"} />
                </section>
              </section>
              <section className="flex flex-col overflow-y-auto">
                <div ref={badgesAnchorRef}></div>
                <section className="flex flex-col p-6">
                  {/* Customise */}
                  <article className="mb-4">
                    <p className={`mb-2 text-xs font-semibold uppercase`}>
                      Style badges:
                    </p>
                    {!badgesShowing ? (
                      <p className="text-xs">
                        Select a badge below to customise.
                      </p>
                    ) : null}
                    <article className="grid grid-cols-1 gap-2 mb-4 xl:grid-cols-2">
                      <StyleBadgeButton
                        colorList={colorStore.lightColors}
                        badgeKeyToStyle={"titleColor"}
                        badgeText={"Title"}
                        handleStyleBadge={handleStyleBadge}
                        badgeKeyToHide={"titleColorEdit"}
                        badgesShowing={badgesShowing}
                        handleChangeBadgeColor={handleChangeBadgeColor}
                      />

                      <StyleBadgeButton
                        colorList={colorStore.lightColors}
                        badgeKeyToStyle={"textColor"}
                        badgeText={"Text"}
                        handleStyleBadge={handleStyleBadge}
                        badgeKeyToHide={"textColorEdit"}
                        badgesShowing={badgesShowing}
                        handleChangeBadgeColor={handleChangeBadgeColor}
                      />

                      <StyleBadgeButton
                        colorList={colorStore.lightColors}
                        badgeKeyToStyle={"iconColor"}
                        badgeText={"Icons"}
                        handleStyleBadge={handleStyleBadge}
                        badgeKeyToHide={"iconColorEdit"}
                        badgesShowing={badgesShowing}
                        handleChangeBadgeColor={handleChangeBadgeColor}
                      />

                      <StyleBadgeButton
                        colorList={colorStore.darkColors}
                        badgeKeyToStyle={"bgColor"}
                        badgeText={"Background"}
                        handleStyleBadge={handleStyleBadge}
                        badgeKeyToHide={"bgColorEdit"}
                        badgesShowing={badgesShowing}
                        handleChangeBadgeColor={handleChangeBadgeColor}
                      />
                    </article>
                  </article>
                  <article className="flex flex-col mb-4 gap-y-2">
                    <h3 className="mb-0">GitHub</h3>
                    {!state.socials.github.linkSuffix ? (
                      <p className="mb-2 text-xs">
                        Please{" "}
                        <a
                          onClick={() => {
                            dispatch({
                              type: ACTIONS.SHOW_SECTION,
                              payload: "socials",
                            });
                          }}
                        >
                          add your GitHub profile
                        </a>{" "}
                        in the socials section.
                      </p>
                    ) : null}
                    {/* GitHub Stats Card */}
                    <article>
                      <ToggleBadgeButton
                        badgeType={"githubStatsCard"}
                        profileLink={"github"}
                        badgeText={"Stats Card"}
                        handleBadgeToggle={handleBadgeToggle}
                      />

                      <article
                        className={`flex flex-col p-3 border-b border-l border-r border-dark-600 overflow-hidden transform ${
                          state.badges.githubStatsCard.selected
                            ? "block"
                            : "hidden -translate-y-3"
                        }`}
                      >
                        <p className={`mb-2 text-xs font-semibold uppercase`}>
                          Show:
                        </p>
                        <article className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                          <ToggleBadgeElementCheckbox
                            badgeKeyToHide={"stars"}
                            badgeText={"Stars"}
                            handleBadgeElementToggle={handleBadgeElementToggle}
                          />
                          <ToggleBadgeElementCheckbox
                            badgeKeyToHide={"commits"}
                            badgeText={"Commits"}
                            handleBadgeElementToggle={handleBadgeElementToggle}
                          />
                          <ToggleBadgeElementCheckbox
                            badgeKeyToHide={"prs"}
                            badgeText={"PRs"}
                            handleBadgeElementToggle={handleBadgeElementToggle}
                          />
                          <ToggleBadgeElementCheckbox
                            badgeKeyToHide={"issues"}
                            badgeText={"Issues"}
                            handleBadgeElementToggle={handleBadgeElementToggle}
                          />
                          <ToggleBadgeElementCheckbox
                            badgeKeyToHide={"contribs"}
                            badgeText={"Contributions"}
                            handleBadgeElementToggle={handleBadgeElementToggle}
                          />
                          <ToggleBadgeElementCheckbox
                            badgeKeyToHide={"privateCommits"}
                            badgeText={"Private Commits"}
                            handleBadgeElementToggle={handleBadgeElementToggle}
                          />
                        </article>
                      </article>
                    </article>

                    <ToggleBadgeButton
                      badgeType={"githubStreak"}
                      profileLink={"github"}
                      badgeText={"Commit Streak"}
                      handleBadgeToggle={handleBadgeToggle}
                    />

                    {/* GitHub Commits Graph Badge */}
                    <ToggleBadgeButton
                      badgeType={"githubCommitsGraph"}
                      profileLink={"github"}
                      badgeText={"Commits Graph"}
                      handleBadgeToggle={handleBadgeToggle}
                    />

                    {/* Top Languages Card */}
                    <ToggleBadgeButton
                      badgeType={"topLangsCard"}
                      profileLink={"github"}
                      badgeText={"Top Languages"}
                      handleBadgeToggle={handleBadgeToggle}
                    />

                    {/* Repository Card */}
                    <article>
                      <ToggleBadgeButton
                        badgeType={"reposCard"}
                        profileLink={"github"}
                        badgeText={"Top Repositories"}
                        handleBadgeToggle={handleBadgeToggle}
                      />

                      <article
                        className={`flex flex-col p-3 border-b border-l border-r border-dark-600 overflow-hidden transform ${
                          state.badges.reposCard.selected
                            ? "block"
                            : "hidden -translate-y-3"
                        }`}
                      >
                        <p className={`mb-2 text-xs font-semibold uppercase`}>
                          Find Repositories
                        </p>
                        <p className="text-xs">
                          The repository must be the same as it is on your
                          GitHub (including hyphens, NOT case-sensitive).
                        </p>
                        <article className="grid grid-cols-1 gap-2 mb-2">
                          <AddRepoInput
                            ref={repoOneRef}
                            section={"reposCard"}
                            type={"repoOne"}
                            placeholder={"repo-name"}
                            action={ACTIONS.ADD_REPO}
                          />

                          {state.badges.reposCard.repoTwo != null ? (
                            <article className="flex gap-x-2 h-9.5">
                              <AddRepoInput
                                ref={repoTwoRef}
                                section={"reposCard"}
                                type={"repoTwo"}
                                placeholder={"repo-name"}
                                action={ACTIONS.ADD_REPO}
                              />
                              <DeleteRepo
                                action={ACTIONS.DELETE_REPO}
                                type={"repoTwo"}
                              />
                            </article>
                          ) : null}

                          {state.badges.reposCard.repoThree != null ? (
                            <article className="flex gap-x-2 h-9.5">
                              <AddRepoInput
                                ref={repoThreeRef}
                                section={"reposCard"}
                                type={"repoThree"}
                                placeholder={"repo-name"}
                                action={ACTIONS.ADD_REPO}
                              />
                              <DeleteRepo
                                action={ACTIONS.DELETE_REPO}
                                type={"repoThree"}
                              />
                            </article>
                          ) : null}

                          {state.badges.reposCard.repoFour != null ? (
                            <article className="flex gap-x-2 h-9.5">
                              <AddRepoInput
                                ref={repoFourRef}
                                section={"reposCard"}
                                type={"repoFour"}
                                placeholder={"repo-name"}
                                action={ACTIONS.ADD_REPO}
                              />
                              <DeleteRepo
                                action={ACTIONS.DELETE_REPO}
                                type={"repoFour"}
                              />
                            </article>
                          ) : null}
                        </article>
                        {state.badges.reposCard.repoTwo != null ? null : (
                          <>
                            <AddRepo
                              action={ACTIONS.ADD_REPO}
                              repoNumberToAdd={"repoTwo"}
                            />
                          </>
                        )}

                        {state.badges.reposCard.repoThree != null ||
                        state.badges.reposCard.repoTwo == null ? null : (
                          <>
                            <AddRepo
                              action={ACTIONS.ADD_REPO}
                              repoNumberToAdd={"repoThree"}
                            />
                          </>
                        )}

                        {state.badges.reposCard.repoFour != null ||
                        state.badges.reposCard.repoTwo == null ||
                        state.badges.reposCard.repoThree == null ? null : (
                          <>
                            <AddRepo
                              action={ACTIONS.ADD_REPO}
                              repoNumberToAdd={"repoFour"}
                            />
                          </>
                        )}
                      </article>
                    </article>

                    {/* GitHub Followers Badge */}
                    <ToggleBadgeButton
                      badgeType={"githubFollowers"}
                      profileLink={"github"}
                      badgeText={"Follower Count"}
                      handleBadgeToggle={handleBadgeToggle}
                    />
                  </article>
                  <article className="flex flex-col mb-4 gap-y-2">
                    <h3 className="mb-0">Twitter</h3>
                    {!state.socials.twitter.linkSuffix ? (
                      <p className="mb-2 text-xs">
                        Please{" "}
                        <a
                          onClick={() => {
                            dispatch({
                              type: ACTIONS.SHOW_SECTION,
                              payload: "socials",
                            });
                          }}
                        >
                          add your Twitter profile
                        </a>{" "}
                        in the socials section.
                      </p>
                    ) : null}
                    {/* Twitter Followers Badge */}
                    <ToggleBadgeButton
                      badgeType={"twitterFollowers"}
                      profileLink={"twitter"}
                      badgeText={"Follower Count"}
                      handleBadgeToggle={handleBadgeToggle}
                    />
                  </article>
                  <article className="flex flex-col mb-4 gap-y-2">
                    <h3 className="mb-0">Twitch</h3>
                    {!state.socials.twitch.linkSuffix ? (
                      <p className="mb-2 text-xs">
                        Please{" "}
                        <a
                          onClick={() => {
                            dispatch({
                              type: ACTIONS.SHOW_SECTION,
                              payload: "socials",
                            });
                          }}
                        >
                          add your Twitch profile
                        </a>{" "}
                        in the socials section.
                      </p>
                    ) : null}
                    {/* Twitch Channel Badge */}
                    <ToggleBadgeButton
                      badgeType={"twitchStatus"}
                      profileLink={"twitch"}
                      badgeText={"Streaming Status"}
                      handleBadgeToggle={handleBadgeToggle}
                    />
                  </article>
                  <section className="flex mt-4">
                    <PreviousSection sectionToGoTo={"socials"} />
                    <NextSection sectionToGoTo={"support"} />
                  </section>
                </section>
              </section>
            </>
          ) : state.section === "support" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Support"}
                  subhead={`Make it easy for people using your products to support you or give donations.`}
                />
                <section className="flex mt-4">
                  <PreviousSection sectionToGoTo={"badges"} />
                </section>
              </section>

              <section className="flex flex-col overflow-y-auto">
                <div ref={supportAnchorRef}></div>
                <section className="flex flex-col p-6 gap-y-4">
                  {/* GitHub Input */}
                  <SocialItem
                    ref={buymeacoffeeRef}
                    section={"support"}
                    account={"buymeacoffee"}
                    inputPlaceholder={"yourname"}
                    formLabelText={"Buy Me a Coffee:"}
                    linkPrefix={state.support.buymeacoffee.linkPrefix}
                    action={ACTIONS.ADD_SUPPORT}
                  />
                  <section className="flex mt-4">
                    <PreviousSection sectionToGoTo={"badges"} />
                  </section>
                </section>
              </section>
            </>
          ) : null}
        </section>
        {/* COLUMN 3 - PREVIEW & MARKDOWN */}
        <section className="relative flex flex-col flex-1 border-t bg-dark-800 border-dark-600 md:border-t-0">
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
                  : "bg-dark-900 text-dark-300 hover:text-white"
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
                  : "bg-dark-900 text-dark-300 hover:text-white"
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
                copySuccess !== "Copy"
                  ? "text-white"
                  : "text-dark-300 hover:text-white"
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
              {/* <img
                src={`https://readme-typing-svg.herokuapp.com/?font=Helvetica&lines=Hi+👋+My+name+is+${state.introduction.name}`}
              /> */}
              {!state.introduction.name ? null : (
                <h1>Hi 👋 My name is {state.introduction.name}</h1>
              )}
              {state.introduction.shortDescription ? (
                <h2>{state.introduction.shortDescription}</h2>
              ) : null}

              {state.introduction.longDescription ? (
                <p>{state.introduction.longDescription}</p>
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
              state.skills.software.length === 0 ? null : (
                <h3>Skills</h3>
              )}
            </div>

            {/* Skills Section Preview */}
            <div
              ref={skillsRef}
              className={`flex flex-wrap gap-y-1 gap-x-1 ${
                state.skills.core.length < 1 &&
                state.skills.frontend.length < 1 &&
                state.skills.backend.length < 1 &&
                state.skills.other.length < 1 &&
                state.skills.software.length < 1
                  ? "mb-0"
                  : "mb-4"
              }`}
            >
              {/* Core Icons Display */}
              {!state.skills.core || state.skills.core.length < 1 ? null : (
                <div className="flex gap-x-1 flex-wrap">
                  {state.skills.core.map((icon) => {
                    return (
                      <div key={`${icon.path}`} className="relative">
                        <a
                          href={`${icon.link}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Frontend Icons Display */}
              {!state.skills.frontend ||
              state.skills.frontend.length < 1 ? null : (
                <div className="flex gap-x-1 flex-wrap">
                  {state.skills.frontend.map((icon) => {
                    return (
                      <div key={`${icon.path}`} className="relative">
                        <a
                          href={`${icon.link}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Backend Icons Display */}
              {!state.skills.backend ||
              state.skills.backend.length < 1 ? null : (
                <div className="flex gap-x-1 flex-wrap">
                  {state.skills.backend.map((icon) => {
                    return (
                      <div key={`${icon.path}`} className="relative">
                        <a
                          href={`${icon.link}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Other Icons Display */}
              {!state.skills.other || state.skills.other.length < 1 ? null : (
                <div className="flex gap-x-1 flex-wrap">
                  {state.skills.other.map((icon) => {
                    return (
                      <div key={`${icon.path}`} className="relative">
                        <a
                          href={`${icon.link}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Software Icons Display */}
              {!state.skills.software ||
              state.skills.software.length < 1 ? null : (
                <div className="flex gap-x-1 flex-wrap">
                  {state.skills.software.map((icon) => {
                    return (
                      <div key={`${icon.path}`} className="relative">
                        <a
                          href={`${icon.link}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${icon.path}`}
                            alt={`${icon.name}`}
                            width="36"
                            height="36"
                          />
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
                socialsShowing ? "mb-8" : ""
              }`}
            >
              {Object.entries(state.socials).map((profile) => {
                console.log(profile);
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
                    <img height="32" width="32" src={`${profile[1].path}`} />
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
                    }&hide=${
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
                    }&text_color=${
                      state.badges.cardStyle.textColor
                    }&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${
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
                  <p className="mt-2 font-bold text-dark-300">
                    Top Repositories
                  </p>
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
                      <span>Please enter a repository name.</span>
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
                  renderedMarkdown.skills.software.length < 1 ? null : (
                    <>{`<p align="left">`}</>
                  )}

                  {renderedMarkdown.skills.core.length > 0 ? (
                    <>
                      {renderedMarkdown.skills.core.map((icon) => {
                        return (
                          <span key={`${icon.path}`}>
                            {`<a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}
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
                            {`<a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}
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
                            {`<a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}
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
                            {`<a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}
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
                            {`<a href="${icon.link}" target="_blank" rel="noreferrer"><img src="${icon.path}" width="36" height="36" alt="${icon.name}" /></a>`}
                          </span>
                        );
                      })}
                    </>
                  ) : null}

                  {renderedMarkdown.skills.core.length < 1 &&
                  renderedMarkdown.skills.frontend.length < 1 &&
                  renderedMarkdown.skills.backend.length < 1 &&
                  renderedMarkdown.skills.other.length < 1 &&
                  renderedMarkdown.skills.software.length < 1 ? null : (
                    <>{`</p>
                    `}</>
                  )}
                </div>

                {socialsShowing ? (
                  <p className="mt-4 whitespace-pre-line">{`### Socials`}</p>
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
                    }&text_color=${
                      state.badges.cardStyle.textColor
                    }&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${
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
      </div>
    </main>
  );
}
