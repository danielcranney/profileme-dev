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
        <div className="container mx-auto flex items-center gap-x-3">
          <Logo />

          {/* Changelog Link */}
          <Link href="/changelog">
            <a
              rel="noreferrer"
              className={`z-40 ml-auto hidden sm:flex ${
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
            </a>
          </Link>

          {/* ThemeSwitch */}
          <ThemeSwitch />

          {/* Leave Feedbck */}
          <LeaveFeedback />
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}
