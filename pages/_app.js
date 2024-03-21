import React, { createContext, useEffect } from "react";
import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "next-themes";
import { useReducerWithMiddleware } from "../hooks";
import storeStateMiddleware from "../middleware/storeStateMiddleware";

export const StateContext = createContext(null);

export const STORED_STATE_KEY = "profileMeLocalStateMar24";

const PROJECT_URL = process.env.NODE_ENV === 'production'
  ? 'https://raw.githubusercontent.com/danielcranney/readme-generator/main/public'
  : 'http://localhost:3000'

// Icon Store
export const iconData = {
  core: [
    {
      name: "C",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/c-colored.svg",
      iTag: "c",
      link: "https://docs.microsoft.com/en-us/cpp/?view=msvc-170",
    },
    {
      name: "C++",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/cplusplus-colored.svg",
      iTag: "cplusplus",
      link: "https://docs.microsoft.com/en-us/cpp/?view=msvc-170",
    },
    {
      name: "C#",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/csharp-colored.svg",
      iTag: "csharp",
      link: "https://docs.microsoft.com/en-us/dotnet/csharp/",
    },
    {
      name: "Coffeescript",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/coffeescript-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/coffeescript-colored-dark.svg",
      iTag: "coffeescript",
      link: "https://coffeescript.org/",
    },
    {
      name: "Dart",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/dart-colored.svg",
      iTag: "dart",
      link: "https://dart.dev/",
    },
    {
      name: "Git",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/git-colored.svg",
      iTag: "git",
      link: "https://git-scm.com/",
    },
    {
      name: "Go",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/go-colored.svg",
      iTag: "go",
      link: "https://go.dev/doc/",
    },
    {
      name: "Java",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/java-colored.svg",
      iTag: "java",
      link: "https://www.oracle.com/java/",
    },
    {
      name: "JavaScript",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg",
      iTag: "javascript",
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
      name: "Kotlin",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/kotlin-colored.svg",
      iTag: "kotlin",
      link: "https://kotlinlang.org/",
    },
    {
      name: "Perl",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/perl-colored.svg",
      iTag: "perl",
      link: "https://www.perl.org/",
    },
    {
      name: "PHP",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/php-colored.svg",
      iTag: "php",
      link: "https://www.php.net/",
    },
    {
      name: "Python",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg",
      iTag: "python",
      link: "https://www.python.org/",
    },
    {
      name: "rlang",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/rlang-colored.svg",
      iTag: "rlang",
      link: "https://www.r-project.org/",
    },
    {
      name: "Ruby",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ruby-colored.svg",
      iTag: "ruby",
      link: "https://www.ruby-lang.org/en/",
    },
    {
      name: "Rust",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/rust-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/rust-colored-dark.svg",
      iTag: "rust",
      link: "https://www.rust-lang.org/",
    },
    {
      name: "Swift",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/swift-colored.svg",
      iTag: "swift",
      link: "https://developer.apple.com/swift/",
    },
    {
      name: "TypeScript",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg",
      iTag: "typescript",
      link: "https://www.typescriptlang.org/",
    },
  ],
  scripting: [
    {
      name: "GNU Bash",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/gnubash.svg",
      iTag: "gnubash",
      link: "https://www.gnu.org/software/bash/",
    },
  ],
  editors: [
    {
      name: "VS Code",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/visualstudiocode.svg",
      iTag: "visualstudiocode",
      link: "https://code.visualstudio.com/",
    },
    {
      name: "Vim",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vim.svg",
      iTag: "vim",
      link: "https://www.vim.org/",
    },
    {
      name: "Neovim",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/neovim.svg",
      iTag: "neovim",
      link: "https://neovim.io/",
    },
    {
      name: "Sublime Text",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sublimetext.svg",
      iTag: "sublimetext",
      link: "https://www.sublimetext.com/index2",
    },
    {
      name: "XCode",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/xcode.svg",
      iTag: "xcode",
      link: "https://www.xcode.com",
    },
  ],
  frontend: [
    {
      name: "HTML5",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg",
      iTag: "html5",
      link: "https://developer.mozilla.org/en-US/docs/Glossary/HTML5",
    },
    {
      name: "React",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg",
      iTag: "react",
      link: "https://reactjs.org/",
    },
    {
      name: "NextJs",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored-dark.svg",
      iTag: "nextjs",
      link: "https://nextjs.org/docs",
    },
    {
      name: "Vue",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vuejs-colored.svg",
      iTag: "vuejs",
      link: "https://vuejs.org/",
    },
    {
      name: "Nuxtjs",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nuxtjs-colored.svg",
      iTag: "nuxtjs",
      link: "https://nuxtjs.org/",
    },
    {
      name: "Gatsby",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/gatsby-colored.svg",
      iTag: "gatsby",
      link: "https://www.gatsbyjs.com/",
    },
    {
      name: "Angular",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/angularjs-colored.svg",
      iTag: "angularjs",
      link: "https://angular.io/",
    },
    {
      name: "JQuery",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/jquery-colored.svg",
      iTag: "jquery",
      link: "https://jquery.com/",
    },
    {
      name: "CSS3",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/css3-colored.svg",
      iTag: "css3",
      link: "https://www.w3.org/TR/CSS/#css",
    },
    {
      name: "Sass",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sass-colored.svg",
      iTag: "sass",
      link: "https://sass-lang.com/",
    },
    {
      name: "TailwindCSS",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg",
      iTag: "tailwindcss",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Chakra UI",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/chakra-colored.svg",
      iTag: "chakra",
      link: "https://chakra-ui.com/",
    },
    {
      name: "Bootstrap",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/bootstrap-colored.svg",
      iTag: "bootstrap",
      link: "https://getbootstrap.com/",
    },
    {
      name: "Material UI",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/materialui-colored.svg",
      iTag: "materialui",
      link: "https://mui.com/",
    },
    {
      name: "Redux",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/redux-colored.svg",
      iTag: "redux",
      link: "https://redux.js.org/",
    },
    {
      name: "Webpack",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/webpack-colored.svg",
      iTag: "webpack",
      link: "https://webpack.js.org/",
    },
    {
      name: "Babel",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/babel-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/babel-colored-dark.svg",
      iTag: "babel",
      link: "https://babeljs.io/",
    },
    {
      name: "Svelte",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/svelte-colored.svg",
      iTag: "svelte",
      link: "https://svelte.dev/",
    },
    {
      name: "Vite",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vite-colored.svg",
      iTag: "vite",
      link: "https://vitejs.dev/",
    },
    {
      name: "Remix",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/remix-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/remix-colored-dark.svg",
      iTag: "remix",
      link: "https://remix.run/",
    },
  ],
  backend: [
    {
      name: "NodeJS",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg",
      iTag: "nodejs",
      link: "https://nodejs.org/en/",
    },
    {
      name: "Express",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored-dark.svg",
      iTag: "express",
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
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/graphql-colored.svg",
      iTag: "graphql",
      link: "https://graphql.org/",
    },
    {
      name: "Oracle",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/oracle-colored.svg",
      iTag: "oracle",
      link: "https://www.oracle.com/uk/index.html",
    },
    {
      name: "NestJS",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nestjs-colored.svg",
      iTag: "nestjs",
      link: "https://docs.nestjs.com/",
    },
    {
      name: "MongoDB",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg",
      iTag: "mongodb",
      link: "https://www.mongodb.com/",
    },
    {
      name: "MySQL",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mysql-colored.svg",
      iTag: "mysql",
      link: "https://www.mysql.com/",
    },
    {
      name: "PostgreSQL",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/postgresql-colored.svg",
      iTag: "postgresql",
      link: "https://www.postgresql.org/",
    },
    {
      name: "Firebase",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/firebase-colored.svg",
      iTag: "firebase",
      link: "https://firebase.google.com/",
    },
    {
      name: "Appwrite",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/appwrite-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/appwrite-colored-dark.svg",
      iTag: "appwrite",
      link: "https://appwrite.io/",
    },
    {
      name: "Heroku",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/heroku-colored.svg",
      iTag: "heroku",
      link: "https://www.heroku.com/",
    },
    {
      name: "Flask",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/flask-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/flask-colored-dark.svg",
      iTag: "flask",
      link: "https://flask.palletsprojects.com/en/2.0.x/",
    },
    {
      name: "Render",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/render-colored.svg",
      iTag: "render",
      link: "https://render.com/",
    },
    {
      name: "Supabase",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg",
      iTag: "supabase",
      link: "https://supabase.io/",
    },
  ],
  software: [
    {
      name: "Photoshop",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/photoshop-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/photoshop-colored-dark.svg",
      iTag: "photoshop",
      link: "https://www.adobe.com/uk/products/photoshop.html",
    },
    {
      name: "Illustrator",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/illustrator-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/illustrator-colored-dark.svg",
      iTag: "illustrator",
      link: "https://www.adobe.com/uk/products/illustrator.html",
    },
    {
      name: "After Effects",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aftereffects-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aftereffects-colored-dark.svg",
      iTag: "aftereffects",
      link: "https://www.adobe.com/uk/products/aftereffects.html",
    },
    {
      name: "Premiere Pro",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/premierepro-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/premierepro-colored-dark.svg",
      iTag: "premierepro",
      link: "https://www.adobe.com/uk/products/premiere.html",
    },
    {
      name: "XD",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/xd-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/xd-colored-dark.svg",
      iTag: "xd",
      link: "https://www.adobe.com/uk/products/xd.html",
    },
    {
      name: "Figma",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/figma-colored.svg",
      iTag: "figma",
      link: "https://www.figma.com/",
    },
    {
      name: "Sketch",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sketch-colored.svg",
      iTag: "sketch",
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
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/ipfs-colored-dark.svg",
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
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/arweave-colored-dark.svg",
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
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/near-colored-dark.svg",
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
  cloud: [
    {
      name: "Google Cloud",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/googlecloud-colored.svg",
      iTag: "googlecloud",
      link: "https://cloud.google.com/",
    },
  ],
  cms: [
    {
      name: "Wordpress",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/wordpress-colored.svg",
      iTag: "wordpress",
      link: "https://wordpress.com",
    },
    {
      name: "Framer",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/framer-colored.svg",
      iTag: "framer",
      link: "https://framer.com",
    },
    {
      name: "Squarespace",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/squarespace-colored.svg",
      iTag: "squarespace",
      link: "https://squarespace.com",
    },
    {
      name: "Wix",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/wix-colored.svg",
      iTag: "wix",
      link: "https://wix.com",
    },
  ],
  other: [
    {
      name: ".NET",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/dot-net-colored.svg",
      iTag: "dot-net",
      link: "https://dotnet.microsoft.com/en-us/",
    },
    {
      name: "Django",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/django-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/django-colored-dark.svg",
      iTag: "django",
      link: "https://www.djangoproject.com/",
    },
    {
      name: "Laravel",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/laravel-colored.svg",
      iTag: "laravel",
      link: "https://laravel.com/",
    },
    {
      name: "Flutter",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/flutter-colored.svg",
      iTag: "flutter",
      link: "https://flutter.dev/",
    },
    {
      name: "Amazon Web Services",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aws-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/aws-colored-dark.svg",
      iTag: "aws",
      link: "https://aws.amazon.com",
    },
    {
      name: "Arduino",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/arduino-colored.svg",
      iTag: "arduino",
      link: "https://store.arduino.cc/?gclid=Cj0KCQjw2eilBhCCARIsAG0Pf8uueBifykWcsSS4LPESeGQfxGVKJYnzV7bz471XfknQJy_1VINVWM8aAkLtEALw_wcB",
    },
    {
      name: "Blender",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/blender-colored.svg",
      iTag: "blender",
      link: "https://www.blender.org/",
    },
    {
      name: "Digital Ocean",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/digitalocean-colored.svg",
      iTag: "digitalocean",
      link: "https://www.digitalocean.com",
    },
    {
      name: "Docker",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/docker-colored.svg",
      iTag: "docker",
      link: "https://www.docker.com/",
    },
    {
      name: "Linux",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/linux-colored.svg",
      iTag: "linux",
      link: "https://www.linux.org",
    },
    {
      name: "MacOS",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/macos-colored.svg",
      darkPath:
        "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/macos-colored-dark.svg",
      iTag: "macos",
      link: "https://apple.com",
    },
    {
      name: "PyTorch",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/pytorch-colored.svg",
      iTag: "pytorch",
      link: "https://pytorch.org/",
    },
    {
      name: "Raspberry Pi",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/raspberrypi-colored.svg",
      iTag: "raspberrypi",
      link: "https://www.raspberrypi.org/",
    },
    {
      name: "TensorFlow",
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tensorflow-colored.svg",
      iTag: "tensorflow",
      link: "https://www.tensorflow.org/",
    },
  ],
};

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

/**
 * Temporary store for dynamically creating
 * support anchors for first-time and re-visiting users.
 * */
export const supportStore = {
  buymeacoffee: {
    path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/support/buymeacoffee.svg",
    previewIMG: "https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png",
    linkPrefix: "https://www.buymeacoffee.com/",
    linkSuffix: "",
  },
  kofi: {
    path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/support/kofi.svg",
    previewIMG: "https://storage.ko-fi.com/cdn/kofi2.png?v=3",
    linkPrefix: "https://www.ko-fi.com/",
    linkSuffix: "",
  },
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
    scripting: [],
    editors: [],
    frontend: [],
    backend: [],
    software: [],
    web3: [],
    cloud: [],
    cms: [],
    other: [],
  },
  // Socials State
  socials: {
    github: {
      path: `${PROJECT_URL}/icons/socials/github.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/github-dark.svg`,
      linkPrefix: "https://www.github.com/",
      linkSuffix: "",
    },
    gitlab: {
      path: "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/gitlab.svg",
      linkPrefix: "https://www.gitlab.com/",
      linkSuffix: "",
    },
    twitter: {
      path: `${PROJECT_URL}/icons/socials/twitter.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/twitter-dark.svg`,
      linkPrefix: "https://www.x.com/",
      linkSuffix: "",
    },
    threads: {
      path: `${PROJECT_URL}/icons/socials/threads.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/threads-dark.svg`,
      linkPrefix: "https://www.threads.net/@",
      linkSuffix: "",
    },
    hashnode: {
      path: `${PROJECT_URL}/icons/socials/hashnode.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/hashnode-dark.svg`,
      linkPrefix: "https://",
      linkSuffix: "",
      linkSuffixTwo: ".hashnode.dev",
    },
    medium: {
      path: `${PROJECT_URL}/icons/socials/medium.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/medium-dark.svg`,
      linkPrefix: "http://www.medium.com/",
      linkSuffix: "",
    },
    devdotto: {
      path: `${PROJECT_URL}/icons/socials/devdotto.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/devdotto-dark.svg`,
      linkPrefix: "https://www.dev.to/",
      linkSuffix: "",
    },
    linkedin: {
      path: `${PROJECT_URL}/icons/socials/linkedin.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/linkedin-dark.svg`,
      linkPrefix: "https://www.linkedin.com/in/",
      linkSuffix: "",
    },
    polywork: {
      path: `${PROJECT_URL}/icons/socials/polywork.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/polywork-dark.svg`,
      linkPrefix: "https://www.polywork.com/",
      linkSuffix: "",
    },
    twitch: {
      path: `${PROJECT_URL}/icons/socials/twitch.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/twitch-dark.svg`,
      linkPrefix: "https://www.twitch.tv/",
      linkSuffix: "",
    },
    youtube: {
      path: `${PROJECT_URL}/icons/socials/youtube.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/youtube-dark.svg`,
      linkPrefix: "https://www.youtube.com/@",
      linkSuffix: "",
    },
    discord: {
      path: `${PROJECT_URL}/icons/socials/discord.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/discord-dark.svg`,
      linkPrefix: "https://discord.com/users/",
      linkSuffix: "",
    },
    instagram: {
      path: `${PROJECT_URL}/icons/socials/instagram.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/instagram-dark.svg`,
      linkPrefix: "http://www.instagram.com/",
      linkSuffix: "",
    },
    facebook: {
      path: `${PROJECT_URL}/icons/socials/facebook.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/facebook-dark.svg`,
      linkPrefix: "https://www.facebook.com/",
      linkSuffix: "",
    },
    dribbble: {
      path: `${PROJECT_URL}/icons/socials/dribbble.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/dribbble-dark.svg`,
      linkPrefix: "https://www.dribbble.com/",
      linkSuffix: "",
    },
    behance: {
      path: `${PROJECT_URL}/icons/socials/behance.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/behance-dark.svg`,
      linkPrefix: "https://www.behance.com/",
      linkSuffix: "",
    },
    codesandbox: {
      path: `${PROJECT_URL}/icons/socials/codesandbox.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/codesandbox-dark.svg`,
      linkPrefix: "https://codesandbox.io/u/",
      linkSuffix: "",
    },
    codepen: {
      path: `${PROJECT_URL}/icons/socials/codepen.svg`,
      darkPath:
        `${PROJECT_URL}/icons/socials/codepen-dark.svg`,
      linkPrefix: "https://www.codepen.io/",
      linkSuffix: "",
    },
    stackoverflow: {
      path: `${PROJECT_URL}/icons/socials/stackoverflow.svg`,
      darkPath: `${PROJECT_URL}/icons/socials/stackoverflow-dark.svg`,
      linkPrefix: "https://www.stackoverflow.com/users/",
      linkSuffix: "",
    },
    rss: {
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
