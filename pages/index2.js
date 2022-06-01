import React from "react";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Home() {
  return (
    <main className="w-full h-full flex flex-col bg-white dark:bg-dark-800">
      {/* First Section */}
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-800 h-screen">
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
      <section className="w-full flex items-center bg-light-100 dark:bg-dark-900 h-screen">
        <article className="container mx-auto flex flex-col py-4 items-start">
          <h1 className="text-6xl text-center leading-tight">Features</h1>
          <p className="text-lg">Hero section text</p>
        </article>
      </section>
      {/* Third Section */}
      <section className="w-full flex items-center bg-white dark:bg-dark-800 h-screen">
        <article className="container mx-auto flex-col flex py-4 items-start px-24">
          <div className="flex w-full">
            <div className="flex flex-col w-full items-center">
              <h1 className="text-6xl leading-tight">Show off your skills</h1>
              <p className="text-lg">
                Select from over 60 core languages, frameworks, backend
                technologies and web 3 tech.
              </p>
              <div className="flex gap-x-4">
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/php-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/c-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg"
                    width="100%"
                  />
                </div>
                <div className="w-12">
                  <img
                    src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/typescript-colored.svg"
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

Home.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};
