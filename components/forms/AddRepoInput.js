import React, { useContext, forwardRef } from "react";
import { StateContext } from "../../pages/_app";

const AddRepoInput = forwardRef((props, ref) => {
  const { placeholder, action, type, section } = props;
  const { state, dispatch } = useContext(StateContext);
  return (
    <input
      type="text"
      name={type}
      className="input-field"
      placeholder={placeholder}
      value={state.badges[section][type]}
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

AddRepoInput.displayName = "AddRepoInput";

export default AddRepoInput;
