import React, { useContext, forwardRef } from "react";
import { StateContext } from "../pages/_app";

const FormTextarea = forwardRef((props, ref) => {
  const { placeholder, action, type, section } = props;
  const { state, dispatch } = useContext(StateContext);
  return (
    <textarea
      className="input-field"
      name={type}
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

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
