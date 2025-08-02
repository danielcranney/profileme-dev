import React, { useContext, forwardRef } from "react";
import Image from "next/image";
import { StateContext } from "../pages/_app";
import { useTheme } from "next-themes";
import FormLabel from "./forms/FormLabel";
import MinimalSocialFormInput from "./forms/MinimalSocialFormInput";
import { PROJECT_URL } from "../lib/constants/config";

const SocialItem = forwardRef((props, ref) => {
  const {
    formLabelText,
    linkPrefix,
    account,
    inputPlaceholder,
    section,
    action,
    linkSuffixTwo,
  } = props;

  const { state, dispatch } = useContext(StateContext);
  const { systemTheme, theme, setTheme } = useTheme();

  return (
    <article className="flex flex-col flex-1 w-full">
      <FormLabel
        text={formLabelText}
        icon={
          <Image
            src={
              state[section][account].darkPath
                ? theme == "dark"
                  ? `${PROJECT_URL}/icons/${section}/${account}-dark.svg`
                  : `${PROJECT_URL}/icons/${section}/${account}.svg`
                : `${PROJECT_URL}/icons/${section}/${account}.svg`
            }
            width={20}
            height={20}
            alt={account}
          />
        }
      />
      <div
        className="flex rounded-md overflow-visible border
        bg-white focus-within:bg-white 
      dark:bg-dark-900 dark:focus-within:bg-dark-900
      border-light-200 focus-within:border-light-400
     dark:border-dark-800 dark:focus-within:border-dark-700
    text-dark-700 dark:text-white
    transition-all duration-150 ease-in-out"
      >
        <div className="flex items-center text-sm">
          <span className="py-2 pl-2 leading-4 select-none">{linkPrefix}</span>
        </div>
        <MinimalSocialFormInput
          ref={ref}
          section={section}
          type={account}
          placeholder={inputPlaceholder}
          action={action}
        />
        {linkSuffixTwo}
      </div>
    </article>
  );
});

SocialItem.displayName = "SocialItem";

export default SocialItem;
