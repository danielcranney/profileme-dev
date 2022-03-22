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
        className={`flex items-center ${
          state.section === section
            ? "border-brand dark:text-white text-brand"
            : "dark:border-dark-800 border-white dark:text-dark-300 text-slate-400 dark:group-hover:border-dark-500 dark:group-hover:text-white group-hover:border-light-200 group-hover:text-slate-500"
        }`}
      >
        {icon}
        {text}
      </span>
    </li>
  );
};

export default MenuItem;
