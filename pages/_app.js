import React, { createContext, useEffect } from "react";
import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "next-themes";
import { useReducerWithMiddleware } from "../hooks";
import storeStateMiddleware from "../middleware/storeStateMiddleware";

export const StateContext = createContext(null);

export const STORED_STATE_KEY = "state";

export const ACTIONS = {
  HYDRATE_STORED_STATE: "hydrate-stored-state",
  ADD_INTRODUCTION: "add-introduction",
  SELECT_RENDER_MODE: "select-render-mode",
  ADD_SKILL: "add-skill",
  REMOVE_SKILL: "remove-skill",
  ADD_SOCIAL_PROFILE: "add-social-profile",
  ADD_ALTERNATIVE_SOCIAL_PROFILE: "add-alternative-social-profile",
  TOGGLE_BADGE: "toggle-badge",
  TOGGLE_GITHUB_STATS: "toggle-github-stats",
  STYLE_BADGES: "style-badges",
  TOGGLE_STYLE_COLOR: "toggle-style-color",
  ADD_REPO: "add-repo",
  DELETE_REPO: "delete-repo",
  ADD_SUPPORT: "add-support",
  TOGGLE_COPY_MODAL: "toggle-copy-modal",
  TOGGLE_ELEMENT: "toggle-element",
  CLOSE_ELEMENT: "close-element",
};

// Color Store
export const colorStore = {
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
      colorName: "slate-dark",
      bgColor: "bg-[#0f172a]",
      hex: "0f172a",
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
      colorName: "emerald",
      bgColor: "bg-[#10b981]",
      hex: "10b981",
    },
    {
      colorName: "teal",
      bgColor: "bg-[#14b8a6]",
      hex: "14b8a6",
    },
    {
      colorName: "cyan",
      bgColor: "bg-[#0891b2]",
      hex: "0891b2",
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
      colorName: "default-grey",
      bgColor: "bg-[#444e59]",
      hex: "444e59",
    },
    {
      colorName: "slate",
      bgColor: "bg-[#64748b]",
      hex: "64748b",
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
      colorName: "emerald-dark",
      bgColor: "bg-[#134e4a]",
      hex: "134e4a",
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
    {
      colorName: "stone-dark",
      bgColor: "bg-[#1c1917]",
      hex: "1c1917",
    },
    {
      colorName: "gray-dark",
      bgColor: "bg-[#171717]",
      hex: "171717",
    },
    {
      colorName: "dark-900",
      bgColor: "bg-[#181824]",
      hex: "181824",
    },
    {
      colorName: "slate-dark",
      bgColor: "bg-[#0f172a]",
      hex: "0f172a",
    },
    {
      colorName: "[#22272e]",
      bgColor: "bg-[#22272e]",
      hex: "22272e",
    },
    {
      colorName: "zinc-dark",
      bgColor: "bg-[#27272a]",
      hex: "27272a",
    },
  ],
};

