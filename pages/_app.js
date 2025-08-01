import React, { createContext, useEffect } from "react";
import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "next-themes";
import { useReducerWithMiddleware } from "../hooks";
import storeStateMiddleware from "../middleware/storeStateMiddleware";
import { SKILL_CATEGORIES } from "../lib/constants/skillCategories";
import { ACTIONS } from "../lib/constants/actions";
import { supportStore } from "../lib/constants/supportStore";
import { PROJECT_URL } from "../lib/constants/config";
import { iconData } from "../lib/data/iconData";

export const StateContext = createContext(null);

export const STORED_STATE_KEY = "ProfileMe_LocalState";

// Color State
const initialState = {
  section: "introduction",
  renderMode: "preview",
  // Section order for reordering functionality
  sectionOrder: ["introduction", "skills", "socials", "badges", "support"],
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
  skills: Object.fromEntries(
    SKILL_CATEGORIES.map((category) => [category.name, []])
  ),
  // Socials State
  socials: {
    github: {
      label: "Github",
      path: `${PROJECT_URL}/icons/socials/github.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/github-dark.svg`,
      linkPrefix: "https://www.github.com/",
      linkSuffix: "",
    },
    gitlab: {
      label: "GitLab",
      path: `${PROJECT_URL}/icons/socials/gitlab.svg`,
      linkPrefix: "https://www.gitlab.com/",
      linkSuffix: "",
    },
    twitter: {
      label: "Twitter",
      path: `${PROJECT_URL}/icons/socials/twitter.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/twitter-dark.svg`,
      linkPrefix: "https://www.x.com/",
      linkSuffix: "",
    },
    threads: {
      label: "Threads",
      path: `${PROJECT_URL}/icons/socials/threads.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/threads-dark.svg`,
      linkPrefix: "https://www.threads.net/@",
      linkSuffix: "",
    },
    hashnode: {
      label: "Hashnode",
      path: `${PROJECT_URL}/icons/socials/hashnode.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/hashnode-dark.svg`,
      linkPrefix: "https://",
      linkSuffix: "",
      linkSuffixTwo: ".hashnode.dev",
    },
    medium: {
      label: "Medium",
      path: `${PROJECT_URL}/icons/socials/medium.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/medium-dark.svg`,
      linkPrefix: "http://www.medium.com/",
      linkSuffix: "",
    },
    devdotto: {
      label: "DEV",
      path: `${PROJECT_URL}/icons/socials/devdotto.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/devdotto-dark.svg`,
      linkPrefix: "https://www.dev.to/",
      linkSuffix: "",
    },
    linkedin: {
      label: "LinkedIn",
      path: `${PROJECT_URL}/icons/socials/linkedin.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/linkedin-dark.svg`,
      linkPrefix: "https://www.linkedin.com/in/",
      linkSuffix: "",
    },
    polywork: {
      label: "Polywork",
      path: `${PROJECT_URL}/icons/socials/polywork.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/polywork-dark.svg`,
      linkPrefix: "https://www.polywork.com/",
      linkSuffix: "",
    },
    twitch: {
      label: "Twitch",
      path: `${PROJECT_URL}/icons/socials/twitch.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/twitch-dark.svg`,
      linkPrefix: "https://www.twitch.tv/",
      linkSuffix: "",
    },
    youtube: {
      label: "YouTube",
      path: `${PROJECT_URL}/icons/socials/youtube.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/youtube-dark.svg`,
      linkPrefix: "https://www.youtube.com/@",
      linkSuffix: "",
    },
    discord: {
      label: "Discord",
      path: `${PROJECT_URL}/icons/socials/discord.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/discord-dark.svg`,
      linkPrefix: "https://discord.com/users/",
      linkSuffix: "",
    },
    instagram: {
      label: "Instragram",
      path: `${PROJECT_URL}/icons/socials/instagram.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/instagram-dark.svg`,
      linkPrefix: "http://www.instagram.com/",
      linkSuffix: "",
    },
    facebook: {
      label: "Facebook",
      path: `${PROJECT_URL}/icons/socials/facebook.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/facebook-dark.svg`,
      linkPrefix: "https://www.facebook.com/",
      linkSuffix: "",
    },
    dribbble: {
      label: "Dribble",
      path: `${PROJECT_URL}/icons/socials/dribbble.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/dribbble-dark.svg`,
      linkPrefix: "https://www.dribbble.com/",
      linkSuffix: "",
    },
    behance: {
      label: "Behance",
      path: `${PROJECT_URL}/icons/socials/behance.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/behance-dark.svg`,
      linkPrefix: "https://www.behance.com/",
      linkSuffix: "",
    },
    codesandbox: {
      label: "CodeSandbox",
      path: `${PROJECT_URL}/icons/socials/codesandbox.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/codesandbox-dark.svg`,
      linkPrefix: "https://codesandbox.io/u/",
      linkSuffix: "",
    },
    codepen: {
      label: "CodePen",
      path: `${PROJECT_URL}/icons/socials/codepen.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/codepen-dark.svg`,
      linkPrefix: "https://www.codepen.io/",
      linkSuffix: "",
    },
    stackoverflow: {
      label: "Stack Overflow",
      path: `${PROJECT_URL}/icons/socials/stackoverflow.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/stackoverflow-dark.svg`,
      linkPrefix: "https://www.stackoverflow.com/users/",
      linkSuffix: "",
    },
    rss: {
      label: "RSS",
      path: `${PROJECT_URL}/icons/socials/rss.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/rss-dark.svg`,
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
  support: supportStore,
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
    // Section reordering actions
    case ACTIONS.REORDER_SECTIONS:
      return {
        ...state,
        sectionOrder: action.payload.newOrder,
      };
    case ACTIONS.MOVE_SECTION_UP:
      const { sectionToMove: sectionUp } = action.payload;
      const currentIndexUp = state.sectionOrder.indexOf(sectionUp);
      if (currentIndexUp > 0) {
        const newOrderUp = [...state.sectionOrder];
        [newOrderUp[currentIndexUp], newOrderUp[currentIndexUp - 1]] = [
          newOrderUp[currentIndexUp - 1],
          newOrderUp[currentIndexUp],
        ];
        return {
          ...state,
          sectionOrder: newOrderUp,
        };
      }
      return state;
    case ACTIONS.MOVE_SECTION_DOWN:
      const { sectionToMove: sectionDown } = action.payload;
      const currentIndexDown = state.sectionOrder.indexOf(sectionDown);
      if (currentIndexDown < state.sectionOrder.length - 1) {
        const newOrderDown = [...state.sectionOrder];
        [newOrderDown[currentIndexDown], newOrderDown[currentIndexDown + 1]] = [
          newOrderDown[currentIndexDown + 1],
          newOrderDown[currentIndexDown],
        ];
        return {
          ...state,
          sectionOrder: newOrderDown,
        };
      }
      return state;
    case ACTIONS.RESET_SECTION_ORDER:
      return {
        ...state,
        sectionOrder: [
          "introduction",
          "skills",
          "socials",
          "badges",
          "support",
        ],
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
