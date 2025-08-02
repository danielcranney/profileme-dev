import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../lib/constants/actions";

const PreviousSection = ({ sectionToGoTo }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <button
      className="btn-sm btn-gray-outline mr-auto flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
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
      <span>Previous</span>
    </button>
  );
};

export default PreviousSection;
