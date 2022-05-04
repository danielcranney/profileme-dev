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
        if (router.pathname !== "") {
          router.push("/");
        }
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: section,
        });
        dispatch({
          type: ACTIONS.TOGGLE_SIDEBAR,
        });
      }}
    >
      <span
        className={`flex items-center w-full ${
          state.section === section
            ? "border-white text-white bg-dark-900/20 opacity-100"
            : "border-brand text-white opacity-75 group-hover:border-dark-900/20 group-hover:text-white group-hover:opacity-100"
        }`}
      >
        {icon}
        {text}
      </span>
    </li>
  );
};

export default MenuItem;
