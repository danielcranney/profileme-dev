import React, { useEffect, useContext, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
// Import state and actions
import { ACTIONS } from "../../lib/constants/actions";
import { StateContext } from "../../pages/_app";
import ThemeSwitch from "../buttons/ThemeSwitch";

import { useRouter } from "next/router";
import { SocialIcons } from "../misc/SocialIcons";
import { topBarContainer } from "../../lib/framerMotion";
import Logo from "../Logo";

export default function LandingLayout({ children }) {
  const { state, dispatch } = useContext(StateContext);
  const router = useRouter();

  const menuNode = useRef();
  const menuIconNode = useRef();

  const handleClickOutside = (e) => {
    if (
      menuNode.current.contains(e.target) ||
      menuIconNode.current.contains(e.target)
    ) {
      // inside click
      return;
    }
    // outside click
    dispatch({
      type: ACTIONS.CLOSE_ELEMENT,
      payload: {
        elementToClose: "popOutMenuOpen",
      },
    });
  };

  useEffect(() => {
    if (state.popOutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.popOutMenuOpen]);

  return (
    <div className="flex flex-col min-h-screen h-auto relative">
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

      <header className="flex items-center fixed top-0 w-full h-16 z-40 bg-light-100 dark:bg-dark-800 border-b-0 border-slate-200 dark:border-dark-700">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={topBarContainer}
          className="container mx-auto flex items-center gap-x-2"
        >
          {/* Logo */}
          <motion.button
            onClick={() => {
              router.push("/");
            }}
            className={`font-bold tracking-tight mb-0 text-lg sm:text-xl transition-all duration-500 ease-in-out no-underline text-dark-900 dark:text-white`}
          >
            ProfileMe
            <span
              className={`transition-all duration-150 ease-in-out ${
                state.sidebarOpen ? "text-brand-alt" : "text-brand-alt"
              }`}
            >
              .dev
            </span>
          </motion.button>

          {/* ThemeSwitch */}
          <ThemeSwitch />

          <motion.button
            onClick={() => {
              router.push("/create-profile");
            }}
            className="btn-brand btn-xs sm:btn-sm"
          >
            Create Profile
          </motion.button>

          {/* Popout Menu */}
          <div className="flex items-center relative">
            {state.popOutMenuOpen ? (
              <div
                ref={menuNode}
                className="absolute top-12 overflow-hidden w-48 right-0 bg-white dark:bg-dark-700 rounded-md shadow-sm shadow-dark-700/10"
              >
                <ul className="flex flex-col">
                  <li className="border-b h-10 border-light-100 dark:border-dark-600 flex items-center group">
                    <a
                      href="mailto:danielcranney@gmail.com"
                      className="px-3 flex items-center font-normal no-underline w-full h-full text-dark-400/80 dark:text-light-300 dark:hover:text-white transition-all duration-150 ease-in-out hover:text-dark-700 gap-x-2"
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
                      <span className="text-xs font-semibold uppercase">
                        Leave Feedback
                      </span>
                    </a>
                  </li>
                  {/* <li className="border-b border-light-100 dark:border-dark-600 h-10 flex group">
                    <Link
                      href="/changelog"
                      className="px-3 flex items-center font-normal no-underline w-full h-full text-dark-400/80 dark:text-light-300 dark:hover:text-white transition-all duration-150 ease-in-out hover:text-dark-700 gap-x-2"
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
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        ></path>
                      </svg>
                      <span className="text-xs font-semibold uppercase">
                        Changelog
                      </span>
                    </Link>
                  </li> */}
                  <li className="border-b border-light-100 dark:border-dark-600 h-10 flex group">
                    <Link
                      className="px-3 flex items-center font-normal no-underline w-full h-full text-dark-400/80 dark:text-light-300 hover:text-dark-700 dark:hover:text-white transition-all duration-150 ease-in-out gap-x-2 group"
                      href="https://github.com/danielcranney/profileme-dev/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        viewBox="0 0 128 128"
                        className="w-5 h-5 group fill-current"
                      >
                        <g>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                          ></path>
                          <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"></path>
                        </g>
                      </svg>

                      <span className="text-xs font-semibold uppercase">
                        GitHub Repo
                      </span>
                    </Link>
                  </li>
                  <li className="border-b-0 h-10 flex group">
                    <a
                      className="flex items-center px-3 font-normal no-underline w-full h-full text-dark-400/80 dark:text-light-300 dark:hover:text-white transition-all duration-150 ease-in-out hover:text-dark-700 gap-x-2 group  group-hover:text-dark-700 dark:group-hover:text-white"
                      href="http://www.x.com/profilemedev"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        viewBox="0 0 128 128"
                        className="w-5 h-4 group fill-current"
                      >
                        <path d="M40.254 127.637c48.305 0 74.719-48.957 74.719-91.403 0-1.39 0-2.777-.075-4.156 5.141-4.547 9.579-10.18 13.102-16.633-4.79 2.602-9.871 4.305-15.078 5.063 5.48-4.02 9.582-10.336 11.539-17.774-5.156 3.743-10.797 6.38-16.68 7.801-8.136-10.586-21.07-13.18-31.547-6.32-10.472 6.86-15.882 21.46-13.199 35.617C41.922 38.539 22.246 26.336 8.915 6.27 1.933 20.94 5.487 39.723 17.022 49.16c-4.148-.172-8.207-1.555-11.832-4.031v.41c0 15.273 8.786 28.438 21.02 31.492a21.596 21.596 0 01-11.863.543c3.437 13.094 13.297 22.07 24.535 22.328-9.305 8.918-20.793 13.75-32.617 13.72-2.094 0-4.188-.15-6.266-.446 12.008 9.433 25.98 14.441 40.254 14.422"></path>
                      </svg>

                      <span className="text-xs font-semibold uppercase">
                        Twitter
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
            <button
              aria-label="Menu"
              aria-expanded={state.popOutMenuOpen}
              ref={menuIconNode}
              onClick={() => {
                dispatch({
                  type: ACTIONS.TOGGLE_ELEMENT,
                  payload: {
                    elementToToggle: "popOutMenuOpen",
                  },
                });
              }}
              className={`relative cursor-pointer transition-all duration-150 ease-in-out flex items-center justify-center rounded-md h-8 sm:h-9 w-8 sm:w-9 ${
                state.popOutMenuOpen
                  ? "bg-light-200 dark:bg-dark-600 text-white hover:text-white"
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
            </button>
          </div>
        </motion.div>
      </header>

      <main className="w-full min-h-screen overflow-hidden flex flex-col bg-white dark:bg-dark-800">
        {children}
        {/* Footer */}
      </main>
      <footer className="w-full flex items-center bg-white dark:bg-dark-900 py-12 relative">
        <div className="container mx-auto flex flex-col md:flex-row items-end gap-x-3 gap-y-3">
          <div className="mr-auto flex flex-col grow w-full">
            {/* Logo */}
            <Link
              href={"/"}
              className={`font-bold tracking-tight mb-0 text-lg sm:text-xl transition-all duration-500 ease-in-out no-underline text-dark-900 dark:text-white`}
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
            </Link>

            {/* Changelog Link */}
            <div className="mb-0 text-sm w-full">
              <p>
                &copy; Copyright {new Date().getFullYear()}{" "}
                <Link href={"/"}>ProfileMe.dev</Link>. All rights reserved.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:items-end w-full items-start">
            <SocialIcons />

            <div className="flex gap-x-1.5 items-center">
              <Link href="/" className="text-xs">
                Home
              </Link>
              <span className="text-dark-400 dark:text-white">·</span>
              <Link href="/create-profile" className="text-xs">
                Create Profile
              </Link>
              <span className="text-dark-400 dark:text-white">·</span>
              {/* <Link href="/changelog" className="text-xs">
                Changelog
              </Link> */}
              <span className="text-dark-400 dark:text-white">·</span>
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
