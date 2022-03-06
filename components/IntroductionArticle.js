import React, { useContext, forwardRef } from "react";
import Image from "next/image";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../pages/_app";
import { FormLabel } from "./FormLabel";
import { FormInput } from "./FormInput";
import { SocialInput } from "./SocialInput";

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
