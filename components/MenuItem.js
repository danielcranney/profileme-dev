import React, { useContext } from "react";

import { ACTIONS } from "../pages/_app";
import { StateContext } from "../pages/_app";

export const MenuItem = ({ text, section }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <li
      className="bg-dark-700 group"
      onClick={() => {
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: section,
        });
      }}
    >
      <span
        className={`border-l-4 h-full flex items-center p-3 transition-all duration-150 ease-in-out font-semibold uppercase tracking-wide text-xs ${
          state.section === section
            ? "border-brand text-white"
            : "border-dark-700 text-dark-300 group-hover:border-dark-500"
        }`}
      >
        {text}
      </span>
    </li>
  );
};
