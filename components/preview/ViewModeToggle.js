/**
 * ViewModeToggle Component
 * 
 * Segmented control for switching between Preview, Markdown, and Portfolio views.
 */

import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";
import { useAuth } from "../../hooks/useAuth";

export default function ViewModeToggle() {
  const { state, dispatch } = useContext(StateContext);
  const { isSponsor } = useAuth();
  const currentMode = state.renderMode || "preview";

  const modes = [
    { id: "preview", label: "Preview", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )},
    { id: "markdown", label: "Markdown", icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    )},
  ];

  // Add Portfolio mode for sponsors only
  if (isSponsor) {
    modes.push({
      id: "portfolio",
      label: "Portfolio",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    });
  }

  const handleModeChange = (modeId) => {
    dispatch({
      type: ACTIONS.SELECT_RENDER_MODE,
      payload: modeId,
    });
  };

  return (
    <div className="inline-flex rounded-md border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 p-1 shadow-sm">
      {modes.map((mode, index) => (
        <button
          key={mode.id}
          onClick={() => handleModeChange(mode.id)}
          className={`
            flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded transition-all uppercase
            ${
              currentMode === mode.id
                ? "bg-brand text-white shadow-sm hover:bg-brand-alt"
                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700"
            }
            ${index > 0 ? "ml-1" : ""}
          `}
          title={`Switch to ${mode.label} view`}
        >
          {mode.icon}
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
