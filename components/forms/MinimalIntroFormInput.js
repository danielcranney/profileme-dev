import React, { useContext, forwardRef } from "react";
import { StateContext } from "../../pages/_app";

const MinimalFormInput = forwardRef((props, ref) => {
  const { placeholder, action, type, section } = props;
  const { state, dispatch } = useContext(StateContext);
  return (
    <input
      name={type}
      className="minimal-input-field appearance-none"
      placeholder={placeholder}
      ref={ref}
      value={state[section][type]}
      onChange={() =>
        dispatch({
          type: action,
          payload: { title: type, value: ref.current.value },
        })
      }
    />
  );
});

MinimalFormInput.displayName = "MinimalFormInput";

export default MinimalFormInput;
