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
        <article className="container mx-auto flex flex-col py-4 items-center">
          <h1 className="text-6xl text-center leading-tight">About</h1>
          <p className="text-lg">Hero section text</p>
        </article>
      </section>
      {/* Third Section */}
      <section className="w-full flex items-center bg-white dark:bg-dark-800 h-screen">
        <article className="container mx-auto flex flex-col py-4 items-center">
          <h1 className="text-6xl text-center leading-tight">About</h1>
          <p className="text-lg">Hero section text</p>
        </article>
      </section>
    </main>
  );
}

Home.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};
