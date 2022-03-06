import React, { useContext, forwardRef } from "react";
import { StateContext } from "../pages/_app";

export const SocialInput = forwardRef((props, ref) => {
  const { placeholder, action, type, section } = props;
  const { state, dispatch } = useContext(StateContext);
  return (
    <input
      className="minimal-input-field"
      placeholder={placeholder}
      ref={ref}
      name={type}
      value={state[section][type]["linkSuffix"]}
      onChange={() =>
        dispatch({
          type: action,
          payload: { title: type, value: ref.current.value },
        })
      }
    />
  );
});
