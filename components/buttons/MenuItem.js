import React, { useContext } from "react";

import { ACTIONS } from "../../pages/_app";
import { StateContext } from "../../pages/_app";
import { useRouter } from "next/router";

const MenuItem = ({ text, section, icon }) => {
  const { state, dispatch } = useContext(StateContext);
  const router = useRouter();

  return (
    <li
      className="group"
      onClick={() => {
        console.log("Pathname is: " + router.pathname);
        if (router.pathname !== "/create-profile") {
          router.push("/");
        }
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: section,
        });
        dispatch({
          type: ACTIONS.TOGGLE_ELEMENT,
          payload: {
            elementToToggle: "sidebarOpen",
          },
        });
      }}
    >
      <span
        className={`flex items-center w-full transition-all duration-150 ease-in-out ${
          state.section === section
            ? "border-brand text-white bg-dark-800/40 dark:bg-dark-500/20 opacity-100"
            : "bg-transparent group-hover:bg-dark-800/40 dark:bg-transparent dark:group-hover:bg-dark-500/20 text-white border-dark-700 group-hover:border-dark-500 opacity-75 group-hover:text-white group-hover:opacity-100 dark:group-hover:opacity-100"
        }`}
      >
        {icon}
        {text}
      </span>
    </li>
  );
};

export default MenuItem;
