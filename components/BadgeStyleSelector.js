import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../pages/_app";

export const BadgeStyleSelector = ({
  badgeText,
  handleColorToggle,
  badgeKeyToStyle,
  badgeKeyToHide,
  colorList,
}) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <article className="flex flex-col">
      <button
        onClick={handleColorToggle}
        name={badgeKeyToHide}
        className={`border flex flex-col text-xs font-semibold uppercase border-dark-600 items-start group ${
          state.badges.cardStyle[badgeKeyToHide] ? "bg-dark-700" : "bg-dark-800"
        }`}
      >
        <div className="flex items-center w-full p-3">
          <div
            className={`mr-2 w-5 h-5 bg-[#${state.badges.cardStyle[badgeKeyToStyle]}]`}
          >
            &nbsp;
          </div>
          <span className="flex justify-start text-xs text-white">
            {badgeText}
          </span>
          <div
            className={`flex ml-auto text-xs font-semibold text-white transition-all duration-150 ease-in-out ${
              state.badges.cardStyle[badgeKeyToHide]
                ? "opacity-100"
                : "opacity-50 group-hover:opacity-100"
            }`}
          >
            <svg
              className={`w-4 h-4 mr-2 text-white ${
                state.badges.cardStyle[badgeKeyToHide]
                  ? "opacity-100"
                  : "opacity-50 group-hover:opacity-100"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            Edit
          </div>
        </div>
      </button>

      <div
        className={`gap-x-1.5 gap-y-1.5 border-b border-l border-r border-dark-600 w-full p-3 ${
          state.badges.cardStyle[badgeKeyToHide] ? "flex flex-wrap" : "hidden"
        }`}
      >
        {colorList.map((color) => {
          return (
            <button
              className={`w-5 h-5 ${color.bgColor}`}
              name={badgeKeyToStyle}
              onClick={(e) => {
                dispatch({
                  type: ACTIONS.STYLE_BADGES,
                  payload: {
                    keyToStyle: e.target.name,
                    keyToToggle: badgeKeyToHide,
                    color: color.hex,
                  },
                });
              }}
            ></button>
          );
        })}
      </div>
    </article>
  );
};
