import React, { useContext, forwardRef } from "react";
import { ACTIONS } from "../pages/_app";
import MinimalIntroFormInput from "./forms/MinimalIntroFormInput";

const IntroLinkItem = forwardRef((props, ref) => {
  const { section, type, inputPlaceholder, linkPrefix } = props;
  return (
    <article className="flex flex-col flex-1 w-full">
      <div className="flex rounded-md overflow-hidden">
        <div
          className="flex items-center text-sm bg-light-200/70 dark:bg-dark-900
    text-dark-700 dark:text-white"
        >
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
