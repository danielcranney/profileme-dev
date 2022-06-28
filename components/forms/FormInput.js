import React, {useContext, forwardRef} from "react";
import {StateContext} from "../../pages/_app";

const FormInput = forwardRef((props, ref) => {
   const {placeholder, action, type, section, dropdown} = props;
   const {state, dispatch} = useContext(StateContext);
   if (!dropdown) {
      return (
         <input
            type="text"
            name={type}
            className="input-field"
            placeholder={placeholder}
            value={state[section][type]}
            ref={ref}
            onChange={() =>
               dispatch({
                  type: action,
                  payload: {title: type, value: ref.current.value},
               })
            }
         />
      );
   } else {
      return (
         <select value={state[section][type]} placeholder={placeholder} ref={ref} className={'input-field'}
                 onChange={() => dispatch({
                    type: action,
                    payload: {title: type, value: ref.current.value}
                 })}>
            <option value={1}>Yes</option>
            <option value={0}>No</option>
         </select>
      )
   }
});

FormInput.displayName = "FormInput";

export default FormInput;
