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
  STYLE_BADGES: "style-badges",
  TOGGLE_STYLE_COLOR: "toggle-style-color",
  ADD_REPO: "add-repo",
  ADD_SUPPORT: "add-support",
};

export const iconData = {
  core: [
    {
      name: "C",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-plain.svg",
      iTag: "devicon-c-plain",
      link: "https://docs.microsoft.com/en-us/cpp/?view=msvc-170",
    },
    {
      name: "C++",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-plain.svg",
      iTag: "devicon-cplusplus-plain",
      link: "https://docs.microsoft.com/en-us/cpp/?view=msvc-170",
    },
    {
      name: "C#",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-plain.svg",
      iTag: "devicon-csharp-plain",
      link: "https://docs.microsoft.com/en-us/dotnet/csharp/",
    },
    {
      name: "Coffeescript",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/coffeescript/coffeescript-original.svg",
      iTag: "devicon-coffeescript-original",
      link: "https://coffeescript.org/",
    },
    {
      name: "Go",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
      iTag: "devicon-go-original-wordmark",
      link: "https://go.dev/doc/",
    },
    {
      name: "Java",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      iTag: "devicon-java-plain",
      link: "https://www.oracle.com/java/",
    },
    {
      name: "Javascript",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      iTag: "devicon-javascript-plain",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
      name: "Perl",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
      iTag: "devicon-perl-plain",
      link: "https://www.perl.org/",
    },
    {
      name: "PHP",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg",
      iTag: "devicon-php-plain",
      link: "https://www.php.net/",
    },
    {
      name: "Python",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      iTag: "devicon-python-plain",
      link: "https://www.python.org/",
    },
    {
      name: "Ruby",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-plain.svg",
      iTag: "devicon-ruby-plain",
      link: "https://www.ruby-lang.org/en/",
    },
    {
      name: "Rust",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
      iTag: "devicon-rust-plain",
      link: "https://www.rust-lang.org/",
    },
    {
      name: "Swift",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
      iTag: "devicon-swift-plain",
      link: "https://developer.apple.com/swift/",
    },
    {
      name: "Typescript",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      iTag: "devicon-typescript-original",
      link: "https://www.typescriptlang.org/",
    },
  ],
  frontend: [
    {
      name: "HTML5",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg",
      iTag: "devicon-html5-plain",
      link: "https://developer.mozilla.org/en-US/docs/Glossary/HTML5",
    },
    {
      name: "React",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      iTag: "devicon-react-original",
      link: "https://reactjs.org/",
    },
    {
      name: "NextJs",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      iTag: "devicon-nextjs-original",
      link: "https://nextjs.org/docs",
    },
    {
      name: "Vue",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-plain.svg",
      iTag: "devicon-vuejs-plain",
      link: "https://vuejs.org/",
    },
    {
      name: "Nuxtjs",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
      iTag: "devicon-nuxtjs-plain",
      link: "https://nuxtjs.org/",
    },
    {
      name: "Gatsby",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-plain.svg",
      iTag: "devicon-gatsby-plain",
      link: "https://www.gatsbyjs.com/",
    },
    {
      name: "Angular",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-plain.svg",
      iTag: "devicon-angularjs-plain",
      link: "https://angular.io/",
    },
    {
      name: "JQuery",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-plain.svg",
      iTag: "devicon-jquery-plain",
      link: "https://jquery.com/",
    },
    {
      name: "CSS3",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg",
      iTag: "devicon-css3-plain",
      link: "https://www.w3.org/TR/CSS/#css",
    },
    {
      name: "Sass",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
      iTag: "devicon-sass-original",
      link: "https://sass-lang.com/",
    },
    {
      name: "TailwindCSS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
      iTag: "devicon-tailwindcss-plain",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Bootstrap",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg",
      iTag: "devicon-bootstrap-plain",
      link: "https://getbootstrap.com/",
    },
    {
      name: "Material UI",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
      iTag: "devicon-materialui-plain",
      link: "https://mui.com/",
    },
    {
      name: "Redux",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
      iTag: "devicon-redux-original",
      link: "https://redux.js.org/",
    },
    {
      name: "Webpack",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg",
      iTag: "devicon-webpack-plain",
      link: "https://webpack.js.org/",
    },
    {
      name: "Babel",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/babel/babel-original.svg",
      iTag: "devicon-babel-plain",
      link: "https://babeljs.io/",
    },
  ],
  backend: [
    {
      name: "NodeJS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      iTag: "devicon-nodejs-plain",
      link: "https://nodejs.org/en/",
    },
    {
      name: "ExpressJS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      iTag: "devicon-express-original",
      link: "https://expressjs.com/",
    },
    {
      name: "GraphQL",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
      iTag: "devicon-graphql-plain",
      link: "https://graphql.org/",
    },
    {
      name: "Oracle",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
      iTag: "devicon-oracle-original",
      link: "https://www.oracle.com/uk/index.html",
    },
    {
      name: "NestJS",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg",
      iTag: "devicon-nestjs-plain",
      link: "https://docs.nestjs.com/",
    },
    {
      name: "MongoDB",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      iTag: "devicon-mongodb-plain",
      link: "https://www.mongodb.com/",
    },
    {
      name: "MySQL",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      iTag: "devicon-mysql-plain",
      link: "https://www.mysql.com/",
    },
    {
      name: "PostgreSQL",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-plain.svg",
      iTag: "devicon-postgresql-plain",
      link: "https://www.postgresql.org/",
    },
    {
      name: "Firebase",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      iTag: "devicon-firebase-plain",
      link: "https://firebase.google.com/",
    },
    {
      name: "Appwrite",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/appwrite/appwrite-original.svg",
      iTag: "devicon-appwrite-plain",
      link: "https://appwrite.io/",
    },
    {
      name: "Heroku",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg",
      iTag: "devicon-heroku-original",
      link: "https://www.heroku.com/",
    },
    {
      name: "Flask",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
      iTag: "devicon-flask-original",
      link: "https://flask.palletsprojects.com/en/2.0.x/",
    },
    {
      name: "Fast API",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/fastapi.svg",
      iTag: "bg-[url('https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/fastapi.svg')] w-9 h-9",
      link: "https://fastapi.tiangolo.com/",
    },
  ],
  other: [
    {
      name: ".NET",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
      iTag: "devicon-dot-net-plain",
      link: "https://dotnet.microsoft.com/en-us/",
    },
    {
      name: "Django",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg",
      iTag: "devicon-django-plain",
      link: "https://www.djangoproject.com/",
    },
    {
      name: "Lavarel",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg",
      iTag: "devicon-laravel-plain",
      link: "https://laravel.com/",
    },
  ],
  software: [
    {
      name: "Photoshop",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
      iTag: "devicon-photoshop-plain",
      link: "https://www.adobe.com/uk/products/photoshop.html",
    },
    {
      name: "Illustrator",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg",
      iTag: "devicon-illustrator-plain",
      link: "adobe.com/uk/products/illustrator.html",
    },
    {
      name: "After Effects",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg",
      iTag: "devicon-aftereffects-plain",
      link: "https://www.adobe.com/uk/products/aftereffects.html",
    },
    {
      name: "Premiere Pro",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg",
      iTag: "devicon-premierepro-plain",
      link: "https://www.adobe.com/uk/products/premiere.html",
    },
    {
      name: "XD",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg",
      iTag: "devicon-xd-plain",
      link: "https://www.adobe.com/uk/products/xd.html",
    },
    {
      name: "Figma",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
      iTag: "devicon-figma-plain",
      link: "https://www.figma.com/",
    },
    {
      name: "Sketch",
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg",
      iTag: "devicon-sketch-line-wordmark",
      link: "https://www.sketch.com/",
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
  },
  // Socials State
  socials: {
    github: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/github.svg",
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
      linkPrefix: "http://www.hashnode.com/@",
      linkSuffix: "",
    },
    medium: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium.svg",
      linkPrefix: "http://www.medium.com/",
      linkSuffix: "",
    },
    devdotto: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/devdotto.svg",
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
      linkPrefix: "https://www.youtube.com/c/",
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
      linkPrefix: "https://www.codesandbox.com/",
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
      titleColor: "3382ed",
      titleColorEdit: false,
      textColor: "ffffff",
      textColorEdit: false,
      iconColor: "3382ed",
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
