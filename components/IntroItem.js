import React, { forwardRef } from "react";
import { ACTIONS } from "../pages/_app";
import FormLabel from "./forms/FormLabel";
import FormInput from "./forms/FormInput";

const IntroItem = forwardRef((props, ref) => {
  const { formLabelText, formLabelIcon, section, type, inputPlaceholder, dropdown } =
    props;
  return (
    <article className="flex flex-col flex-1 w-full rounded-lg">
      <FormLabel text={formLabelText} icon={formLabelIcon} />
      <FormInput
        ref={ref}
        section={section}
        type={type}
        dropdown={dropdown}
        placeholder={inputPlaceholder}
        action={ACTIONS.ADD_INTRODUCTION}
      />
    </article>
  );
});

IntroItem.displayName = "IntroItem";

export default IntroItem;
