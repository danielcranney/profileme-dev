import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import { iconData } from "../pages/_app";
import FormLabel from "./forms/FormLabel";
import ExtraSmallTick from "./misc/ExtraSmallTick";

const IconSelector = ({ handleIconToggle, title, iconType }) => {
  const { state } = useContext(StateContext);

  return (
    <article className="flex flex-col flex-1 w-full">
      <FormLabel text={title} icon={"💻"} />
      <div className="flex flex-wrap text-4xl gap-x-2 gap-y-2">
        {iconData[iconType].map((icon, index) => {
          return (
            <button
              key={`${icon.path}`}
              className="relative flex w-auto overflow-visible group"
              alt={`${icon.name}`}
              onClick={() => {
                handleIconToggle(iconType, icon, index);
              }}
            >
              <div className="absolute z-40 hidden px-2 py-2 border w-28 group-hover:flex bg-dark-700 border-dark-600 -bottom-12">
                <p className="mx-auto mb-0 text-xs font-semibold tracking-wide text-white">
                  {icon.name}
                </p>
              </div>
              {state.skills[iconType].includes(icon) ? (
                <div className="absolute top-0 left-0 w-4 h-4 p-0 overflow-hidden text-xs bg-white border-0 rounded-lg">
                  <ExtraSmallTick />
                </div>
              ) : null}
              <i
                className={`${icon.iTag} w-9 h-9 ${
                  state.skills[iconType].includes(icon)
                    ? "colored"
                    : "dark:text-white text-light-300 dark:opacity-30 opacity-100"
                }`}
              ></i>
            </button>
          );
        })}
      </div>
    </article>
  );
};

export default IconSelector;
