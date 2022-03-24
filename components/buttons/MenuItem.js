import React, { useContext } from "react";

import { ACTIONS } from "../../pages/_app";
import { StateContext } from "../../pages/_app";

const MenuItem = ({ text, section, setSidebarOpen, icon }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <li
      className="group"
      onClick={() => {
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: section,
        });
        setSidebarOpen(false);
      }}
    >
      <span
        className={`flex items-center w-full ${
          state.section === section
            ? "border-white text-white bg-dark-900/20"
            : "border-brand text-dark-300 group-hover:border-dark-900/30 group-hover:text-white"
        }`}
      >
        {icon}
        {text}
      </span>
    </li>
  );
};

export default MenuItem;
