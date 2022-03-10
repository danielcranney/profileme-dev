import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const DeleteRepo = ({ action, type }) => {
  const { dispatch } = useContext(StateContext);
  return (
    <button
      className="btn-sm border border-dark-500 w-9.5 justify-center text-dark-300 hover:text-white group"
      onClick={() =>
        dispatch({
          type: action,
          payload: {
            title: type,
            value: null,
          },
        })
      }
    >
      <svg
        className="w-6 h-6 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  );
};

export default DeleteRepo;
