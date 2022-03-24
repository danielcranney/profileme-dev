import React, { useEffect, useContext, useRef, useState } from "react";
import Head from "next/head";
import { StateContext } from "./_app";
import { useTheme } from "next-themes";

export default function Home() {
  const { state, dispatch } = useContext(StateContext);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col h-screen relative px-12 text-center bg-white items-center justify-center">
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
          content="http://raw.githubusercontent.com/danielcranney/readme-generator/main/public/social-image.jpg"
        />
        <meta property="og:url" content="http://www.profileme.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="ProfileMe.dev" />
        <meta
          property="twitter:image"
          content="http://raw.githubusercontent.com/danielcranney/readme-generator/main/public/social-image.jpg"
        />
        <meta
          property="twitter:description"
          content="Create an awesome GitHub profile in minutes"
        />
        <meta property="twitter:creator" content="@danielcranney" />
      </Head>

      <h1
        className={`mb-4 text-3xl transition-all duration-150 ease-in-out text-dark-900`}
      >
        ProfileMe
        <span className={`transition-all duration-150 ease-in-out text-brand`}>
          .dev
        </span>
      </h1>
      <p>Sorry, we&apos;re currently making some major updates to ProfileMe.</p>
      <p>
        We hope to be live again by Monday March 28th, so please check back
        then!
      </p>
    </div>
  );
}
