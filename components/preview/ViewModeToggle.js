/**
 * ViewModeToggle Component
 *
 * Simple two-way toggle: Profile | Links page only.
 * View format (Preview / Markdown / JSON) lives in the menu.
 */

import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { useAuth } from "../../hooks/useAuth";

const GitHubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.415 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export default function ViewModeToggle() {
  const { state, dispatch } = useContext(StateContext);
  const { isSponsor } = useAuth();
  const mainTab = state.mainTab ?? (state.renderMode === "linksPage" ? "linksPage" : "profile");
  const isProfile = mainTab === "profile";
  const isLinksPage = mainTab === "linksPage";

  const setMainTab = (tab) => {
    dispatch({ type: ACTIONS.SELECT_MAIN_TAB, payload: tab });
  };

  return (
    <div className="inline-flex items-center rounded-md border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 p-1 shadow-sm">
      <button
        onClick={() => setMainTab("profile")}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded transition-all uppercase ${
          isProfile
            ? "bg-brand text-white shadow-sm hover:bg-brand-alt"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700"
        }`}
        title="Profile (GitHub README)"
      >
        <GitHubIcon />
        <span>Profile</span>
      </button>
      <div className="w-px h-6 bg-gray-300 dark:bg-dark-600 shrink-0 mx-0.5" aria-hidden="true" />
      <button
        onClick={() => isSponsor && setMainTab("linksPage")}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded transition-all uppercase ${
          isLinksPage
            ? "bg-brand text-white shadow-sm hover:bg-brand-alt"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700"
        } ${!isSponsor ? " opacity-75 cursor-not-allowed" : ""}`}
        title={
          !isSponsor
            ? "Links page is for GitHub sponsors — sign in or sponsor to unlock"
            : "Links page"
        }
        disabled={!isSponsor}
      >
        <GlobeIcon />
        <span>Links page</span>
      </button>
    </div>
  );
}
