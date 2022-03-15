import React, { useContext, forwardRef } from "react";
import Image from "next/image";
import { StateContext } from "../pages/_app";
import FormLabel from "./forms/FormLabel";
import MinimalSocialFormInput from "./forms/MinimalSocialFormInput";

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

  return (
    <article className="flex flex-col flex-1 w-full">
      <FormLabel
        text={formLabelText}
        icon={
          <Image
            src={`https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/${section}/${account}.svg`}
            width={20}
            height={20}
          />
        }
      />
      <div className="flex border bg-dark-900 border-dark-600">
        <div className="flex items-center text-sm text-dark-300 bg-dark-900">
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
