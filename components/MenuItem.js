import React, { useContext } from "react";

import { ACTIONS } from "../pages/_app";
import { StateContext } from "../pages/_app";

export const MenuItem = ({ text, section }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <li
      className="menu-item"
      onClick={() => {
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: section,
        });
      }}
    >
      <svg
        className={`${
          state.section === section
            ? "opacity-100 w-4 h-4"
            : "opacity-0 transition-all duration-500 ease-in-out w-0 h-0"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        ></path>
      </svg>
      {text}
    </li>
  );
};