// Color State
const initialState = {
  section: "introduction",
  renderMode: "preview",
  // Introduction State
  introduction: {
    name: "",
    animatedHand: 0,
    shortDescription: "",
    longDescription: "",
    location: "",
    portfolioTitle: "",
    portfolioLink: "",
    emailMe: "",
    workingOnTitle: "",
    workingOnLink: "",
    learning: "",
    collaborateOn: "",
    additionalInfo: "",
  },
  // Skills State
  skills: {
    core: [],
    frontend: [],
    backend: [],
    other: [],
    software: [],
    web3: [],
  },
  // Socials State
  socials: {
    github: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github-dark.svg",
      linkPrefix: "https://www.github.com/",
      linkSuffix: "",
    },
    twitter: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitter.svg",
      linkPrefix: "https://www.twitter.com/",
      linkSuffix: "",
    },
    hashnode: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/hashnode.svg",
      linkPrefix: "https://",
      linkSuffix: "",
      linkSuffixTwo: ".hashnode.dev",
    },
    medium: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium-dark.svg",
      linkPrefix: "http://www.medium.com/",
      linkSuffix: "",
    },
    devdotto: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/devdotto.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/devdotto-dark.svg",
      linkPrefix: "https://www.dev.to/",
      linkSuffix: "",
    },
    linkedin: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/linkedin.svg",
      linkPrefix: "https://www.linkedin.com/in/",
      linkSuffix: "",
    },
    polywork: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/polywork.svg",
      linkPrefix: "https://www.polywork.com/",
      linkSuffix: "",
    },
    twitch: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitch.svg",
      linkPrefix: "https://www.twitch.tv/",
      linkSuffix: "",
    },
    youtube: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/youtube.svg",
      linkPrefix: "https://www.youtube.com/@",
      linkSuffix: "",
    },
    discord: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/discord.svg",
      linkPrefix: "https://discord.com/users/",
      linkSuffix: "",
    },
    instagram: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/instagram.svg",
      linkPrefix: "http://www.instagram.com/",
      linkSuffix: "",
    },
    facebook: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/facebook.svg",
      linkPrefix: "https://www.facebook.com/",
      linkSuffix: "",
    },
    dribbble: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/dribbble.svg",
      linkPrefix: "https://www.dribbble.com/",
      linkSuffix: "",
    },
    behance: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/behance.svg",
      linkPrefix: "https://www.behance.com/",
      linkSuffix: "",
    },
    codesandbox: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codesandbox.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codesandbox-dark.svg",
      linkPrefix: "https://codesandbox.io/u/",
      linkSuffix: "",
    },
    codepen: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codepen.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codepen-dark.svg",
      linkPrefix: "https://www.codepen.io/",
      linkSuffix: "",
    },
    stackoverflow: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/stackoverflow.svg",
      linkPrefix: "https://www.stackoverflow.com/users/",
      linkSuffix: "",
    },
    rss: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/rss.svg",
      linkPrefix: "https://",
      linkSuffix: "",
    },
  },
  badges: {
    twitterFollowers: {
      selected: false,
    },
    githubFollowers: {
      selected: false,
    },
    githubVisits: {
      selected: false,
    },
    githubStatsCard: {
      selected: false,
      stars: true,
      commits: true,
      prs: true,
      issues: true,
      contribs: true,
      privateCommits: true,
    },
    githubCommitsGraph: {
      selected: false,
    },
    githubStreak: {
      selected: false,
    },
    twitchStatus: {
      selected: false,
    },
    topLangsCard: {
      selected: false,
    },
    reposCard: {
      selected: false,
      repoOne: "",
      repoTwo: null,
      repoThree: null,
      reporFour: null,
    },
    cardStyle: {
      selected: false,
      titleColor: "0891b2",
      titleColorEdit: false,
      textColor: "ffffff",
      textColorEdit: false,
      iconColor: "0891b2",
      iconColorEdit: false,
      bgColor: "1c1917",
      bgColorEdit: false,
      hideBorder: true,
      showIcons: true,
    },
  },
  support: {
    buymeacoffee: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/support/buymeacoffee.svg",
      linkPrefix: "https://www.buymeacoffee.com/",
      linkSuffix: "",
    },
  },
  sidebarOpen: false,
  popOutMenuOpen: false,
  modal: false,
};

