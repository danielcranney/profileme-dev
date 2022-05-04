import React from "react";
import Link from "next/link";
import GitHubIcon from "./GitHubIcon";
import TwitterIcon from "./TwitterIcon";

const SidebarFooter = () => {
  return (
    <div className={`z-40 flex flex-col px-6 gap-y-2`}>
      <article className="flex gap-x-2 items-center">
        <GitHubIcon />
        <TwitterIcon />
      </article>

      <p className="text-xs text-white dark:text-white mb-0">
        &copy; 2022 Dan Cranney
      </p>

      <div className="flex text-xs text-white dark:text-white">
        <a
          href="https://www.twitter.com/danielcranney"
          rel="noreferrer"
          target="_blank"
          className="flex mr-1.5 opacity-70 hover:opacity-100 text-white hover:text-white transition-all duration-150 ease-in-out"
        >
          Follow me
        </a>{" "}
        |{" "}
        <a
          href="https://www.buymeacoffee.com/danielcranney"
          rel="noreferrer"
          target="_blank"
          className="flex ml-1.5 opacity-70 hover:opacity-100 text-white hover:text-white transition-all duration-150 ease-in-out"
        >
          Buy Me a Coffee
        </a>
      </div>
    </div>
  );
};

export default SidebarFooter;
