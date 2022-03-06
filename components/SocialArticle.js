import React, { useContext, forwardRef } from "react";
import Image from "next/image";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../pages/_app";
import { FormLabel } from "./FormLabel";
import SocialInput from "./SocialInput";

const SocialArticle = forwardRef((props, ref) => {
  const {
    formLabelText,
    linkPrefix,
    account,
    inputPlaceholder,
    section,
    action,
  } = props;
  const { state, dispatch } = useContext(StateContext);

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
          <span className="py-2 pl-2 mt-0 mb-0 leading-4">{linkPrefix}</span>
        </div>
        <SocialInput
          ref={ref}
          section={section}
          type={account}
          placeholder={inputPlaceholder}
          action={action}
        />
      </div>
    </article>
  );
});

SocialArticle.displayName = "SocialArticle";

export default SocialArticle;
