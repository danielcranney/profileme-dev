import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import SectionOrderManager from "../SectionOrderManager";

export default function PreviewControls({
  copySuccess,
  setCopySuccess,
  markdownRef,
  // resetSocialOrder,
  // resetSkillsOrder,
}) {
  const { state, dispatch } = useContext(StateContext);

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
    <div className="buttons-wrapper">
      <SectionOrderManager />
      <button
        id="PreviewButton"
        onClick={() => {
          dispatch({
            type: ACTIONS.SELECT_RENDER_MODE,
            payload: "preview",
          });
        }}
        className={`btn-sm ${
          state.renderMode === "preview" ? "btn-brand" : "btn-gray"
        }`}
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          ></path>
        </svg>
        Preview
      </button>

      <button
        id="MarkdownButton"
        onClick={() => {
          dispatch({
            type: ACTIONS.SELECT_RENDER_MODE,
            payload: "markdown",
          });
        }}
        className={`btn-sm mr-auto ${
          state.renderMode === "markdown" ? "btn-brand" : "btn-gray"
        }`}
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
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
        Markdown
      </button>

      <button
        className={`btn-sm ${
          copySuccess !== "Copy" ? "btn-brand" : "btn-gray"
        }`}
        onClick={() => {
          dispatch({
            type: ACTIONS.SELECT_RENDER_MODE,
            payload: "markdown",
          });
          copyToClipBoard(markdownRef.current.innerText);
          dispatch({
            type: ACTIONS.TOGGLE_COPY_MODAL,
            payload: true,
          });
        }}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
        </svg>
        {copySuccess}
      </button>

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
