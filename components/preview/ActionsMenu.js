/**
 * ActionsMenu Component
 * 
 * Dropdown menu for Copy and Reorder Sections actions.
 */

import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import ReorderSectionsButton from "./ReorderSectionsButton";

export default function ActionsMenu({ copySuccess, setCopySuccess, markdownRef }) {
  const { state, dispatch } = useContext(StateContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

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

  const handleCopy = () => {
    dispatch({
      type: ACTIONS.SELECT_RENDER_MODE,
      payload: "markdown",
    });
    // Copy markdown text from the ref
    const markdownText = markdownRef.current?.innerText || markdownRef.current?.textContent || "";
    copyToClipBoard(markdownText);
    dispatch({
      type: ACTIONS.TOGGLE_COPY_MODAL,
      payload: true,
    });
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn-sm btn-gray flex items-center gap-1.5"
        title="More actions"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        Actions
      </button>
      
      {showMenu && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-md shadow-lg z-50 min-w-[180px]">
          <button
            onClick={handleCopy}
            className="w-full text-left px-3 py-2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
            </svg>
            <span>{copySuccess}</span>
          </button>
          <div className="border-t border-gray-200 dark:border-dark-700">
            <ReorderSectionsButton onClose={() => setShowMenu(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
