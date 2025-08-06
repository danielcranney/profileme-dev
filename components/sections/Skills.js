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
          <div className="flex justify-end mb-4">
            <button
              onClick={clearAllSkills}
              className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          {SKILL_CATEGORIES.map((category) => (
            <IconSelector
              key={category.name}
              handleIconToggle={handleIconToggle}
              title={category.label}
              iconType={category.name}
              iconData={iconData}
            />
          ))}
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
