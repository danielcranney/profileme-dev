import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../pages/_app";

const PreviousSection = ({ sectionToGoTo }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <button
      className="flex mr-auto text-xs font-bold text-right underline track-wide text-brand dark:hover:text-white hover:text-darm-700"
      onClick={() => {
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: sectionToGoTo,
        });
      }}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
      Previous section
    </button>
  );
};

export default PreviousSection;
