import React, { useRef } from "react";
import NextSection from "../buttons/NextSection";
import PreviousSection from "../buttons/PreviousSection";
import IconSelector from "../IconSelector";
import SectionHeader from "../SectionHeader";
import { iconData } from "../../pages/_app";

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
        <div ref={ref}></div>
        <section className="flex flex-col px-6 pt-6 pb-6 gap-y-6">
          {/* Core */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Core"}
            iconType={"core"}
            iconData={iconData}
          />{" "}
          {/* Scripting */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Scripting"}
            iconType={"scripting"}
            iconData={iconData}
          />
          {/* Code Editors */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Code Editors"}
            iconType={"editors"}
            iconData={iconData}
          />
          {/* Frontend */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Frontend"}
            iconType={"frontend"}
            iconData={iconData}
          />
          {/* Backend and DB */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Backend and Database"}
            iconType={"backend"}
            iconData={iconData}
          />
          {/* Software */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Software"}
            iconType={"software"}
            iconData={iconData}
          />
          {/* Web 3 */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Web3"}
            iconType={"web3"}
            iconData={iconData}
          />
          {/* Cloud  */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Cloud"}
            iconType={"cloud"}
          />
          {/* CMS */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"CMS"}
            iconType={"cms"}
            iconData={iconData}
          />
          {/* Embedded */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Embedded"}
            iconType={"embedded"}
            iconData={iconData}
          />
          {/* Operating Systems */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Operating Systems"}
            iconType={"operatingSystem"}
            iconData={iconData}
          />
          {/* Other */}
          <IconSelector
            handleIconToggle={handleIconToggle}
            title={"Other"}
            iconType={"other"}
            iconData={iconData}
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
