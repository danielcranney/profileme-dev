import React, { useContext, forwardRef } from "react";
import Image from "next/image";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../pages/_app";
import { FormLabel } from "./FormLabel";
import FormInput from "./FormInput";
import SocialInput from "./SocialInput";

const IntroductionArticleWithLink = forwardRef((props, ref) => {
  const { section, type, inputPlaceholder, linkPrefix } = props;
  return (
    <article className="flex flex-col flex-1 w-full">
      <div className="flex border-b border-l border-r bg-dark-900 border-dark-600">
        <div className="flex items-center text-sm text-dark-300 bg-dark-900">
          <span className="py-2 pl-2 mt-0 mb-0 leading-4">{linkPrefix}</span>
        </div>
        <SocialInput
          ref={ref}
          section={section}
          type={type}
          placeholder={inputPlaceholder}
          action={ACTIONS.ADD_INTRODUCTION}
        />
      </div>
    </article>
  );
});

IntroductionArticleWithLink.displayName = "IntroductionArticleWithLink";

export default IntroductionArticleWithLink;
