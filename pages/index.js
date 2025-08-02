import React, { useContext } from "react";
import LandingLayout from "../components/layouts/LandingLayout";
import Image from "next/image";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { StateContext } from "./_app";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import {
  outerContainer,
  heroItem,
  slideUpContainer,
  slideFromLeft,
  slideFromRight,
  slideFromBottom,
} from "../lib/framerMotion";

export default function Home() {
  const router = useRouter();
  const codeString = `Hi 👋 My name is Peter Parker
=============================

Web Developer
-------------

* 🌍  I'm based in London, England
* 🖥️  See my portfolio at [peterparker.com](http://peterparker.com)
* ✉️  You can contact me at [peter@pparker.com](mailto:peter@pparker.com)
* 🚀  I'm currently working on [peterparker.com](http://peterparker.com)
* 🧠  I'm learning a new JavaScript framework
* 🤝  I'm open to collaborating on interesting JavaScript projects
* ⚡  I moonlight as a super hero`;

  const { state, dispatch } = useContext(StateContext);

  return (
    <>
      {/* First Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 min-h-screen relative">
        <motion.article
          initial="hidden"
          animate="visible"
          variants={heroItem}
          transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
          viewport={{ once: true }}
          className="container mx-auto flex flex-col items-center gap-y-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center leading-tight mb-0">
            Create an amazing
            <br />
            <span className="text-brand">GitHub profile</span> in minutes
          </h1>
          <p className="text-lg text-center">
            Show off your skills, experience and projects. Generate markdown for
            your profile with just a few clicks!
          </p>
          <div className="flex items-center gap-x-4">
            <a
              href="https://github.com/danielcranney/profileme-dev/"
              target="_blank"
              rel="noreferrer"
              className="transition-all duration-150 ease-in-out btn-gray btn-sm sm:btn-md md:btn-lg"
            >
              Visit Repo (Developers)
            </a>

            <button
              onClick={() => {
                router.push("/create-profile");
              }}
              className="transition-all duration-150 ease-in-out btn-brand btn-sm sm:btn-md md:btn-lg"
            >
              Create Profile
            </button>
          </div>
          <a
            className="transition-all duration-150 ease-in-out btn-gray btn-sm sm:btn-sm tracking-wide"
            href="https://github.com/sponsors/danielcranney"
            rel="noreferrer"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2 icon icon-tabler icon-tabler-heart"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
            </svg>
            Sponsor Project
          </a>
        </motion.article>
      </section>
      {/* Second Section */}
      <section className="z-10 w-full flex items-center bg-light-100 dark:bg-dark-800 h-auto -mt-20">
        <motion.article
          initial="hidden"
          animate="visible"
          variants={slideUpContainer}
          transition={{
            y: { type: "spring", bounce: 0.3, duration: 0.6 },
            default: { duration: 2 },
          }}
          className="container mx-auto flex flex-col items-center"
        >
          <div className="w-full sm:w-4/5 flex relative">
            <div className="absolute w-full h-full bg-gradient-to-t dark:from-dark-800 from-light-100"></div>

            <img
              src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/screenshot.png"
              className="overflow-hidden rounded-md shadow-dark-900/5"
              width="100%"
              alt="Screenshot of ProfileMe.dev"
            />
          </div>
        </motion.article>
      </section>
      {/* Third Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex-col flex items-start">
          <div className="flex flex-col md:flex-row w-full items-center gap-x-8 gap-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideFromLeft}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
              className="flex flex-col w-full md:w-1/2 items-center md:items-start gap-y-4"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-0">
                Show off your <span className="text-brand">skills</span>
              </h2>
              <p className="text-lg text-center md:text-left mb-0">
                Select from over 60 core languages, frameworks, backend
                technologies and web 3 tech.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideFromRight}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
              className="flex flex-col gap-y-4 md:ml-auto"
            >
              <div className="flex gap-x-4 items-center">
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/c-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="C icon"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="HTML5"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="JavaScript"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Tailwind CSS"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="TypeScript"
                  />
                </div>
              </div>

              <div className="flex gap-x-4 items-center">
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/php-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="PHP"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vuejs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Vue JS"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Supabase"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/figma-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Figma"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="React JS"
                  />
                </div>
              </div>

              <div className="flex gap-x-4 items-center">
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nuxtjs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Next JS"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nestjs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Nest JS"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/angularjs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Angular JS"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/babel-colored.svg"
                    width="100%"
                    className="flex dark:hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Babel"
                  />
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/babel-dark.svg"
                    width="100%"
                    className="dark:flex hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Babel"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Python"
                  />
                </div>
              </div>

              <div className="flex gap-x-4 items-center">
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/firebase-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Firebase"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/flutter-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Flutter"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored.svg"
                    width="100%"
                    className="flex dark:hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Express JS"
                  />
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-dark.svg"
                    width="100%"
                    className="hidden dark:flex scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Express JS"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/gatsby-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Gatbsy"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/graphql-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="GraphQL"
                  />
                </div>
              </div>

              <div className="flex gap-x-4 items-center">
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/bootstrap-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Bootstrap"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/swift-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Swift"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/dart-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Dart"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/svelte-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Svelte"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sass-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="SaaS"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </article>
      </section>
      {/* Fourth Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex-col flex items-start justify-center">
          <div className="flex flex-col-reverse md:flex-row w-full items-center gap-x-8 gap-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideFromLeft}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
              className="flex flex-col gap-y-4"
            >
              <div className="flex gap-4 mx-auto items-center">
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/polywork.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Polywork"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/facebook.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Facebook"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/instagram.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Instagram"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/hashnode.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Hashnode"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codesandbox.svg"
                    width="100%"
                    className="flex dark:hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="CodeSandbox"
                  />
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codesandbox-dark.svg"
                    width="100%"
                    className="dark:flex hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="CodeSandbox"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitch.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Twitch"
                  />
                </div>
              </div>

              <div className="flex gap-4 mx-auto items-center">
                <div className="w-10 sm:w-12 md:w-12"></div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/stackoverflow.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Stack Overflow"
                  />
                </div>

                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/youtube.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="YouTube"
                  />
                </div>

                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/discord.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Discord"
                  />
                </div>

                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/dribbble.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Dribbble"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12"></div>
              </div>

              <div className="flex gap-4 mx-auto items-center">
                <div className="w-10 sm:w-12 md:w-12"></div>
                <div className="w-10 sm:w-12 md:w-12"></div>
                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitter.svg"
                    width="100%"
                    className="scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="X"
                  />
                </div>

                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium.svg"
                    width="100%"
                    className="flex dark:hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Medium"
                  />
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium-dark.svg"
                    width="100%"
                    className="dark:flex hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Medium"
                  />
                </div>

                <div className="w-10 sm:w-12 md:w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/threads.svg"
                    width="100%"
                    className="flex dark:hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Threads"
                  />
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/threads-dark.svg"
                    width="100%"
                    className="dark:flex hidden scale-100 transition-all duration-300 hover:scale-125 ease-in-out"
                    alt="Threads"
                  />
                </div>
                <div className="w-10 sm:w-12 md:w-12"></div>
                <div className="w-10 sm:w-12 md:w-12"></div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={slideFromRight}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
              className="flex grow flex-col md:items-end justify-end items-center gap-y-4 md:ml-auto"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-0">
                Share your <span className="text-brand">socials</span>
              </h2>
              <p className="text-lg mb-0">
                Add links to all of your social profiles and blogs in seconds.
              </p>
            </motion.div>
          </div>
        </article>
      </section>

      {/* Fourth Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideFromLeft}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
            className="flex w-full md:w-1/2 flex-col items-center md:items-start gap-y-4"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-0">
              Add some <span className="text-brand">stats</span>
            </h2>
            <p className="text-lg text-center md:text-left mb-0">
              Show visitors some key facts through charts, graphs and badges.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideFromRight}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
            className="w-full md:w-1/2 block relative"
          >
            <div className="dark:hidden block relative h-48 sm:h-80 overflow-hidden">
              <Image
                src="/stats-illustration.svg"
                layout="fill"
                className="object-fit"
                alt="Statistics illustration"
              />
            </div>
            <div className="hidden dark:block relative h-48 sm:h-80 overflow-hidden">
              <Image
                src="/stats-illustration-dark.svg"
                layout="fill"
                className="object-fit"
                alt="Statistics illustration"
              />
            </div>
          </motion.div>
        </article>
      </section>

      {/* Fourth Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex flex-col items-center justify-center md:px-48 gap-x-8 gap-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideFromBottom}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
            className="flex w-full flex-col items-center gap-y-4"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-0">
              Copy your <span className="text-brand">snippet</span>
            </h2>
            <p className="text-lg text-center mb-0">
              When you&apos;re done, copy your profile code and you&apos;re
              ready to go!
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={slideFromBottom}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
            className="w-full relative"
          >
            <SyntaxHighlighter language="markdown" style={nord} showLineNumbers>
              {codeString}
            </SyntaxHighlighter>
          </motion.div>
        </article>
      </section>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};
