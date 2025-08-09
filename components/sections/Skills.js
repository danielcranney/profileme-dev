import React, { useState, useContext } from "react";
import { iconData } from "../../lib/data/iconData";
import { SKILL_CATEGORIES } from "../../lib/constants/skillCategories";
import NextSection from "../buttons/NextSection";
import PreviousSection from "../buttons/PreviousSection";
import IconSelector from "../IconSelector";
import SectionHeader from "../SectionHeader";
import { StateContext } from "../../pages/_app";
import ExtraSmallTick from "../misc/ExtraSmallTick";

const Skills = React.forwardRef(({ handleIconToggle, clearAllSkills }, ref) => {
  const { state } = useContext(StateContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Handle escape key to clear search
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && searchQuery) {
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchQuery]);
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
          <article className="flex flex-col gap-y-0">
            {/* Search Bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for skills (e.g., React, Python, Docker...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10 pr-4 w-full"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400 dark:text-dark-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400 dark:text-dark-400 hover:text-dark-600 dark:hover:text-dark-200"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  // Trigger search - results will show if there's text in the input
                }}
                className="btn-sm btn-gray-outline"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-dark-700 dark:text-white">
                    Search Results for &quot;{searchQuery}&quot;
                  </h4>
                  <span className="text-xs text-dark-500 dark:text-dark-400">
                    {
                      SKILL_CATEGORIES.flatMap((category) =>
                        iconData[category.name].filter((icon) =>
                          icon.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        )
                      ).length
                    }{" "}
                    results
                  </span>
                </div>

                {SKILL_CATEGORIES.map((category) => {
                  const matchingIcons = iconData[category.name].filter((icon) =>
                    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (matchingIcons.length === 0) return null;

                  return (
                    <div key={category.name} className="mb-4">
                      <h5 className="text-xs font-medium text-dark-600 dark:text-dark-300 mb-2 uppercase tracking-wide">
                        {category.label}
                      </h5>
                      <div className="flex flex-wrap gap-x-2 gap-y-2">
                        {matchingIcons.map((icon, index) => (
                          <button
                            key={`${category.name}-${icon.path}`}
                            className={`relative flex w-auto overflow-visible group text-xs border rounded-md items-center justify-center gap-x-1 p-2 ${
                              state.skills[category.name].some(
                                (item) => item.name === icon.name
                              )
                                ? "border-dark-600 dark:border-dark-400 dark:text-white text-dark-600 dark:bg-dark-600 bg-white"
                                : "border-dark-200 dark:border-dark-800 dark:text-[#9ba1ab] text-[#6f7580]"
                            }`}
                            onClick={() => {
                              handleIconToggle(category.name, icon, index);
                            }}
                          >
                            {state.skills[category.name].some(
                              (item) => item.name === icon.name
                            ) ? (
                              <div className="absolute top-0 left-0 w-4 h-4 p-0 overflow-hidden text-xs bg-white border-0 rounded-lg z-10">
                                <ExtraSmallTick />
                              </div>
                            ) : null}
                            <i
                              className={`${icon.iTag} w-6 h-6 icon-bg ${
                                state.skills[category.name].some(
                                  (item) => item.name === icon.name
                                )
                                  ? "colored"
                                  : ""
                              }`}
                            ></i>
                            <span className="text-xs">{icon.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {SKILL_CATEGORIES.flatMap((category) =>
                  iconData[category.name].filter((icon) =>
                    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                ).length === 0 && (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-dark-300 dark:text-dark-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm text-dark-500 dark:text-dark-400">
                      No skills found matching &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Regular Category View */}
            {(!searchQuery || !showSearch) && (
              <>
                {/* Show selected skills count */}
                {(() => {
                  const totalSelected = Object.values(state.skills).flat()
                    .length;
                  return totalSelected > 0 ? (
                    <div className="mb-4 px-3 py-0 bg-light-50 dark:bg-dark-800 rounded-md border border-light-200 dark:border-dark-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-dark-700 dark:text-white">
                          Selected Skills: {totalSelected}
                        </span>
                        <button
                          onClick={clearAllSkills}
                          className="btn-sm btn-gray-outline border-0"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  ) : null;
                })()}
                <article className="flex flex-col gap-y-6">
                  {SKILL_CATEGORIES.map((category) => (
                    <IconSelector
                      key={category.name}
                      handleIconToggle={handleIconToggle}
                      title={category.label}
                      iconType={category.name}
                      iconData={iconData}
                    />
                  ))}
                </article>
              </>
            )}
          </article>
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
