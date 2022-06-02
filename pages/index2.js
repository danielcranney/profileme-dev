import React from "react";
import LandingLayout from "../components/layouts/LandingLayout";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function Home() {
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

  return (
    <main className="w-full min-h-screen overflow-auto flex flex-col bg-white dark:bg-dark-800">
      {/* First Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 min-h-screen relative">
        <article className="container mx-auto flex flex-col py-4 items-center gap-y-4">
          <h1 className="text-6xl text-center leading-tight mb-0">
            Create an amazing
            <br />
            <span className="text-brand">GitHub profile</span> in minutes
          </h1>
          <p className="text-lg">
            Show off your skills, experience and projects. Generate markdown for
            your profile with just a few clicks!
          </p>
          <div className="flex items-center gap-x-4">
            <button className="btn-gray btn-lg">Visit Repo</button>
            <button className="btn-brand btn-lg">Get Started</button>
          </div>
        </article>
      </section>
      {/* Second Section */}
      <section className="z-10 w-full flex items-center bg-light-100 dark:bg-dark-800 h-auto -mt-20">
        <article className="container mx-auto flex flex-col items-center">
          <div className="w-4/5 flex relative">
            <div className="absolute w-full h-full bg-gradient-to-t dark:from-dark-800 from-light-100"></div>

            <img
              src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/screenshot.png"
              className="overflow-hidden rounded-md shadow-dark-900/5"
              width="100%"
            />
          </div>
        </article>
      </section>
      {/* Third Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex-col flex items-start px-24">
          <div className="flex w-full items-center gap-x-8">
            <div className="flex flex-col w-1/2 items-start gap-y-4">
              <h1 className="text-6xl leading-tight mb-0">
                Show off your <span className="text-brand">skills</span>
              </h1>
              <p className="text-lg">
                Select from over 60 core languages, frameworks, backend
                technologies and web 3 tech.
              </p>
            </div>
            <div className="flex flex-col gap-y-6 w-1/2 items-end">
              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/c-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/php-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vuejs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/figma-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nuxtjs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nestjs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/angularjs-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/babel-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/python-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/firebase-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/flutter-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/gatsby-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/graphql-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/bootstrap-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/swift-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/dart-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/svelte-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/sass-colored.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
      {/* Fourth Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex-col flex items-start justify-center px-24">
          <div className="flex w-full items-center gap-x-8">
            <div className="flex w-1/2 flex-col gap-y-6 items-center flex-wrap">
              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/polywork.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/facebook.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/instagram.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/hashnode.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/codesandbox.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitch.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/stackoverflow.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/youtube.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/discord.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/dribbble.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/twitter.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>

                <div className="w-14">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/socials/medium.svg"
                    width="100%"
                    className="scale-100 transition-all duration-150 ease-in-out"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-start gap-y-4">
              <h1 className="text-6xl leading-tight mb-0">
                Share your <span className="text-brand">socials</span>
              </h1>
              <p className="text-lg">
                Add links to all of your social profiles and blogs in seconds.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* Fourth Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex items-center justify-center px-24">
          <div className="flex w-1/2 flex-col items-start gap-y-4">
            <h1 className="text-6xl leading-tight mb-0">
              Add some <span className="text-brand">stats</span>
            </h1>
            <p className="text-lg">
              Show visitors some key facts through charts, graphs and badges.
            </p>
          </div>

          <div className="w-1/2 block relative">
            <div className="block relative h-80 overflow-hidden">
              <Image
                src="/stats-illustration.svg"
                height={925}
                width={550}
                layout="fill"
                className="object-fit"
              />
            </div>
          </div>
        </article>
      </section>

      {/* Fourth Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 py-24">
        <article className="container mx-auto flex flex-col items-center justify-center px-48 gap-x-8">
          <div className="flex w-full flex-col items-start gap-y-4">
            <h1 className="text-6xl leading-tight mb-0">
              Copy <span className="text-brand">snippet</span>
            </h1>
            <p className="text-lg">
              When you're done, copy your profile code and you're ready to go!
            </p>
          </div>

          <div className="w-full relative">
            <SyntaxHighlighter language="markdown" style={nord} showLineNumbers>
              {codeString}
            </SyntaxHighlighter>
          </div>
        </article>
      </section>
    </main>
  );
}

Home.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};