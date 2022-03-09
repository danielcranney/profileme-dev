import React, { forwardRef } from "react";
import { ACTIONS } from "../pages/_app";
import FormLabel from "./forms/FormLabel";
import FormInput from "./forms/FormInput";

const IntroductionArticle = forwardRef((props, ref) => {
  const { formLabelText, formLabelIcon, section, type, inputPlaceholder } =
    props;
  return (
    <article className="flex flex-col flex-1 w-full">
      <FormLabel text={formLabelText} icon={formLabelIcon} />
      <FormInput
        ref={ref}
        section={section}
        type={type}
        placeholder={inputPlaceholder}
        action={ACTIONS.ADD_INTRODUCTION}
      />
    </article>
  );
});

IntroductionArticle.displayName = "IntroductionArticle";

export default IntroductionArticle;
