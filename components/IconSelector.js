import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import FormLabel from "./forms/FormLabel";
import ExtraSmallTick from "./misc/ExtraSmallTick";

const IconSelector = ({ handleIconToggle, title, iconType, iconData }) => {
  const { state } = useContext(StateContext);

  return (
    <article className="flex flex-col flex-1 w-full dark:bg-dark-700 bg-light-100 p-3 rounded-md transition-all duration-150 ease-in-out">
      <div className="mb-2">
        <FormLabel text={title} icon={"💻"} />
      </div>
      <div className="flex flex-wrap text-4xl gap-x-2 gap-y-2">
        {iconData[iconType].map((icon, index) => {
          return (
            <button
              key={`${icon.path}`}
              className={`relative flex w-auto overflow-visible group text-xs border rounded-md items-center justify-center gap-x-1 p-2 ${
                state.skills[iconType].some((item) => item.name === icon.name)
                  ? "border-dark-600 dark:border-dark-400 dark:text-white text-dark-600 dark:bg-dark-600 bg-white"
                  : "border-dark-200 dark:border-dark-800 dark:text-[#9ba1ab] text-[#6f7580]"
              }`}
              alt={`${icon.name}`}
              onClick={() => {
                handleIconToggle(iconType, icon, index);
              }}
            >
              {/* <div className="absolute z-40 hidden px-2 py-2 rounded-md w-28 group-hover:flex dark:bg-dark-600 bg-light-200 -bottom-12 transform -left-7">
                <p className="mx-auto mb-0 text-xs font-semibold tracking-wide text-light-600 dark:text-white">
                  {icon.name}
                </p>
              </div> */}
              {state.skills[iconType].some(
                (item) => item.name === icon.name
              ) ? (
                <div className="absolute top-0 left-0 w-4 h-4 p-0 overflow-hidden text-xs bg-white border-0 rounded-lg z-10">
                  <ExtraSmallTick />
                </div>
              ) : null}

              <i
                className={`${icon.iTag} w-6 h-6 icon-bg ${
                  state.skills[iconType].some((item) => item.name === icon.name)
                    ? "colored"
                    : ""
                }`}
              ></i>

              {icon.name}
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default IconSelector;
