import React from "react";
import { iconData } from "../../lib/data/iconData";
import { SKILL_CATEGORIES } from "../../lib/constants/skillCategories";
import NextSection from "../buttons/NextSection";
import PreviousSection from "../buttons/PreviousSection";
import IconSelector from "../IconSelector";
import SectionHeader from "../SectionHeader";

const Skills = React.forwardRef(({ handleIconToggle, clearAllSkills }, ref) => {
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
          {SKILL_CATEGORIES.map((category) => (
            <IconSelector
              key={category.name}
              handleIconToggle={handleIconToggle}
              title={category.label}
              iconType={category.name}
              iconData={iconData}
            />
          ))}
          <div className="flex justify-center mt-6">
            <button
              onClick={clearAllSkills}
              className="btn-sm btn-gray-outline mr-auto flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 mx-auto"
            >
              Clear All Skills
            </button>
          </div>
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
