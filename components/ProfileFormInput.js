import React, { useContext, forwardRef } from "react";
import { StateContext } from "../pages/_app";

export const ProfileFormInput = forwardRef((props, ref) => {
  const { placeholder, action, type, section, linkSuffix } = props;
  const { state, dispatch } = useContext(StateContext);
  return (
    <input
      className="input-field"
      placeholder={placeholder}
      ref={ref}
      value={state[section][type][linkSuffix]}
      onChange={() =>
        dispatch({
          type: action,
          payload: { title: type, value: ref.current.value },
        })
      }
    />
  );
});
