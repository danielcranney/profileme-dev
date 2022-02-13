import React, { useEffect, useContext, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
// Import state and actions
import { ACTIONS } from "./_app";
import { StateContext } from "./_app";
// Import frontend icons
import { frontendIcons } from "./_app";
// Import components
import { FormLabel } from "../components/FormLabel";
import { MenuItem } from "../components/MenuItem";
import { FormInput } from "../components/FormInput";
import SectionHeader from "../components/SectionHeader";
import { ProfileFormInput } from "../components/ProfileFormInput";
let TurndownService = require("turndown").default;

export default function Home() {
  const { state, dispatch } = useContext(StateContext);
  const [renderedMarkdown, setRenderedMarkdown] = useState({
    introduction: "",
    skillsTitle: "",
    skills: {
      frontend: [],
      backend: [],
    },
    profilesTitle: "",
    profiles: {
      gitHub: "",
      portfolio: "",
      linkedIn: "",
      medium: "",
      hashnode: "",
      twitter: "",
      facebook: "",
    },
  });
  const [copySuccess, setCopySuccess] = useState("Copy");

  // Section Refs
  const introductionRef = useRef(null);
  const skillsTitleRef = useRef(null);
  const skillsRef = useRef(null);
  const profilesTitleRef = useRef(null);
  const profilesRef = useRef(null);

  // Introduction refs
  const firstNameRef = useRef();
  const surnameRef = useRef();
  const locationRef = useRef();
  const workingOnRef = useRef();
  const learningRef = useRef();
  const collaborateOnRef = useRef();
  const aboutMeRef = useRef();
  const additionalInfoRef = useRef();

  // Profiles refs
  const gitHubRef = useRef();
  const portfolioRef = useRef();
  const mediumRef = useRef();
  const hashnodeRef = useRef();
  const twitterRef = useRef();
  const facebookRef = useRef();
  const instagramRef = useRef();
  const tiktokRef = useRef();

  // Markdown Container
  const markdownRef = useRef();

  useEffect(() => {
    // If PreviewRef not showing, return
    if (!introductionRef.current) return;

    var turndownService = new TurndownService();
    turndownService.addRule("pRemoval", {
      filter: "p",
      replacement: function (content) {
        return "\n" + content + "\n\n";
      },
    });

    const sectionsRefs = [
      { ref: introductionRef, title: "introduction" },
      { ref: skillsTitleRef, title: "skillsTitle" },
      { ref: skillsRef, title: "skills" },
      { ref: profilesTitleRef, title: "profilesTitle" },
      { ref: profilesRef, title: "profiles" },
    ];

    sectionsRefs.map((section, i) => {
      if (section.title === "skills" || section.title === "profiles") {
        Object.entries(state[section.title]).forEach((entry) => {
          const [key, value] = entry;
          setRenderedMarkdown((renderedMarkdown) => ({
            ...renderedMarkdown,
            [section.title]: {
              ...renderedMarkdown[section.title],
              [key]: state[section.title][key],
            },
          }));
        });
      } else {
        let htmlOfElement = section.ref.current.innerHTML;
        setRenderedMarkdown((renderedMarkdown) => ({
          ...renderedMarkdown,
          [section.title]: turndownService.turndown(htmlOfElement),
        }));
      }
    });
  }, [state]);

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("Copied");
      setTimeout(() => {
        setCopySuccess("Copy");
      }, 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Head>
        <title>GitHub Profile Generator</title>
      </Head>
      <header className="flex items-center h-16 p-6 bg-white border-b border-slate-200">
        ReadMe Generator
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column */}
        <aside className="flex flex-col p-6 overflow-auto bg-white border-r w-72 border-slate-200">
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Sections
          </p>
          <ul className="flex flex-col gap-y-1">
            <MenuItem text={"Introduction"} section={"introduction"} />
            <MenuItem text={"Skills"} section={"skills"} />
            <MenuItem text={"Profiles"} section={"profiles"} />
          </ul>
        </aside>
        {/* Middle Column */}
        <div className="flex flex-col flex-1 border-r border-slate-200">
          <section className="flex flex-col p-6 border-b border-slate-200">
            {state.section === "introduction" ? (
              <SectionHeader
                header={"Introduction"}
                subhead={`Introduce yourself to visitors. Tell them a little bit about you and who you are as a developer.`}
              />
            ) : state.section === "skills" ? (
              <SectionHeader
                header={"Skills"}
                subhead={`Add some icons to your profile. Select the languages,
                frameworks, software and tech that you use.`}
              />
            ) : state.section === "profiles" ? (
              <SectionHeader
                header={"Profiles"}
                subhead={`Include links to profiles you have on different platforms, from
                social media to your portfolio.`}
              />
            ) : null}
          </section>
          {state.section === "introduction" ? (
            <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
              <article className="flex flex-wrap w-full gap-x-2 gap-y-4">
                <div className="flex flex-col flex-1 w-full">
                  <FormLabel
                    text={"First name:"}
                    icon={
                      <i className="mr-1 twa twa-bust-in-silhouette twa-lg"></i>
                    }
                  />
                  <FormInput
                    ref={firstNameRef}
                    section={"introduction"}
                    type={"firstName"}
                    placeholder={"Peter"}
                    action={ACTIONS.ADD_INTRODUCTION}
                  />
                </div>
                <div className="flex flex-col flex-1 w-full">
                  <FormLabel
                    text={"Surname:"}
                    icon={
                      <i className="mr-1 twa twa-bust-in-silhouette twa-lg"></i>
                    }
                  />
                  <FormInput
                    ref={surnameRef}
                    section={"introduction"}
                    type={"surname"}
                    placeholder={"Parker"}
                    action={ACTIONS.ADD_INTRODUCTION}
                  />
                </div>
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Location:"}
                  icon={
                    <i className="mr-1 twa twa-globe-showing-europe-africa twa-lg"></i>
                  }
                />
                <FormInput
                  ref={locationRef}
                  section={"introduction"}
                  type={"location"}
                  placeholder={"New York"}
                  action={ACTIONS.ADD_INTRODUCTION}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Currently working on:"}
                  icon={
                    <i className="mr-1 twa twa-hammer-and-wrench twa-lg"></i>
                  }
                />
                <FormInput
                  ref={workingOnRef}
                  section={"introduction"}
                  type={"workingOn"}
                  placeholder={"a new project"}
                  action={ACTIONS.ADD_INTRODUCTION}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Learning:"}
                  icon={<i className="mr-1 twa twa-graduation-cap twa-lg"></i>}
                />
                <FormInput
                  ref={learningRef}
                  section={"introduction"}
                  type={"learning"}
                  placeholder={"a new framework"}
                  action={ACTIONS.ADD_INTRODUCTION}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Looking to collaborate on:"}
                  icon={<i className="mr-1 twa twa-handshake twa-lg"></i>}
                />
                <FormInput
                  ref={collaborateOnRef}
                  section={"introduction"}
                  type={"collaborateOn"}
                  placeholder={"interesting projects"}
                  action={ACTIONS.ADD_INTRODUCTION}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Additional info:"}
                  icon={<i className="mr-1 twa twa-high-voltage twa-lg"></i>}
                />
                <FormInput
                  ref={additionalInfoRef}
                  section={"introduction"}
                  type={"additionalInfo"}
                  placeholder={"A fun fact..."}
                  action={ACTIONS.ADD_INTRODUCTION}
                />
              </article>
            </section>
          ) : state.section === "skills" ? (
            <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Frontend:"}
                  icon={
                    <i className="mr-1 twa twa-desktop-computer twa-lg"></i>
                  }
                />
                <div className="flex flex-wrap p-2 text-4xl border rounded-sm gap-x-2 gap-y-2 border-slate-200">
                  {frontendIcons.map((icon) => {
                    return (
                      <button
                        key={`${icon.type}`}
                        className="relative flex"
                        onClick={() => {
                          if (state.skills.frontend.includes(icon)) {
                            const iconToRemove =
                              state.skills.frontend.indexOf(icon);
                            if (iconToRemove > -1) {
                              dispatch({
                                type: ACTIONS.REMOVE_SKILL,
                                payload: { type: "frontend", icon },
                              });
                            }
                          } else {
                            dispatch({
                              type: ACTIONS.ADD_SKILL,
                              payload: { type: "frontend", icon },
                            });
                          }
                        }}
                      >
                        {state.skills.frontend.includes(icon) ? (
                          <div className="absolute top-0 left-0 w-4 h-4 p-0 overflow-hidden text-xs bg-white border-0 rounded-lg">
                            <svg
                              className="w-4 h-4 text-brand"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        ) : null}
                        <i
                          className={`devicon-${icon.iTag} ${
                            state.skills.frontend.includes(icon)
                              ? "colored"
                              : "text-slate-500 opacity-50"
                          }`}
                        ></i>
                      </button>
                    );
                  })}
                </div>
              </article>
            </section>
          ) : state.section === "profiles" ? (
            <section className="flex flex-col p-6 overflow-y-auto gap-y-5">
              <article className="flex flex-col flex-1 w-full">
                <div className="flex flex-col flex-1 w-full">
                  <FormLabel
                    text={"GitHub profile:"}
                    icon={<i className="mr-1 twa twa-laptop twa-lg"></i>}
                  />
                  <ProfileFormInput
                    ref={gitHubRef}
                    section={"profiles"}
                    type={"gitHub"}
                    linkSuffix={"linkSuffix"}
                    placeholder={"https://www.github.com/danielcranney"}
                    action={ACTIONS.ADD_PROFILE}
                  />
                </div>
              </article>
              {/* <article className="flex flex-col flex-1 w-full">
                <div className="flex flex-col flex-1 w-full">
                  <FormLabel
                    text={"Portfolio:"}
                    icon={
                      <i className="mr-1 twa twa-bust-in-silhouette twa-lg"></i>
                    }
                  />
                  <FormInput
                    ref={portfolioRef}
                    section={"profiles"}
                    type={"portfolio"}
                    placeholder={"http://www.yourname.com"}
                    action={ACTIONS.ADD_PROFILE}
                  />
                </div>
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Medium profile:"}
                  icon={<i className="mr-1 twa twa-writing-hand twa-lg"></i>}
                />
                <FormInput
                  ref={mediumRef}
                  section={"profiles"}
                  type={"medium"}
                  placeholder={"http://www.medium.com/profile/"}
                  action={ACTIONS.ADD_PROFILE}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Hashnode profile:"}
                  icon={<i className="mr-1 twa twa-writing-hand twa-lg"></i>}
                />
                <FormInput
                  ref={hashnodeRef}
                  section={"profiles"}
                  type={"hashnode"}
                  placeholder={"http://www.hashnode.com/@danielcranney"}
                  action={ACTIONS.ADD_PROFILE}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Twitter profile:"}
                  icon={<i className="mr-1 twa twa-writing-hand twa-lg"></i>}
                />
                <FormInput
                  ref={twitterRef}
                  section={"profiles"}
                  type={"twitter"}
                  placeholder={"http://www.twitter.com/"}
                  action={ACTIONS.ADD_PROFILE}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Facebook profile:"}
                  icon={<i className="mr-1 twa twa-writing-hand twa-lg"></i>}
                />
                <FormInput
                  ref={facebookRef}
                  section={"profiles"}
                  type={"facebook"}
                  placeholder={"http://www.facebook.com/"}
                  action={ACTIONS.ADD_PROFILE}
                />
              </article>
              <article className="flex flex-col flex-1 w-full">
                <FormLabel
                  text={"Instagram profile:"}
                  icon={<i className="mr-1 twa twa-writing-hand twa-lg"></i>}
                />
                <FormInput
                  ref={instagramRef}
                  section={"profiles"}
                  type={"instagram"}
                  placeholder={"http://www.instagram.com/"}
                  action={ACTIONS.ADD_PROFILE}
                />
              </article> */}
            </section>
          ) : null}
        </div>
        {/* Right Column */}
        <div className="relative flex flex-col flex-1 bg-slate-100">
          <div className="absolute top-0 right-0 flex w-full bg-white border-b border-slate-200">
            <button
              id="PreviewButton"
              onClick={() => {
                dispatch({
                  type: ACTIONS.SELECT_RENDER_MODE,
                  payload: "preview",
                });
              }}
              className={`flex items-center p-3 text-xs font-semibold uppercase border-slate-200 border-r text-slate-500 ${
                state.renderMode === "preview" ? "bg-slate-100" : "bg-white"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              Preview
            </button>
            <button
              id="MarkdownButton"
              onClick={() => {
                dispatch({
                  type: ACTIONS.SELECT_RENDER_MODE,
                  payload: "markdown",
                });
              }}
              className={`flex items-center p-3 text-xs font-semibold uppercase border-r border-slate-200 text-slate-500 mr-auto ${
                state.renderMode === "markdown" ? "bg-slate-100" : "bg-white"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
              Markdown
            </button>

            <button
              className={`flex items-center p-3 text-xs font-semibold uppercase border-l border-slate-200 text-slate-500`}
              onClick={() => {
                copyToClipBoard(markdownRef.current.innerText);
              }}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
              </svg>
              {copySuccess}
            </button>
          </div>

          <article
            className={`previewContainer px-6 mt-16 overflow-y-auto ${
              state.renderMode === "preview" ? "relative" : "hidden"
            }`}
          >
            <div ref={introductionRef}>
              {!state.introduction.firstName &&
              !state.introduction.surname ? null : (
                <h1>
                  Hi there! &#128075; My name is {state.introduction.firstName}
                  &nbsp;
                  {state.introduction.surname}
                </h1>
              )}
              {state.introduction.location ? (
                <p>🌍&nbsp; I'm based in {state.introduction.location}</p>
              ) : null}
              {state.introduction.workingOn ? (
                <p>
                  🛠&nbsp; I'm currently working on{" "}
                  {state.introduction.workingOn}
                </p>
              ) : null}
              {state.introduction.learning ? (
                <p>🎓&nbsp; I'm learning {state.introduction.learning}</p>
              ) : null}
              {state.introduction.collaborateOn ? (
                <p>
                  🤝&nbsp; I'm open to collaborating on{" "}
                  {state.introduction.collaborateOn}
                </p>
              ) : null}
              {state.introduction.additionalInfo ? (
                <p>⚡&nbsp;{state.introduction.additionalInfo}</p>
              ) : null}
            </div>

            <div ref={skillsTitleRef} className="flex">
              {state.skills.frontend.length === 0 ? null : (
                <h3 className="mt-8">My Skills</h3>
              )}
            </div>

            <div ref={skillsRef} className="flex flex-col">
              {state.skills.frontend.length > 0 ? (
                <div className="flex flex-wrap mb-8 gap-x-2 gap-y-2">
                  {state.skills.frontend.map((icon) => {
                    return (
                      <p key={`${icon.folder}-${icon.type}`}>
                        <img
                          src={`https://raw.githubusercontent.com/devicons/devicon/master/icons/${icon.folder}/${icon.type}.svg`}
                          alt={`${icon.name}`}
                          width="40"
                          height="40"
                        />
                      </p>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div ref={profilesTitleRef} className="flex">
              {state.profilesTitle ? <h3>My Profiles</h3> : null}
            </div>

            <div ref={profilesRef}>
              {state.profiles.gitHub.linkSuffix ? (
                <a
                  target="_blank"
                  href={`${state.profiles.gitHub.linkPrefix}${state.profiles.gitHub.linkSuffix}`}
                >
                  <i className="text-3xl text-blue-500 devicon-github-original"></i>
                </a>
              ) : null}
            </div>
          </article>

          <article
            id="markdownElement"
            className={`px-6 mt-16 overflow-y-auto h-full text-xs ${
              state.renderMode === "markdown" ? "relative" : "hidden"
            }`}
          >
            {!renderedMarkdown ? (
              <div>You have not rendered any code yet</div>
            ) : (
              <div ref={markdownRef}>
                <p className="whitespace-pre-line">
                  {renderedMarkdown.introduction}
                </p>
                <p className="whitespace-pre-line">
                  {renderedMarkdown.skillsTitle}
                </p>
                <p className="break-all">
                  {renderedMarkdown.skills.frontend.length > 0 ? (
                    <>
                      {`<p align="left">`}
                      {renderedMarkdown.skills.frontend.map((icon) => {
                        return (
                          <span key={`${icon.folder}-${icon.type}`}>
                            {`<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon.folder}/${icon.type}.svg" width="32" height="32" />`}
                          </span>
                        );
                      })}
                      {`</p>`}
                    </>
                  ) : null}
                </p>
                <p className="whitespace-pre-line">
                  {state.profilesTitle ? (
                    <>{renderedMarkdown.profilesTitle}</>
                  ) : (
                    <></>
                  )}
                </p>
                <p className="break-all whitespace-pre-line">
                  {renderedMarkdown.profiles.gitHub.linkSuffix ? (
                    <>
                      {`<a
                    target="_blank"
                    href="${renderedMarkdown.profiles.gitHub.linkPrefix}${renderedMarkdown.profiles.gitHub.linkSuffix}"
                  ><img
                      src="${renderedMarkdown.profiles.gitHub.path}"
                      width="32"
                      height="32"
                    /></a>`}
                    </>
                  ) : null}
                </p>
              </div>
            )}
          </article>
        </div>
      </div>
      {/* <footer className="flex items-center h-16 p-6 bg-white border-t border-slate-200">
        Footer
      </footer> */}
    </main>
  );
}
