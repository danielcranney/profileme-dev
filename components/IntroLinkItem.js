import React, { useContext, forwardRef } from "react";
import { ACTIONS } from "../pages/_app";
import { StateContext } from "../pages/_app";
import MinimalIntroFormInput from "./forms/MinimalIntroFormInput";

const IntroLinkItem = forwardRef((props, ref) => {
  const { section, type, inputPlaceholder, linkPrefix } = props;
  const { state, dispatch } = useContext(StateContext);
  return (
    <article
      className="flex flex-1 w-full border rounded-md overflow-hidden
      bg-white focus-within:bg-white 
      dark:bg-dark-900 dark:focus-within:bg-dark-900
      border-light-200 focus-within:border-light-400
     dark:border-dark-800 dark:focus-within:border-dark-700
     transition-all duration-150 ease-in-out"
    >
      <div
        className={`flex items-center text-sm
      text-dark-700 dark:text-white`}
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
    </article>
  );
});

IntroLinkItem.displayName = "IntroLinkItem";

export default IntroLinkItem;
