import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import { iconData } from "../pages/_app";
import { FormLabel } from "./FormLabel";
import { ExtraSmallTick } from "./ExtraSmallTick";

export const IconSelector = ({ handleIconToggle, title, iconType }) => {
  const { state, dispatch } = useContext(StateContext);

  return (
    <article className="flex flex-col flex-1 w-full">
      <FormLabel text={title} icon={"💻"} />
      <div className="flex flex-wrap p-4 text-4xl border rounded-sm gap-x-2 gap-y-2 border-dark-600">
        {iconData[iconType].map((icon, index) => {
          return (
            <button
              key={`${icon.type}`}
              className="relative flex w-auto group"
              alt={`${icon.name}`}
              onClick={() => {
                handleIconToggle(iconType, icon, index);
              }}
            >
              <div className="absolute z-40 hidden h-10 p-3 border min-w-48 group-hover:flex bg-dark-700 border-dark-600 -bottom-12">
                <p className="mb-0 text-xs font-semibold tracking-wide text-white uppercase">
                  {icon.name}
                </p>
              </div>
              {state.skills[iconType].includes(icon) ? (
                <div className="absolute top-0 left-0 w-4 h-4 p-0 overflow-hidden text-xs bg-white border-0 rounded-lg">
                  <ExtraSmallTick />
                </div>
              ) : null}
              <i
                className={`devicon-${icon.iTag} ${
                  state.skills[iconType].includes(icon)
                    ? "colored"
                    : "text-white opacity-30"
                }`}
              ></i>
            </button>
          );
        })}
      </div>
    </article>
  );
};
