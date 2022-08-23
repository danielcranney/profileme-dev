import React, { useContext } from "react";
import { MicroButton } from "../components/buttons/MicroButton";
import LandingLayout from "../components/layouts/LandingLayout";
import GitHubIcon from "../components/misc/GitHubIcon";
import { ACTIONS } from "./_app";
import { StateContext } from "./_app";

export default function Changelog() {
  const { state, dispatch } = useContext(StateContext);
  return (
    <section
      className={`w-full flex overflow-scroll bg-light-100 dark:bg-dark-800`}
    >
      <div className="container mx-auto py-6 md:py-24">
        <h1 className="text-5xl">Changelog</h1>
        <p>All of the changes made to ProfileMe.dev since launch.</p>

        <div className="flex w-full bg-white dark:bg-dark-900/40 py-2.5 px-3 rounded-md items-center transition-all duration-150 ease-in-out">
          <p className="mb-0">
            If you are a developer and would like to contribute to
            ProfileMe.dev, please visit the GitHub repo and make a pull request.
          </p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/danielcranney/profileme-dev/commits/main"
            className="btn-md btn-brand ml-auto self-end group gap-x-1.5"
          >
            <GitHubIcon />
            Visit GitHub
          </a>
        </div>

        <section className="flex flex-col gap-y-8 md:gap-y-0 mt-8">
          {/* July 14th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>July 14th 2022</h3>
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
                    On-load animations added to homepage.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* June 28th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>June 28th 2022</h3>
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
                    Waving hand option added to introduction section. Pull
                    request submitted by{" "}
                    <a
                      href="https://github.com/danielcranney/profileme-dev/commits?author=paytonjewell"
                      target="_blank"
                      rel="noreferrer"
                    >
                      paytonjewel
                    </a>
                    .
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* June 25th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>June 25th 2022</h3>
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
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    GitHub and Twitter icon links fixed{" "}
                    <a
                      href="https://github.com/danielcranney/profileme-dev/commits?author=Dharmik48"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Dharmik48
                    </a>
                    .
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* June 4th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>June 4th 2022</h3>
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
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    CodeSandbox link now works correctly. Pull request submitted
                    by{" "}
                    <a
                      href="https://github.com/danielcranney/profileme-dev/commits?author=bachitterch"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Bachitterch
                    </a>
                    .
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* June 1st 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>June 2nd 2022</h3>
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
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    Popout menu now closes when user clicks off of it.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-fixed"} text={"Fixed"} />
                  </div>
                  <p className="text-sm mb-0">
                    Landing page responsiveness fixed.
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* June 1st 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>June 1st 2022</h3>
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
                  <p className="text-sm mb-0">
                    Sidebar colour changed from brand colour to dark.
                  </p>
                </li>
                <li className="flex flex-col items-start gap-y-1">
                  <div className="w-20">
                    <MicroButton buttonStyle={"btn-new"} text={"New"} />
                  </div>
                  <p className="text-sm mb-0">Landing page added.</p>
                </li>
              </ul>
            </div>
          </article>

          {/* May 31st 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>May 31st 2022</h3>
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
                    State now stored if user refreshes page. Thank you to Adam
                    JA King{" "}
                    <a
                      href="https://github.com/danielcranney/profileme-dev/commit/3139ab20246105d87453b58334beaaa845c8e833"
                      target="_blank"
                      rel="noreferrer"
                    >
                      for the pull request and contribution
                    </a>
                    .
                  </p>
                </li>
              </ul>
            </div>
          </article>

          {/* May 14th 2022 */}
          <article className="flex gap-x-6 flex-col md:flex-row gap-y-3 border-b border-light-200 dark:border-dark-600 transition-all duration-150 ease-in-out pb-8 md:pb-0">
            {/* Left Column */}
            <div className="w-full md:w-1/4 flex flex-col border-r-0 md:border-r border-light-200 dark:border-dark-600 py-0 md:py-6 transition-all duration-150 ease-in-out">
              <h3>May 14th 2022</h3>
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
                    Kotlin added to skills section. Thank you to Dhina17{" "}
                    <a
                      href="https://github.com/danielcranney/profileme-dev/commit/c89cd064571ec10f3e2dcf3455f6599c60c4f8f8"
                      target="_blank"
                      rel="noreferrer"
                    >
                      for the pull request and contribution
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </article>

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
      </div>
    </section>
  );
}

Changelog.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};
