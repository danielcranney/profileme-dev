import React, { useContext, forwardRef } from "react";
import { ACTIONS } from "../pages/_app";
import FormLabel from "./forms/FormLabel";
import FormTextarea from "./forms/FormTextarea";

const IntroTextarea = forwardRef((props, ref) => {
  const { formLabelText, formLabelIcon, section, type, inputPlaceholder } =
    props;
  return (
    <article className="flex flex-col flex-1 w-full">
      <FormLabel text={formLabelText} icon={formLabelIcon} />
      <FormTextarea
        ref={ref}
        section={section}
        type={type}
        placeholder={inputPlaceholder}
        action={ACTIONS.ADD_INTRODUCTION}
      />
    </article>
  );
});

IntroTextarea.displayName = "IntroTextarea";

export default IntroTextarea;
