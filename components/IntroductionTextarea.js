import React, { useContext, forwardRef } from "react";
import Image from "next/image";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../pages/_app";
import FormLabel from "./FormLabel";
import FormTextarea from "./FormTextarea";

const IntroductionTextarea = forwardRef((props, ref) => {
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

IntroductionTextarea.displayName = "IntroductionTextarea";

export default IntroductionTextarea;
