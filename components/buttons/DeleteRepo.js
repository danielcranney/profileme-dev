import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const DeleteRepo = ({ action, type }) => {
  const { dispatch } = useContext(StateContext);
  return (
    <button
      className="btn-sm btn-gray px-2.5 group"
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
        className="w-5 h-5 group-hover:scale-110"
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
