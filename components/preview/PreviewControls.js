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
      
      {/* Right Group: Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Portfolio Settings Button (Sponsors Only, Portfolio Mode Only) */}
        {isSponsor && state.renderMode === "portfolio" && (
          <>
            <button
              onClick={() => setShowPortfolioSettings(!showPortfolioSettings)}
              className={`btn-sm flex items-center gap-1.5 ${
                showPortfolioSettings
                  ? "btn-brand"
                  : "btn-gray"
              }`}
              title="Portfolio Settings"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span className="text-xs uppercase tracking-wide">Settings</span>
            </button>
            
            {/* Visual Separator */}
            <div className="h-8 w-px bg-gray-300 dark:bg-dark-700" />
          </>
        )}
        
        {/* GitHub Sync (Sponsors Only) */}
        {isSponsor && (
          <>
            <SyncMenuButton />
            
            {/* Visual Separator */}
            <div className="h-8 w-px bg-gray-300 dark:bg-dark-700" />
          </>
        )}
        
        {/* Actions Menu */}
        <ActionsMenu 
          copySuccess={copySuccess}
          setCopySuccess={setCopySuccess}
          markdownRef={markdownRef}
        />
      </div>
      
      {/* Portfolio Settings Panel - Slide-in sidebar */}
      {isSponsor && state.renderMode === "portfolio" && showPortfolioSettings && (
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
