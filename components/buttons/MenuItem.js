import React, { useContext } from "react";

import { ACTIONS } from "../../pages/_app";
import { StateContext } from "../../pages/_app";

const MenuItem = ({ text, section, setSidebarOpen }) => {
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
        className={`${
          state.section === section
            ? "border-brand dark:text-white text-slate-700"
            : "dark:border-dark-700 border-slate-300 dark:text-dark-300 text-slate-400 dark:group-hover:border-dark-500 dark:group-hover:text-white group-hover:border-dark-700 group-hover:text-slate-700"
        }`}
      >
        {text}
      </span>
    </li>
  );
};

export default MenuItem;
