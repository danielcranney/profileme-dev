import React, { useEffect, useContext, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
// Import state and actions
import { ACTIONS } from "../../pages/_app";
import { StateContext } from "../../pages/_app";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { colorStore } from "../../pages/_app";
// Import components
import MenuItem from "../buttons/MenuItem";
import SidebarFooter from "../misc/SidebarFooter";
let TurndownService = require("turndown").default;
import LeaveFeedback from "../buttons/LeaveFeedback";
import CopyModal from "../modals/CopyModal";
import HamburgerMenuIcon from "../buttons/HamburgerMenuIcon";
import ThemeSwitch from "../buttons/ThemeSwitch";
import Logo from "../Logo";
import { useRouter } from "next/router";

export default function LandingLayout({ children }) {
  const { state, dispatch } = useContext(StateContext);
  const router = useRouter();

  const menuNode = useRef();

  const handleClickOutside = (e) => {
    if (menuNode.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    dispatch({
      type: ACTIONS.TOGGLE_POPOUT_MENU,
    });
  };

  useEffect(() => {
    if (state.popoutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.popoutMenuOpen]);

  return (
    <div className="flex flex-col min-h-screen h-auto relative">
      <Head>
        <title>
          ProfileMe.dev | Create an awesome GitHub profile in minutes
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="ProfileMe.dev | Create an awesome GitHub profile in minutes"
        />
        <meta name="author" content="Dan Cranney" />
        <meta property="og:site_name" content="ProfileMe.dev" />
        <meta property="og:site" content="http://www.profileme.dev" />
        <meta property="og:title" content="ProfileMe.dev" />
        <meta
          property="og:description"
          content="Create an awesome GitHub profile in minutes"
        />
        <meta
          property="og:image"
          content="http://raw.githubusercontent.com/danielcranney/profileme-dev/main/public/social-image.jpg"
        />
        <meta property="og:url" content="http://www.profileme.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="ProfileMe.dev" />
        <meta
          property="twitter:image"
          content="http://raw.githubusercontent.com/danielcranney/profileme-dev/main/public/social-image.jpg"
        />
        <meta
          property="twitter:description"
          content="Create an awesome GitHub profile in minutes"
        />
        <meta property="twitter:creator" content="@danielcranney" />
      </Head>

      <div className="flex items-center fixed top-0 w-full h-16 z-40 bg-white dark:bg-dark-800 border-b-0 border-slate-200 dark:border-dark-700">
        <div className="container mx-auto flex items-center gap-x-1.5">
          {/* Logo */}
          <Link href={"/"}>
            <a
              className={`font-bold tracking-tight mb-0 text-lg sm:text-xl transition-all duration-150 ease-in-out no-underline ${
                state.sidebarOpen
                  ? "text-dark-900 hover:text-dark-900 dark:text-white"
                  : "text-dark-900 dark:text-dark-900"
              }`}
            >
              ProfileMe
              <span
                className={`transition-all duration-150 ease-in-out ${
                  state.sidebarOpen
                    ? "text-brand hover:text-dark-700"
                    : "text-brand-alt"
                }`}
              >
                .dev
              </span>
            </a>
          </Link>

          {/* ThemeSwitch */}
          <div class="ml-1 mr-auto">
            <ThemeSwitch />
          </div>

          <button
            onClick={() => {
              router.push("/create-profile");
            }}
            className="btn-brand btn-sm"
          >
            Create Profile
          </button>

          <button
            onClick={() => {
              dispatch({
                type: ACTIONS.TOGGLE_POPOUT_MENU,
              });
            }}
            className={`relative cursor-pointer transition-all duration-150 ease-in-out flex items-center justify-center rounded-md h-9 w-9 ${
              state.popoutMenuOpen
                ? "bg-dark-900/20 dark:bg-dark-600 text-white hover:text-white"
                : "btn-gray"
            } group`}
          >
            <svg
              className="w-5 h-5 text-dark-500 group-hover:text-dark-700 dark:text-white dark:group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>

            {state.popoutMenuOpen ? (
              <div
                ref={menuNode}
                className="absolute top-14 h-20 overflow-hidden w-48 right-0 bg-white dark:bg-dark-700 rounded-md shadow-sm shadow-dark-700/10"
              >
                <ul className="flex flex-col">
                  <li className="border-b h-10 px-3 border-light-100 dark:border-dark-600 flex items-center group">
                    <a
                      href="mailto:danielcranney@gmail.com"
                      className="flex items-center font-normal no-underline w-full h-full text-dark-400/80 dark:text-light-300 dark:hover:text-white transition-all duration-150 ease-in-out hover:text-dark-700 gap-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        ></path>
                      </svg>
                      <span className="text-sm">Leave Feedback</span>
                    </a>
                  </li>
                  <li className="border-b-0 h-10 px-3 flex group">
                    <Link href="/changelog">
                      <a className="flex items-center font-normal no-underline w-full h-full text-dark-400/80 dark:text-light-300 dark:hover:text-white transition-all duration-150 ease-in-out hover:text-dark-700 gap-x-2">
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          ></path>
                        </svg>
                        <span className="text-sm">Changelog</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </button>
        </div>
      </div>

      {children}

      {/* Footer */}
      <footer className="w-full flex items-center bg-white dark:bg-dark-900 py-12">
        <div className="container mx-auto flex items-end gap-x-3">
          <div className="mr-auto">
            {/* Logo */}
            <Link href={"/"}>
              <a
                className={`font-bold tracking-tight mb-0 text-lg sm:text-xl transition-all duration-150 ease-in-out no-underline ${
                  state.sidebarOpen
                    ? "text-dark-900 hover:text-dark-900 dark:text-white"
                    : "text-dark-900 dark:text-dark-900"
                }`}
              >
                ProfileMe
                <span
                  className={`transition-all duration-150 ease-in-out ${
                    state.sidebarOpen
                      ? "text-brand hover:text-dark-700"
                      : "text-brand-alt"
                  }`}
                >
                  .dev
                </span>
              </a>
            </Link>

            {/* Changelog Link */}
            <p className="mb-0 text-sm">
              &copy; Copyright 2022 ProfileMe.dev. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-x-1.5">
              <i className="devicon-github-original text-2xl text-dark-500 hover:text-dark-700 cursor-pointer"></i>

              <i className="devicon-twitter-original text-xl text-dark-500 hover:text-dark-700 cursor-pointer"></i>
            </div>
            <div className="flex gap-x-1.5 items-center">
              <Link href="/">
                <a className="text-xs">Home</a>
              </Link>
              <span className="text-white">·</span>
              <Link href="/create-profile">
                <a className="text-xs">Create Profile</a>
              </Link>
              <span className="text-white">·</span>
              <Link href="/changelog">
                <a className="text-xs">Changelog</a>
              </Link>
              <span className="text-white">·</span>
              <a href="mailto:danielcranney@gmail.com" className="text-xs">
                Leave Feedback
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
