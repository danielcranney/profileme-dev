/**
 * ActionsMenu Component
 *
 * Menu: view switch (Preview | Markdown | JSON), Copy Markdown (Profile),
 * Copy JSON, Reorder sections. Settings is a separate visible button in the bar.
 */

import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { useAuth } from "../../hooks/useAuth";
import { loadProfileJson, stateToProfileJson } from "../../lib/profile";
import ReorderSectionsButton from "./ReorderSectionsButton";

const PreviewIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const MarkdownIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

const JsonIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
    />
  </svg>
);

export default function ActionsMenu({
  copySuccess,
  setCopySuccess,
  markdownRef,
}) {
  const { state, dispatch } = useContext(StateContext);
  const { isSponsor } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const mainTab =
    state.mainTab ??
    (state.renderMode === "linksPage" ? "linksPage" : "profile");
  const renderMode = state.renderMode || "preview";

  const setRenderMode = (mode) => {
    dispatch({ type: ACTIONS.SELECT_RENDER_MODE, payload: mode });
  };

  const profileSubOptions = [
    { id: "preview", label: "Preview", icon: <PreviewIcon /> },
    { id: "markdown", label: "Markdown", icon: <MarkdownIcon /> },
    { id: "json", label: "JSON", icon: <JsonIcon /> },
  ];
  const linksPageSubOptions = [
    { id: "linksPage", label: "Preview", icon: <PreviewIcon /> },
    { id: "json", label: "JSON", icon: <JsonIcon /> },
  ];
  const subOptions =
    mainTab === "profile" ? profileSubOptions : linksPageSubOptions;
  const activeSubId =
    mainTab === "profile"
      ? renderMode === "preview"
        ? "preview"
        : renderMode === "markdown"
        ? "markdown"
        : "json"
      : renderMode === "linksPage"
      ? "linksPage"
      : "json";

  const copyToClipBoard = async (copyMe, label = "Copy") => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("Copied");
      const timer = setTimeout(() => setCopySuccess(label), 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  const handleCopyMarkdown = () => {
    dispatch({ type: ACTIONS.SELECT_MAIN_TAB, payload: "profile" });
    dispatch({ type: ACTIONS.SELECT_RENDER_MODE, payload: "markdown" });
    const markdownText =
      markdownRef.current?.innerText || markdownRef.current?.textContent || "";
    copyToClipBoard(markdownText, "Copy");
    dispatch({ type: ACTIONS.TOGGLE_COPY_MODAL, payload: true });
    setShowMenu(false);
  };

  const handleCopyJson = () => {
    try {
      const saved = loadProfileJson();
      const stateJson = stateToProfileJson(state);
      const merged = saved
        ? {
            ...saved,
            profile: stateJson.profile,
            updatedAt: stateJson.updatedAt,
          }
        : stateJson;
      copyToClipBoard(JSON.stringify(merged, null, 2), "Copy");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`btn-sm flex items-center gap-2 px-3 h-9 ${
          showMenu ? "btn-brand" : "btn-gray"
        }`}
        title="View, copy, reorder"
      >
        <span className="text-xs font-semibold uppercase tracking-wide">
          Menu
        </span>
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-md shadow-lg z-50 min-w-[230px] py-1">
          {/* View format: Preview | Markdown | JSON (or Preview | JSON) */}
          <div className="px-2 py-2 border-t border-gray-200 dark:border-dark-700">
            <div className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
              View
            </div>
            <div className="flex gap-0.5">
              {subOptions.map((opt) => {
                const isActive = activeSubId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setRenderMode(
                        opt.id === "linksPage" ? "linksPage" : opt.id
                      )
                    }
                    className={`flex items-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium uppercase transition-all ${
                      isActive
                        ? "bg-gray-200 dark:bg-dark-600 text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy Markdown (Profile) */}
          <button
            onClick={handleCopyMarkdown}
            className="w-full text-left px-3 py-2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center gap-2 border-t border-gray-200 dark:border-dark-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            <span>Copy Markdown</span>
            <span className="text-[10px] font-normal text-gray-400 dark:text-gray-500">
              Profile
            </span>
          </button>

          {/* Copy JSON */}
          {isSponsor && (
            <button
              onClick={handleCopyJson}
              className="w-full text-left px-3 py-2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center gap-2"
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
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              <span>Copy JSON</span>
            </button>
          )}

          {/* Reorder sections */}
          <div className="border-t border-gray-200 dark:border-dark-700">
            <ReorderSectionsButton onClose={() => setShowMenu(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
