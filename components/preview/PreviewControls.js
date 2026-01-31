import React, { useContext, useState } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { useAuth } from "../../hooks/useAuth";
import SyncMenuButton from "../sponsor/SyncMenuButton";
import ViewModeToggle from "./ViewModeToggle";
import ActionsMenu from "./ActionsMenu";
import GitHubPagesSettings from "../sponsor/GitHubPagesSettings";

export default function PreviewControls({
  copySuccess,
  setCopySuccess,
  markdownRef,
  // resetSocialOrder,
  // resetSkillsOrder,
}) {
  const { state, dispatch } = useContext(StateContext);
  const { isSponsor } = useAuth();
  const [showPortfolioSettings, setShowPortfolioSettings] = useState(false);

  // Close settings panel when switching away from portfolio mode
  React.useEffect(() => {
    if (state.renderMode !== "portfolio") {
      setShowPortfolioSettings(false);
    }
  }, [state.renderMode]);

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("Copied");
      const timer = setTimeout(() => {
        setCopySuccess("Copy");
      }, 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  return (
    <div className="buttons-wrapper flex items-center justify-between gap-3 flex-wrap">
      {/* Left Group: View Mode Toggle */}
      <ViewModeToggle />

      {/* Right Group: Settings + Actions (grouped), then Sync as main button */}
      <div className="flex items-center gap-2">
        {/* Portfolio Settings (Sponsors, Portfolio mode only) - cog icon, text on hover */}
        {isSponsor && state.renderMode === "portfolio" && (
          <button
            onClick={() => setShowPortfolioSettings(!showPortfolioSettings)}
            className={`btn-sm flex items-center justify-end gap-1.5 min-w-[2.25rem] overflow-hidden transition-[min-width] duration-200 ease-out group hover:min-w-[6.5rem] h-9 ${
              showPortfolioSettings ? "btn-brand" : "btn-gray"
            }`}
            title="Portfolio Settings"
          >
            <span className="text-xs uppercase tracking-wide whitespace-nowrap max-w-0 overflow-hidden opacity-0 group-hover:max-w-[4.5rem] group-hover:opacity-100 transition-all duration-200 flex items-center self-center -ml-2 group-hover:ml-0">
              Settings
            </span>
            <span className="flex items-center justify-center flex-shrink-0 w-6 h-6">
              <svg
                className="w-4 h-4 block translate-y-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
          </button>
        )}

        {/* Actions Menu - ellipsis icon, text on hover */}
        <ActionsMenu
          copySuccess={copySuccess}
          setCopySuccess={setCopySuccess}
          markdownRef={markdownRef}
        />

        {/* Separator before main Sync button */}
        {isSponsor && <div className="h-6 w-px bg-gray-300 dark:bg-dark-700" />}

        {/* GitHub Sync (Sponsors) - main button */}
        {isSponsor && <SyncMenuButton />}
      </div>

      {/* Portfolio Settings Panel - Slide-in sidebar */}
      {isSponsor &&
        state.renderMode === "portfolio" &&
        showPortfolioSettings && (
          <GitHubPagesSettings
            isOpen={showPortfolioSettings}
            onClose={() => setShowPortfolioSettings(false)}
          />
        )}

      {/* 
      
      Below is the UI code for buttons that reset the default over of the socials icons, and skills icons.
      These were created to help with testing the drag and drop functionality, and are not needed for the final product,
      but might be useful for future reference. 
      
      */}

      {/* Reset Social Order Button - only show when in preview mode and socials are showing */}
      {/* {state.renderMode === "preview" && (
        <button
          className="btn-sm btn-gray ml-2"
          onClick={resetSocialOrder}
          title="Reset social icons order"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Reset Socials
        </button>
      )} */}

      {/* Reset Skills Order Button - only show when in preview mode */}
      {/* {state.renderMode === "preview" && (
        <button
          className="btn-sm btn-gray ml-2"
          onClick={resetSkillsOrder}
          title="Reset skills icons order"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Reset Skills
        </button>
      )} */}
    </div>
  );
}
