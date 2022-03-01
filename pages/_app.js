import React, { useReducer, createContext } from "react";
import "../styles/globals.css";

export const StateContext = createContext(null);

export const ACTIONS = {
  ADD_INTRODUCTION: "add-introduction",
  SELECT_RENDER_MODE: "select-render-mode",
  ADD_SKILL: "add-skill",
  REMOVE_SKILL: "remove-skill",
  ADD_SOCIAL_PROFILE: "add-social-profile",
  TOGGLE_BADGE: "toggle-badge",
  TOGGLE_GITHUB_STATS: "toggle-github-stats",
};

export const iconData = {
  core: [
    {
      name: "C",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-plain.svg",
      iTag: "c-plain",
    },
    {
      name: "C++",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-plain.svg",
      iTag: "cplusplus-plain",
    },
    {
      name: "C#",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-plain.svg",
      iTag: "csharp-plain",
    },
    {
      name: "Coffeescript",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/coffeescript/coffeescript-original.svg",
      iTag: "coffeescript-original",
    },
    {
      name: "Go",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
      iTag: "go-original-wordmark",
    },
    {
      name: "Java",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      iTag: "java-plain",
    },
    {
      name: "Javascript",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      iTag: "javascript-plain",
    },
    {
      name: "Perl",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
      iTag: "perl-plain",
    },
    {
      name: "PHP",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg",
      iTag: "php-plain",
    },
    {
      name: "Python",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      iTag: "python-plain",
    },
    {
      name: "Ruby",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-plain.svg",
      iTag: "ruby-plain",
    },
    {
      name: "Rust",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
      iTag: "rust-plain",
    },
    {
      name: "Swift",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
      iTag: "swift-plain",
    },
    {
      name: "Typescript",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      iTag: "typescript-original",
    },
  ],
  frontend: [
    {
      name: "HTML5",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg",
      iTag: "html5-plain",
    },
    {
      name: "React",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      iTag: "react-original",
    },
    {
      name: "NextJs",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      iTag: "nextjs-original",
    },
    {
      name: "Vue",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-plain.svg",
      iTag: "vuejs-plain",
    },
    {
      name: "Nuxtjs",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
      iTag: "nuxtjs-plain",
    },
    {
      name: "Gatsby",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-plain.svg",
      iTag: "gatsby-plain",
    },
    {
      name: "Angular",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-plain.svg",
      iTag: "angularjs-plain",
    },
    {
      name: "JQuery",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-plain.svg",
      iTag: "jquery-plain",
    },
    {
      name: "CSS3",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg",
      iTag: "css3-plain",
    },
    {
      name: "Sass",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
      iTag: "sass-original",
    },
    {
      name: "TailwindCSS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
      iTag: "tailwindcss-plain",
    },
    {
      name: "Bootstrap",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg",
      iTag: "bootstrap-plain",
    },
    {
      name: "Material UI",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
      iTag: "materialui-plain",
    },
    {
      name: "Redux",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
      iTag: "redux-original",
    },
    {
      name: "Webpack",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg",
      iTag: "webpack-plain",
    },
    {
      name: "Babel",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg",
      iTag: "babel-plain",
    },
  ],
  backend: [
    {
      name: "NodeJS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      iTag: "nodejs-plain",
    },
    {
      name: "ExpressJS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      iTag: "express-original",
    },
    {
      name: "GraphQL",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      iTag: "graphql-plain",
    },
    {
      name: "Oracle",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-plain.svg",
      iTag: "oracle-plain",
    },
    {
      name: "NestJS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg",
      iTag: "nestjs-plain",
    },
    {
      name: "MongoDB",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      iTag: "mongodb-plain",
    },
    {
      name: "MySQL",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      iTag: "mysql-plain",
    },
    {
      name: "PostgreSQL",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-plain.svg",
      iTag: "postgresql-plain",
    },
    {
      name: "Firebase",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      iTag: "firebase-plain",
    },
    {
      name: "Appwrite",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/appwrite/appwrite-original.svg",
      iTag: "appwrite-plain",
    },
    {
      name: "Heroku",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg",
      iTag: "heroku-original",
    },
  ],
  other: [
    {
      name: ".NET",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
      iTag: "dot-net-plain",
    },
    {
      name: "Django",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg",
      iTag: "django-plain",
    },
    {
      name: "Lavarel",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg",
      iTag: "laravel-plain",
    },
  ],
  software: [
    {
      name: "Photoshop",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
      iTag: "photoshop-plain",
    },
    {
      name: "Illustrator",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
      iTag: "illustrator-plain",
    },
    {
      name: "After Effects",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg",
      iTag: "aftereffects-plain",
    },
    {
      name: "Premiere Pro",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg",
      iTag: "premierepro-plain",
    },
    {
      name: "XD",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg",
      iTag: "xd-plain",
    },
    {
      name: "Figma",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      iTag: "figma-plain",
    },
    {
      name: "Sketch",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg",
      iTag: "sketch-line-wordmark",
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
    description: "",
    location: "",
    workingOnTitle: "",
    workingOnLink: "",
    learning: "",
    collaborateOn: "",
    aboutMe: "",
    additionalInfo: "",
  },
  // Skills State
  skills: {
    core: [],
    frontend: [],
    backend: [],
    other: [],
    software: [],
  },
  // Socials State
  socials: {
    behance: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/behance.svg",
      linkPrefix: "https://www.behance.com/",
      linkSuffix: "",
    },
    codesandbox: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codesandbox.svg",
      linkPrefix: "https://www.codesandbox.com/",
      linkSuffix: "",
    },
    devdotto: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/devdotto.svg",
      linkPrefix: "https://www.dev.to/",
      linkSuffix: "",
    },
    discord: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/discord.svg",
      linkPrefix: "https://discord.gg/",
      linkSuffix: "",
    },
    dribbble: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/dribbble.svg",
      linkPrefix: "https://www.dribbble.com/",
      linkSuffix: "",
    },
    facebook: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/facebook.svg",
      linkPrefix: "https://www.facebook.com/",
      linkSuffix: "",
    },
    github: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg",
      linkPrefix: "https://www.github.com/",
      linkSuffix: "",
    },
    hashnode: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/hashnode.svg",
      linkPrefix: "http://www.hashnode.com/@",
      linkSuffix: "",
    },
    instagram: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/instagram.svg",
      linkPrefix: "http://www.instagram.com/",
      linkSuffix: "",
    },
    linkedin: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/linkedin.svg",
      linkPrefix: "https://www.linkedin.com/in/",
      linkSuffix: "",
    },
    medium: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium.svg",
      linkPrefix: "http://www.medium.com/",
      linkSuffix: "",
    },
    rss: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/rss.svg",
      linkPrefix: "https://",
      linkSuffix: "",
    },
    stackoverflow: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/stackoverflow.svg",
      linkPrefix: "https://www.stackoverflow.com/users/",
      linkSuffix: "",
    },
    twitch: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitch.svg",
      linkPrefix: "https://www.twitch.tv/",
      linkSuffix: "",
    },
    twitter: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitter.svg",
      linkPrefix: "https://www.twitter.com/",
      linkSuffix: "",
    },
    youtube: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/youtube.svg",
      linkPrefix: "https://www.youtube.com/c/",
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
    },
    twitchStatus: {
      selected: false,
    },
  },
};
// Color Reducer
function reducer(state, action) {
  switch (action.type) {
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
            (item) => item !== action.payload.icon
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
    default:
      throw new Error();
  }
}

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Component {...pageProps} />
    </StateContext.Provider>
  );
}

export default MyApp;
