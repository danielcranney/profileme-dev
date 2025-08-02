import React, { useRef, useContext } from "react";
import { ACTIONS } from "../../lib/constants/actions";
import { StateContext } from "../../pages/_app";
import PreviousSection from "../buttons/PreviousSection";
import SectionHeader from "../SectionHeader";
import SocialItem from "../../components/SocialItem";

const Support = React.forwardRef((props, ref) => {
  const { state, dispatch } = useContext(StateContext);

  // Support Ref
  const buymeacoffeeRef = useRef();
  const kofiRef = useRef();

  return (
    <>
      <section className="section-header-wrapper">
        <SectionHeader
          header={"Support"}
          subhead={`Make it easy for people using your products to support you or give donations.`}
        />
        <div className="flex mt-4">
          <PreviousSection sectionToGoTo={"badges"} />
        </div>
      </section>
      <section className="flex flex-col overflow-y-auto">
        <div ref={ref}></div>
        <section className="flex flex-col p-6 gap-y-4">
          {/* GitHub Input */}
          <SocialItem
            ref={buymeacoffeeRef}
            section={"support"}
            account={"buymeacoffee"}
            inputPlaceholder={"yourname"}
            formLabelText={"Buy Me a Coffee:"}
            linkPrefix={state.support.buymeacoffee.linkPrefix}
            action={ACTIONS.ADD_SUPPORT}
          />
          <SocialItem
            ref={kofiRef}
            section={"support"}
            account={"kofi"}
            inputPlaceholder={"yourname"}
            formLabelText={"Ko-fi:"}
            linkPrefix={state.support.kofi.linkPrefix}
            action={ACTIONS.ADD_SUPPORT}
          />
          <section className="flex mt-4">
            <PreviousSection sectionToGoTo={"badges"} />
          </section>
        </section>
      </section>
    </>
  );
});

Support.displayName = "Support";
export default Support;
