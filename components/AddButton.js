import React, { useContext } from "react";
import { StateContext } from "../pages/_app";

export const AddButton = ({ action, repoNumberToAdd }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <button
      className="flex items-center justify-center py-1.5 text-white border bg-dark-700 border-dark-600"
      onClick={() => {
        dispatch({
          type: action,
          payload: {
            title: repoNumberToAdd,
            value: "",
          },
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
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        ></path>
      </svg>
    </button>
  );
};
