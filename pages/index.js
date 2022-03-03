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
import { BadgeShowSelector } from "../components/BadgeShowSelector";
import { BadgeStyleSelector } from "../components/BadgeStyleSelector";
let TurndownService = require("turndown").default;

const colorStore = {
  lightColors: [
    {
      colorName: "white",
      bgColor: "bg-[#ffffff]",
      hex: "ffffff",
    },
    {
      colorName: "black",
      bgColor: "bg-[#000000]",
      hex: "000000",
    },
    {
      colorName: "red",
      bgColor: "bg-[#ef4444]",
      hex: "ef4444",
    },
    {
      colorName: "orange",
      bgColor: "bg-[#f97316]",
      hex: "f97316",
    },
    {
      colorName: "yellow",
      bgColor: "bg-[#facc15]",
      hex: "facc15",
    },
    {
      colorName: "lime",
      bgColor: "bg-[#84cc16]",
      hex: "84cc16",
    },
    {
      colorName: "green",
      bgColor: "bg-[#22c55e]",
      hex: "22c55e",
    },
    {
      colorName: "green",
      bgColor: "bg-[#14b8a6]",
      hex: "14b8a6",
    },
    {
      colorName: "blue",
      bgColor: "bg-[#3382ed]",
      hex: "3382ed",
    },
    {
      colorName: "indigo",
      bgColor: "bg-[#6366f1]",
      hex: "6366f1",
    },
    {
      colorName: "purple",
      bgColor: "bg-[#a855f7]",
      hex: "a855f7",
    },
    {
      colorName: "pink",
      bgColor: "bg-[#ec4899]",
      hex: "ec4899",
    },
    {
      colorName: "slate",
      bgColor: "bg-[#64748b]",
      hex: "64748b",
    },
    {
      colorName: "default-grey",
      bgColor: "bg-[#444e59]",
      hex: "444e59",
    },
    {
      colorName: "slate-dark",
      bgColor: "bg-[#1e293b]",
      hex: "1e293b",
    },
  ],
  darkColors: [
    {
      colorName: "white",
      bgColor: "bg-[#ffffff]",
      hex: "ffffff",
    },
    {
      colorName: "black",
      bgColor: "bg-[#000000]",
      hex: "000000",
    },
    {
      colorName: "stone-dark",
      bgColor: "bg-[#1c1917]",
      hex: "1c1917",
    },
    {
      colorName: "slate-dark",
      bgColor: "bg-[#1e293b]",
      hex: "1e293b",
    },
    {
      colorName: "zinc-dark",
      bgColor: "bg-[#27272a]",
      hex: "27272a",
    },
    {
      colorName: "red-dark",
      bgColor: "bg-[#7f1d1d]",
      hex: "7f1d1d",
    },
    {
      colorName: "orange-dark",
      bgColor: "bg-[#7c2d12]",
      hex: "7c2d12",
    },
    {
      colorName: "yellow-dark",
      bgColor: "bg-[#713f12]",
      hex: "713f12",
    },
    {
      colorName: "lime-dark",
      bgColor: "bg-[#365314]",
      hex: "365314",
    },
    {
      colorName: "green-dark",
      bgColor: "bg-[#14532d]",
      hex: "14532d",
    },
    {
      colorName: "blue-dark",
      bgColor: "bg-[#1e3a8a]",
      hex: "1e3a8a",
    },
    {
      colorName: "indigo-dark",
      bgColor: "bg-[#312e81]",
      hex: "312e81",
    },
    {
      colorName: "purple-dark",
      bgColor: "bg-[#581c87]",
      hex: "581c87",
    },
    {
      colorName: "pink-dark",
      bgColor: "bg-[#831843]",
      hex: "831843",
    },
  ],
};

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
  const badgesRef = useRef(null);
  const supportTitleRef = useRef(null);
  const supportRef = useRef(null);

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

  // Support Ref
  const buymeacoffeeRef = useRef();

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

  const handleBadgeShowClick = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_GITHUB_STATS,
      payload: {
        keyToHide: e.currentTarget.name,
      },
    });
  };

  const handleColorToggle = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_STYLE_COLOR,
      payload: {
        keyToToggle: e.currentTarget.name,
      },
    });
  };

  // const handleBadgeStyleClick = (e) => {
  //   dispatch({
  //     type: ACTIONS.STYLE_GITHUB_CARD,
  //     payload: {
  //       keyToStyle: e.target.name,
  //       color: color.hex,
  //     },
  //   });
  // };

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
            <MenuItem text={"Support"} section={"support"} />
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
                />
              </section>
              <section className="flex flex-col p-6 overflow-y-auto gap-y-3">
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
                  section={"socials"}
                  account={"github"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"GitHub profile:"}
                  linkPrefix={state.socials.github.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Twitter Input */}
                <SocialArticle
                  ref={twitterRef}
                  section={"socials"}
                  account={"twitter"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Twitter profile:"}
                  linkPrefix={state.socials.twitter.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Medium Input */}
                <SocialArticle
                  ref={mediumRef}
                  section={"socials"}
                  account={"medium"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Medium profile:"}
                  linkPrefix={state.socials.medium.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Hashnode Input */}
                <SocialArticle
                  ref={hashnodeRef}
                  section={"socials"}
                  account={"hashnode"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Hashnode profile:"}
                  linkPrefix={state.socials.hashnode.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* DevDotTo Input */}
                <SocialArticle
                  ref={devdottoRef}
                  section={"socials"}
                  account={"devdotto"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Dev.to profile:"}
                  linkPrefix={state.socials.devdotto.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* LinkedIn Input */}
                <SocialArticle
                  ref={linkedinRef}
                  section={"socials"}
                  account={"linkedin"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"LinkedIn profile:"}
                  linkPrefix={state.socials.linkedin.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Twitch Input */}
                <SocialArticle
                  ref={twitchRef}
                  section={"socials"}
                  account={"twitch"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Twitch channel:"}
                  linkPrefix={state.socials.twitch.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* YouTube Input */}
                <SocialArticle
                  ref={youtubeRef}
                  section={"socials"}
                  account={"youtube"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"YouTube channel:"}
                  linkPrefix={state.socials.youtube.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Discord Input */}
                <SocialArticle
                  ref={discordRef}
                  section={"socials"}
                  account={"discord"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Discord code:"}
                  linkPrefix={state.socials.discord.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Instagram Input */}
                <SocialArticle
                  ref={instagramRef}
                  section={"socials"}
                  account={"instagram"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Instagram profile:"}
                  linkPrefix={state.socials.instagram.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Facebook Input */}
                <SocialArticle
                  ref={facebookRef}
                  section={"socials"}
                  account={"facebook"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Facebook profile:"}
                  linkPrefix={state.socials.facebook.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Dribbble Input */}
                <SocialArticle
                  ref={dribbbleRef}
                  section={"socials"}
                  account={"dribbble"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Dribbble profile:"}
                  linkPrefix={state.socials.dribbble.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Behance Input */}
                <SocialArticle
                  ref={behanceRef}
                  section={"socials"}
                  account={"behance"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Behance profile:"}
                  linkPrefix={state.socials.behance.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Code Sandbox Input */}
                <SocialArticle
                  ref={codesandboxRef}
                  section={"socials"}
                  account={"codesandbox"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"CodeSandbox profile:"}
                  linkPrefix={state.socials.codesandbox.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* Stack Overflow Input */}
                <SocialArticle
                  ref={stackoverflowRef}
                  section={"socials"}
                  account={"stackoverflow"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"StackOverflow profile:"}
                  linkPrefix={state.socials.stackoverflow.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
                />

                {/* RSS Input */}
                <SocialArticle
                  ref={rssRef}
                  section={"socials"}
                  account={"rss"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"RSS url:"}
                  linkPrefix={state.socials.rss.linkPrefix}
                  action={ACTIONS.ADD_SOCIAL_PROFILE}
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
              <section className="flex flex-col p-6 overflow-y-auto">
                {/* Customise */}
                <article className="mb-4">
                  <p className={`mb-2 text-xs font-semibold uppercase`}>
                    Style badges:
                  </p>
                  <article className="grid grid-cols-1 gap-2 mb-4 xl:grid-cols-2">
                    <BadgeStyleSelector
                      colorList={colorStore.lightColors}
                      badgeKeyToStyle={"titleColor"}
                      badgeText={"Title"}
                      handleColorToggle={handleColorToggle}
                      badgeKeyToHide={"titleColorEdit"}
                    />

                    <BadgeStyleSelector
                      colorList={colorStore.lightColors}
                      badgeKeyToStyle={"textColor"}
                      badgeText={"Text"}
                      handleColorToggle={handleColorToggle}
                      badgeKeyToHide={"textColorEdit"}
                    />

                    <BadgeStyleSelector
                      colorList={colorStore.lightColors}
                      badgeKeyToStyle={"iconColor"}
                      badgeText={"Icons"}
                      handleColorToggle={handleColorToggle}
                      badgeKeyToHide={"iconColorEdit"}
                    />

                    <BadgeStyleSelector
                      colorList={colorStore.darkColors}
                      badgeKeyToStyle={"bgColor"}
                      badgeText={"Background"}
                      handleColorToggle={handleColorToggle}
                      badgeKeyToHide={"bgColorEdit"}
                    />
                  </article>
                </article>

                <article className="flex flex-col mb-6 gap-y-2">
                  <h3 className="mb-0">GitHub</h3>
                  {/* GitHub Stats Card */}
                  <article>
                    <BadgeSelector
                      badgeType={"githubStatsCard"}
                      profileLink={"github"}
                      badgeText={"Stats Card"}
                      handleBadgeClick={handleBadgeClick}
                    />

                    <article
                      className={`flex flex-col p-3 border-b border-l border-r border-dark-600 overflow-hidden transform ${
                        state.badges.githubStatsCard.selected
                          ? "block"
                          : "hidden -translate-y-3"
                      }`}
                    >
                      <p className={`mb-2 text-xs font-semibold uppercase`}>
                        Show stats:
                      </p>
                      <article className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                        <BadgeShowSelector
                          badgeKeyToHide={"stars"}
                          badgeText={"Stars"}
                          handleBadgeShowClick={handleBadgeShowClick}
                        />
                        <BadgeShowSelector
                          badgeKeyToHide={"commits"}
                          badgeText={"Commits"}
                          handleBadgeShowClick={handleBadgeShowClick}
                        />
                        <BadgeShowSelector
                          badgeKeyToHide={"prs"}
                          badgeText={"PRs"}
                          handleBadgeShowClick={handleBadgeShowClick}
                        />
                        <BadgeShowSelector
                          badgeKeyToHide={"issues"}
                          badgeText={"Issues"}
                          handleBadgeShowClick={handleBadgeShowClick}
                        />
                        <BadgeShowSelector
                          badgeKeyToHide={"contribs"}
                          badgeText={"Contributions"}
                          handleBadgeShowClick={handleBadgeShowClick}
                        />
                        <BadgeShowSelector
                          badgeKeyToHide={"privateCommits"}
                          badgeText={"Private Commits"}
                          handleBadgeShowClick={handleBadgeShowClick}
                        />
                      </article>
                    </article>
                  </article>

                  {/* GitHub Followers Badge */}
                  <BadgeSelector
                    badgeType={"githubFollowers"}
                    profileLink={"github"}
                    badgeText={"Follower Count"}
                    handleBadgeClick={handleBadgeClick}
                  />
                  {/* GitHub Visits Badge */}
                  <BadgeSelector
                    badgeType={"githubVisits"}
                    profileLink={"github"}
                    badgeText={"Visitor Count"}
                    handleBadgeClick={handleBadgeClick}
                  />

                  <BadgeSelector
                    badgeType={"topLangsCard"}
                    profileLink={"github"}
                    badgeText={"Top Languages"}
                    handleBadgeClick={handleBadgeClick}
                  />

                  <BadgeSelector
                    badgeType={"reposCard"}
                    profileLink={"github"}
                    badgeText={"Top Repository"}
                    handleBadgeClick={handleBadgeClick}
                  />
                </article>
                <article className="flex flex-col mb-6 gap-y-2">
                  <h3 className="mb-0">Twitter</h3>
                  {/* Twitter Followers Badge */}
                  <BadgeSelector
                    badgeType={"twitterFollowers"}
                    profileLink={"twitter"}
                    badgeText={"Follower Count"}
                    handleBadgeClick={handleBadgeClick}
                  />
                </article>
                <article className="flex flex-col mb-6 gap-y-2">
                  <h3 className="mb-0">Twitch</h3>
                  {/* Twitch Channel Badge */}
                  <BadgeSelector
                    badgeType={"twitchStatus"}
                    profileLink={"twitch"}
                    badgeText={"Streaming Status"}
                    handleBadgeClick={handleBadgeClick}
                  />
                </article>
              </section>
            </>
          ) : state.section === "support" ? (
            <>
              <section className="flex flex-col p-6 border-b border-dark-600">
                <SectionHeader
                  header={"Support"}
                  subhead={`Make it easy for people using your products to support you or give donations.`}
                />
              </section>
              <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
                {/* GitHub Input */}
                <SocialArticle
                  ref={buymeacoffeeRef}
                  section={"support"}
                  account={"buymeacoffee"}
                  inputPlaceholder={"yourname"}
                  formLabelText={"Buy Me a Coffee:"}
                  linkPrefix={state.support.buymeacoffee.linkPrefix}
                  action={ACTIONS.ADD_SUPPORT}
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
              {state.skills.core.length === 0 &&
              state.skills.frontend.length === 0 &&
              state.skills.backend.length === 0 &&
              state.skills.other.length === 0 &&
              state.skills.software.length === 0 ? null : (
                <h3>Skills</h3>
              )}
            </div>

            {/* Skills Section Preview */}
            <div ref={skillsRef} className="flex flex-col">
              {/* Core Icons Display */}

              {!state.skills.core || state.skills.core.length < 1 ? null : (
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
              )}

              {/* Frontend Icons Display */}
              {!state.skills.frontend ||
              state.skills.frontend.length < 1 ? null : (
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
              )}

              {/* Backend Icons Display */}
              {!state.skills.backend ||
              state.skills.backend.length < 1 ? null : (
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
              )}

              {/* Other Icons Display */}
              {!state.skills.other || state.skills.other.length < 1 ? null : (
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
              )}

              {/* Software Icons Display */}
              {!state.skills.software ||
              state.skills.software.length < 1 ? null : (
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
              )}
            </div>

            {/* Socials Title Preview */}
            <div ref={socialsTitleRef} className="flex">
              {socialsShowing ? <h3>Socials</h3> : null}
            </div>

            {/* Socials Section Preview */}
            <div
              ref={socialsRef}
              className={`flex flex-wrap gap-x-2 ${
                socialsShowing ? "mb-8" : ""
              }`}
            >
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
              {state.badges.githubStatsCard.selected ? (
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
              ) : null}

              {/* Repo Cards */}
              {state.badges.reposCard.selected ? (
                <img
                  src={`https://github-readme-stats.vercel.app/api/pin/?username=danielcranney&repo=Portfolio&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en`}
                />
              ) : null}

              {/* Top Languages Cards */}
              {state.badges.topLangsCard.selected ? (
                <img
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=danielcranney&langs_count=10&title_color=${state.badges.cardStyle.titleColor}&text_color=${state.badges.cardStyle.textColor}&icon_color=${state.badges.cardStyle.iconColor}&bg_color=${state.badges.cardStyle.bgColor}&hide_border=true&locale=en&custom_title=Top%20%Languages`}
                />
              ) : null}
              {state.badges.twitterFollowers.selected ? (
                <img
                  src={`https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
                  className="object-scale-down"
                />
              ) : null}
              {state.badges.githubFollowers.selected ? (
                <img
                  src={`https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
                  className="object-scale-down"
                />
              ) : null}
              {state.badges.githubVisits.selected ? (
                <img
                  src={`https://komarev.com/ghpvc/?username=${state.socials.github.linkSuffix}&style=for-the-badge&label=GITHUB+PROFILE+VIEWS&color=${state.badges.cardStyle.iconColor}&labelColor=${state.badges.cardStyle.bgColor}`}
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

            <div ref={supportRef} className="flex flex-wrap gap-x-3 gap-y-3">
              {state.support.buymeacoffee.linkSuffix ? (
                <a
                  href={`${state.support.buymeacoffee.linkPrefix}${state.support.buymeacoffee.linkSuffix}`}
                >
                  <img
                    src={`https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png`}
                    className="object-scale-down"
                    width="150"
                  />
                </a>
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

                <p className="mt-4 break-all whitespace-pre-line">
                  {!renderedMarkdown.badges.githubStatsCard.selected ? null : (
                    <span className="break-all whitespace-pre-line">
                      {`[![${
                        state.introduction.name
                      }'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${
                        state.socials.github.linkSuffix
                      }&show_icons=true&hide=${
                        state.badges.githubStatsCard.stars ? "" : "stars,"
                      }${
                        state.badges.githubStatsCard.commits ? "" : "commits,"
                      }${state.badges.githubStatsCard.prs ? "" : "prs,"}${
                        state.badges.githubStatsCard.issues ? "" : "issues,"
                      }${
                        state.badges.githubStatsCard.contribs ? "" : "contribs"
                      }${
                        state.badges.githubStatsCard.privateCommits
                          ? "&count_private=true"
                          : ""
                      }&title_color=${
                        state.badges.cardStyle.titleColor
                      }&text_color=${
                        state.badges.cardStyle.textColor
                      }&icon_color=${
                        state.badges.cardStyle.iconColor
                      }&bg_color=${
                        state.badges.cardStyle.bgColor
                      }&hide_border=true&show_icons=true)](https://github.com/anuraghazra/github-readme-stats)
`}
                    </span>
                  )}

                  {/* {badgesShowing ? <>{`<p align="left">`}</> : null} */}

                  {!renderedMarkdown.badges.twitterFollowers.selected ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.twitter.linkPrefix}${state.socials.twitter.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/twitter/follow/${state.socials.twitter.linkSuffix}?logo=twitter&style=for-the-badge&color=${state.badges.githubStatsCard.iconColor}&labelColor=${state.badges.githubStatsCard.bgColor}"
                /></a>`}
                    </span>
                  )}
                  {!renderedMarkdown.badges.githubFollowers.selected ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.github.linkPrefix}${state.socials.github.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/github/followers/${state.socials.github.linkSuffix}?logo=github&style=for-the-badge&color=${state.badges.githubStatsCard.iconColor}&labelColor=${state.badges.githubStatsCard.bgColor}" /></a>`}
                    </span>
                  )}
                  {!renderedMarkdown.badges.githubVisits.selected ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.github.linkPrefix}${state.socials.github.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://komarev.com/ghpvc/?username=${state.socials.github.linkSuffix}&style=for-the-badge&label=GITHUB+PROFILE+VIEWS&color=${state.badges.githubStatsCard.iconColor}&labelColor=${state.badges.githubStatsCard.bgColor}" /></a>`}
                    </span>
                  )}
                  {!renderedMarkdown.badges.twitchStatus.selected ? null : (
                    <span className="whitespace-pre-line">
                      {`<a href="${state.socials.twitch.linkPrefix}${state.socials.twitch.linkSuffix}" target="_blank" rel="noreferrer"><img
                  src="https://img.shields.io/twitch/status/${state.socials.twitch.linkSuffix}?logo=twitchsx&style=for-the-badge&color=${state.badges.githubStatsCard.iconColor}&labelColor=${state.badges.githubStatsCard.bgColor}&label=TWITCH+STATUS" /></a>`}
                    </span>
                  )}
                  {/* {badgesShowing ? <>{`</p>`}</> : null} */}

                  {!renderedMarkdown.support.buymeacoffee.linkSuffix ? null : (
                    <span className="whitespace-pre-line">
                      {`<a
                  href="${state.support.buymeacoffee.linkPrefix}${state.support.buymeacoffee.linkSuffix}"
                >
                  <img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                    width="200"
                  />
                </a>`}
                    </span>
                  )}
                </p>
              </>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
