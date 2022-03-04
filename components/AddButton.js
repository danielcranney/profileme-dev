import React, { useContext } from "react";
import { StateContext } from "../pages/_app";

export const AddButton = ({ action, repoNumberToAdd }) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <button
      className="text-white border bg-dark-700 border-dark-600"
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
      +
    </button>
  );
};