// Color Reducer
function reducer(state, action) {
  switch (action.type) {
    // Hydrate the store
    case ACTIONS.HYDRATE_STORED_STATE:
      return action.value;

    // Show Sections
    case ACTIONS.SHOW_SECTION:
      return {
        ...state,
        section: action.payload,
      };
    // Select Render Mode
    case ACTIONS.SELECT_RENDER_MODE:
      return {
        ...state,
        renderMode: action.payload,
      };
    // Introduction Actions
    case ACTIONS.ADD_INTRODUCTION:
      return {
        ...state,
        introduction: {
          ...state.introduction,
          [action.payload.title]: action.payload.value,
        },
      };
    // Skills Sections
    case ACTIONS.ADD_SKILL:
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.type]: [
            ...state.skills[action.payload.type].slice(
              0,
              action.payload.position
            ),
            action.payload.icon,
            ...state.skills[action.payload.type].slice(action.payload.position),
          ],
        },
      };
    case ACTIONS.REMOVE_SKILL:
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.type]: state.skills[action.payload.type].filter(
            (item) => item.name !== action.payload.icon.name
          ),
        },
      };
    // Socials Profiles Actions
    case ACTIONS.ADD_SOCIAL_PROFILE:
      return {
        ...state,
        socials: {
          ...state.socials,
          [action.payload.title]: {
            ...state.socials[action.payload.title],
            linkSuffix: action.payload.value,
          },
        },
      };
    // Add Alternative Social Profile
    case ACTIONS.ADD_ALTERNATIVE_SOCIAL_PROFILE:
      return {
        ...state,
        socials: {
          ...state.socials,
          [action.payload.title]: {
            ...state.socials[action.payload.title],
            linkSuffixTwo: action.payload.value,
          },
        },
      };
    // Badges Actions
    case ACTIONS.TOGGLE_BADGE:
      return {
        ...state,
        badges: {
          ...state.badges,
          [action.payload.title]: {
            ...state.badges[action.payload.title],
            selected: !state.badges[action.payload.title].selected,
          },
        },
      };
    case ACTIONS.TOGGLE_GITHUB_STATS:
      return {
        ...state,
        badges: {
          ...state.badges,
          githubStatsCard: {
            ...state.badges.githubStatsCard,
            [action.payload.keyToHide]:
              !state.badges.githubStatsCard[action.payload.keyToHide],
          },
        },
      };
    case ACTIONS.TOGGLE_STYLE_COLOR:
      return {
        ...state,
        badges: {
          ...state.badges,
          cardStyle: {
            ...state.badges.cardStyle,
            [action.payload.keyToToggle]:
              !state.badges.cardStyle[action.payload.keyToToggle],
          },
        },
      };
    case ACTIONS.STYLE_BADGES:
      return {
        ...state,
        badges: {
          ...state.badges,
          cardStyle: {
            ...state.badges.cardStyle,
            [action.payload.keyToStyle]: [action.payload.color],
            [action.payload.keyToToggle]:
              !state.badges.cardStyle[action.payload.keyToToggle],
          },
        },
      };
    case ACTIONS.ADD_REPO:
      return {
        ...state,
        badges: {
          ...state.badges,
          reposCard: {
            ...state.badges.reposCard,
            [action.payload.title]: action.payload.value,
          },
        },
      };
    case ACTIONS.DELETE_REPO:
      return {
        ...state,
        badges: {
          ...state.badges,
          reposCard: {
            ...state.badges.reposCard,
            [action.payload.title]: action.payload.value,
          },
        },
      };
    // Support Actions
    case ACTIONS.ADD_SUPPORT:
      return {
        ...state,
        support: {
          ...state.support,
          [action.payload.title]: {
            ...state.support[action.payload.title],
            linkSuffix: action.payload.value,
          },
        },
      };
    case ACTIONS.TOGGLE_COPY_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case ACTIONS.TOGGLE_ELEMENT:
      return {
        ...state,
        [action.payload.elementToToggle]:
          !state[action.payload.elementToToggle],
      };
    case ACTIONS.CLOSE_ELEMENT:
      return {
        ...state,
        [action.payload.elementToClose]: false,
      };
    default:
      throw new Error();
  }
}

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducerWithMiddleware(
    reducer,
    initialState,
    [],
    [storeStateMiddleware]
  );
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const retrievedStoredState = JSON.parse(
      localStorage.getItem(STORED_STATE_KEY)
    );

    if (retrievedStoredState) {
      dispatch({
        type: ACTIONS.HYDRATE_STORED_STATE,
        value: retrievedStoredState,
      });
    }
  }, []);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        id="analytics-tag"
      />
      <Script
        strategy="afterInteractive"
        id="analytics-config"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
             gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <ThemeProvider enableSystem={true} attribute="class">
        <StateContext.Provider value={{ state, dispatch }}>
          {getLayout(<Component {...pageProps} />)}
        </StateContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
