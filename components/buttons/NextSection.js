import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";
import { ACTIONS } from "../../pages/_app";

const NextSection = ({ sectionToGoTo }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <button
      className="ml-auto btn-xs btn-gray"
      onClick={() => {
        dispatch({
          type: ACTIONS.SHOW_SECTION,
          payload: sectionToGoTo,
        });
      }}
    >
      Next section
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
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </button>
  );
};

export default NextSection;
