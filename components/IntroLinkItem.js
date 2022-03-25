import React, { useContext, forwardRef } from "react";
import { ACTIONS } from "../pages/_app";
import MinimalIntroFormInput from "./forms/MinimalIntroFormInput";

const IntroLinkItem = forwardRef((props, ref) => {
  const { section, type, inputPlaceholder, linkPrefix } = props;
  return (
    <article className="flex flex-col flex-1 w-full">
      <div className="flex rounded-md overflow-hidden bg-dark-900">
        <div className="flex items-center text-sm text-dark-300 bg-dark-900">
          <span className="py-2 pl-2 mt-0 mb-0 leading-4">{linkPrefix}</span>
        </div>
        <MinimalIntroFormInput
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

IntroLinkItem.displayName = "IntroLinkItem";

export default IntroLinkItem;
