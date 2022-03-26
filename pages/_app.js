import React, { useReducer, createContext, useEffect } from "react";
import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "next-themes";

export const StateContext = createContext(null);

export const ACTIONS = {
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
};

// Icon Store
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
      name: "Fast API",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/fastapi-colored.svg",
      iTag: "fastapi",
      link: "https://fastapi.tiangolo.com/",
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
      name: "Supabase",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg",
      iTag: "supabase",
      link: "https://supabase.io/",
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
      path: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
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
  web3: [
    {
      name: "Uniswap",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/uniswap-colored.svg",
      iTag: "uniswap",
      link: "https://uniswap.org/",
    },
    {
      name: "AAVE",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aave-colored.svg",
      iTag: "aave",
      link: "https://aave.com/",
    },
    {
      name: "Sushiswap",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sushiswap-colored.svg",
      iTag: "sushiswap",
      link: "https://www.sushi.com/",
    },
    {
      name: "MetaMask",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/metamask-colored.svg",
      iTag: "metamask",
      link: "https://metamask.io/",
    },
    {
      name: "Argent",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/argent-colored.svg",
      iTag: "argent",
      link: "https://www.argent.xyz/",
    },
    {
      name: "Nansen",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nansen-colored.svg",
      iTag: "nansen",
      link: "https://www.nansen.ai/",
    },
    {
      name: "Chainlink",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/chainlink-colored.svg",
      iTag: "chainlink",
      link: "https://chain.link/",
    },
    {
      name: "The Graph",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/the-graph-colored.svg",
      iTag: "the-graph",
      link: "https://thegraph.com/en/",
    },
    {
      name: "Ethers",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ethers-colored.svg",
      iTag: "ethers",
      link: "https://ethers.io",
    },
    {
      name: "Web3Js",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/web3js-colored.svg",
      iTag: "web3js",
      link: "https://web3js.readthedocs.io/en/v1.7.1/#",
    },
    {
      name: "Alchemy",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/alchemy-colored.svg",
      iTag: "alchemy",
      link: "https://docs.alchemy.com/alchemy/documentation/alchemy-web3",
    },
    {
      name: "Hardhat",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/hardhat-colored.svg",
      iTag: "hardhat",
      link: "https://hardhat.org/",
    },
    {
      name: "Truffle",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/truffle-colored.svg",
      iTag: "truffle",
      link: "https://trufflesuite.com",
    },
    {
      name: "IPFS",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ipfs-colored.svg",
      iTag: "ipfs",
      link: "https://ipfs.io/",
    },
    {
      name: "Filebase",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/filebase-colored.svg",
      iTag: "filebase",
      link: "https://filebase.com/",
    },
    {
      name: "Arweave",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/arweave-colored.svg",
      iTag: "arweave",
      link: "https://www.arweave.org/",
    },
    {
      name: "Ethereum",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ethereum-colored.svg",
      iTag: "ethereum",
      link: "https://ethereum.org/en/",
    },
    {
      name: "Polygon",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/polygon-colored.svg",
      iTag: "polygon",
      link: "https://polygon.technology/",
    },
    {
      name: "Arbitrum",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/arbitrum-colored.svg",
      iTag: "arbitrum",
      link: "https://portal.arbitrum.one/",
    },
    {
      name: "Avalanche",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/avalanche-colored.svg",
      iTag: "avalanche",
      link: "https://www.avax.network/",
    },
    {
      name: "Near",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/near-colored.svg",
      iTag: "near",
      link: "https://near.academy/",
    },
    {
      name: "Flow",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/flow-colored.svg",
      iTag: "flow",
      link: "https://www.onflow.org/",
    },
    {
      name: "Solana",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/solana-colored.svg",
      iTag: "solana",
      link: "https://solana.com/",
    },
    {
      name: "Terra",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/terra-colored.svg",
      iTag: "terra",
      link: "https://www.terra.money/",
    },
  ],
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
    codepen: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codepen.svg",
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
    default:
      throw new Error();
  }
}

function MyApp({ Component, pageProps }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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
      <ThemeProvider attribute="class">
        <StateContext.Provider value={{ state, dispatch }}>
          <Component {...pageProps} />
        </StateContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
