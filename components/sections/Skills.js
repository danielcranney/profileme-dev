import React, { useRef } from "react";
import NextSection from "../buttons/NextSection";
import PreviousSection from "../buttons/PreviousSection";
import IconSelector from "../IconSelector";
import SectionHeader from "../SectionHeader";

const Skills = React.forwardRef(({ handleIconToggle }, ref) => {
  return (
    <>
      <section className="section-header-wrapper">
        <SectionHeader
          header={"Skills"}
          subhead={`Show off the languages,
                frameworks, software and tech that you use.`}
        />
        <div className="flex mt-4">
          <PreviousSection sectionToGoTo={"introduction"} />
          <NextSection sectionToGoTo={"socials"} />
        </div>
      </section>
      <section className="flex flex-col overflow-y-auto">
        {/* Core */}
        <div ref={ref}></div>
        <section className="flex flex-col px-6 pt-6 pb-6 gap-y-6">
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Core"}
            iconType={"core"}
          />
          {/* Frontend */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Frontend"}
            iconType={"frontend"}
          />
          {/* Backend and DB */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Backend and Database"}
            iconType={"backend"}
          />
          {/* Other */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Other"}
            iconType={"other"}
          />
          {/* Software */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Software"}
            iconType={"software"}
          />
          {/* Web 3 */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Web3"}
            iconType={"web3"}
          />
          <section className="flex mt-4">
            <PreviousSection sectionToGoTo={"introduction"} />
            <NextSection sectionToGoTo={"socials"} />
          </section>
        </section>
      </section>
    </>
  );
});

Skills.displayName = "Skills";
export default Skills;
