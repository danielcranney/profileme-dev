import React from "react";
import Link from "next/link";
import GitHubIcon from "./GitHubIcon";
import XIcon from "./XIcon";
import { useAuth } from "../../hooks/useAuth";

const SidebarFooter = () => {
  const { isFullyAuthenticated, isSponsor } = useAuth();

  return (
    <div className={`z-40 flex flex-col px-6 gap-y-2`}>
      <p className="text-xs text-white/80 dark:text-white/80 mb-0">
        Profile is saved locally in this browser.
      </p>
      {isFullyAuthenticated && isSponsor && (
        <p className="text-xs text-white/80 dark:text-white/80 mb-0">
          Sync to publish · Restore to load from GitHub
        </p>
      )}

      <article className="flex gap-x-2 items-center">
        <GitHubIcon />
        <XIcon />
      </article>

      <p className="text-xs text-white dark:text-white mb-0">
        &copy; {new Date().getFullYear()} Dan Cranney
      </p>

      <div className="flex text-xs text-white dark:text-white">
        <a
          href="https://www.x.com/danielcranney"
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
