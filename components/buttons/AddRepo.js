import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const AddRepo = ({ action, repoNumberToAdd }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <button
      className="btn-xs btn-gray justify-center"
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

export default AddRepo;
