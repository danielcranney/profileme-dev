import React, { useContext, forwardRef } from "react";
import { StateContext } from "../pages/_app";

export const FormInput = forwardRef((props, ref) => {
  const { placeholder, action, type } = props;
  const { dispatch } = useContext(StateContext);
  return (
    <input
      className="input-field"
      placeholder={placeholder}
      ref={ref}
      onChange={() =>
        dispatch({
          type: action,
          payload: { title: type, value: ref.current.value },
        })
      }
    />
  );
});
