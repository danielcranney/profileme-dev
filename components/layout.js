import Head from "next/head";
import Link from "next/link";
import React, { useContext } from "react";
// Import state and actions
import { ACTIONS } from "../lib/constants/actions";
import { StateContext } from "../pages/_app";
// Import components
import HamburgerMenuIcon from "../components/buttons/HamburgerMenuIcon";
import LeaveFeedback from "../components/buttons/LeaveFeedback";
import MenuItem from "../components/buttons/MenuItem";
import ThemeSwitch from "../components/buttons/ThemeSwitch";
import Logo from "../components/Logo";
import CopyModal from "../components/modals/CopyModal";
import CopyrightLabel from "./misc/SidebarFooter";

export default function Layout({ children }) {
  const { state, dispatch } = useContext(StateContext);

  return (
    <div className="flex flex-col min-h-screen h-auto md:h-screen relative">
      <Head>
        <title>
          ProfileMe.dev | Create an amazing GitHub profile in minutes
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="ProfileMe.dev | Create an amazing GitHub profile in minutes"
        />
        <meta name="author" content="Dan Cranney" />
        <meta property="og:site_name" content="ProfileMe.dev" />
        <meta property="og:site" content="http://www.profileme.dev" />
        <meta property="og:title" content="ProfileMe.dev" />
        <meta
          property="og:description"
          content="Create an amazing GitHub profile in minutes"
        />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/danielcranney/repo-storage/main/profile-me-social-image.png"
        />
        <meta property="og:url" content="http://www.profileme.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="ProfileMe.dev" />
        <meta
          property="twitter:image"
          content="https://raw.githubusercontent.com/danielcranney/repo-storage/main/profile-me-social-image.png"
        />
        <meta
          property="twitter:description"
          content="Create an amazing GitHub profile in minutes"
        />
        <meta property="twitter:creator" content="@danielcranney" />
      </Head>

      {/* Copy Overlay */}
      <div
        className={`fixed dark:bg-black bg-slate-900 w-full h-full z-50 delay-150 transition-all duration-150 ease-in-out ${
          state.modal ? "dark:opacity-50 opacity-50 flex" : "opacity-0 hidden"
        }`}
      ></div>

      {/* Copy Modal */}
      {state.modal && <CopyModal />}

      {/* Hamburger Menu Icon */}
      <div className="fixed top-3.5 left-6 flex z-40 items-center gap-x-2">
        <HamburgerMenuIcon />

        <Logo />
      </div>

      {/* Dark Theme Icon */}
      <div className="fixed top-3.5 right-6 z-40 flex gap-x-3 items-center h-9">
        {/* <Link
          href="/changelog"
          rel="noreferrer"
          className={`z-40 hidden sm:flex ${
            state.sidebarOpen
              ? "text-dark-800 hover:text-white md:text-brand md:hover:text-dark-800"
              : "text-brand hover:text-dark-800 md:text-brand md:hover:text-dark-800"
          } text-xs px-0`}
          onClick={() => {
            dispatch({
              type: ACTIONS.SHOW_SECTION,
              payload: null,
            });
          }}
        >
          Changelog
        </Link> */}

        <ThemeSwitch />

        <LeaveFeedback />
      </div>

      <main>
        {/* COLUMN 1 - SIDEBAR */}
        <aside
          className={`${
            state.sidebarOpen
              ? "translate-x-0 md:border-r"
              : "-translate-x-full md:-translate-x-64"
          }`}
        >
          <ul className="mb-auto menu">
            <MenuItem
              text={"Introduction"}
              section={"introduction"}
              icon={
                <>
                  <svg
                    className="w-6 h-6 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    ></path>
                  </svg>
                </>
              }
            />
            <MenuItem
              text={"Skills"}
              section={"skills"}
              icon={
                <>
                  <svg
                    className="w-6 h-6 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    ></path>
                  </svg>
                </>
              }
            />
            <MenuItem
              text={"Socials"}
              section={"socials"}
              icon={
                <svg
                  className="w-6 h-6 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
              }
            />
            <MenuItem
              text={"Badges"}
              section={"badges"}
              icon={
                <svg
                  className="w-6 h-6 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              }
            />
            <MenuItem
              text={"Support"}
              section={"support"}
              icon={
                <svg
                  className="w-6 h-6 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              }
            />
          </ul>
          <CopyrightLabel />
        </aside>
        {children}
      </main>
    </div>
  );
}
