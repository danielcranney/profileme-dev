import React, { useContext } from "react";
import { MicroButton } from "../components/buttons/MicroButton";
import { ACTIONS } from "./_app";
import { StateContext } from "./_app";

export default function Changelog() {
  const { state, dispatch } = useContext(StateContext);
  return (
    <>
      {/* COLUMN 2 - INPUTS */}
      <section
        className={`grow flex input-column-wrapper overflow-scroll p-6 ${
          state.sidebarOpen ? "ml-0 md:ml-64 " : ""
        }`}
      >
        <h1>Changelog</h1>

        <section className="flex flex-col gap-y-8 md:gap-y-0">
          {/* May 4th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>May 4th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Modal added to show users how to use ProfileMe after
                    clicking the &apos;Copy&apos; button.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-updated"} text={"Updated"} />
                  </div>
                  <p className="text-sm mb-0">
                    Introduction, skills, socials, badges and support sections
                    moved into individual components.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Dark icon added to socials skills section.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">Changelog added.</p>
                </li>
              </ul>
            </div>
          </article>

          {/* April 24th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>April 24th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Flutter icon added to socials skills section.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Dark icon added to socials skills section.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* April 7th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>April 7th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-updated"} text={"Updated"} />
                  </div>
                  <p className="text-sm mb-0">Brand color changed.</p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 18th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 24th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Dark mode, and mode switch added.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-updated"} text={"Updated"} />
                  </div>
                  <p className="text-sm mb-0">Brand color updated.</p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-updated"} text={"Updated"} />
                  </div>
                  <p className="text-sm mb-0">
                    Dark mode SVG icons added to socials and skills sections.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Svelte added to skills section.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 18th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 18th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">Google analytics installed.</p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 16th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 16th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    12 Web3 icons added to skills section.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 15th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 15th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Hashnode link updated to point towards users&apos; blog
                    rather than profile.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 10th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 10th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Delete repository added to badges section.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Codepen icon added to socials section.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 9th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 9th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Supabase icon added to skills section.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    FastAPI icon added to skills section.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    Polywork profile added to socials section
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-updated"} text={"Updated"} />
                  </div>
                  <p className="text-sm mb-0">
                    Twitter card updated for social media sharing.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    Input placeholders added on introduction section.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    Icon horizontal spacing fixed on preview section.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* March 8th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>March 8th 2022</h3>
              <p className="text-sm mb-0">
                Posted by{" "}
                <a href="mailto:danielcranney@gmail.com">Dan Cranney</a>
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-3/4 flex flex-col py-0 md:py-6 transition-all duration-150 ease-in-out">
              <ul className="gap-y-4 flex flex-col mb-0">
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">
                    🚀 ProfileMe soft-launched for users.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-updated"} text={"Updated"} />
                  </div>
                  <p className="text-sm mb-0">
                    Twitter card updated for social media sharing.
                  </p>
                </li>

                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    Input placeholders added on introduction section.
                  </p>
                </li>
              </ul>
            </div>
          </article>
        </section>
      </section>
    </>
  );
}
