import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const StyleBadgeButton = ({
  badgeText,
  handleStyleBadge,
  badgeKeyToStyle,
  badgeKeyToHide,
  colorList,
  badgesShowing,
  handleChangeBadgeColor,
}) => {
  const { state } = useContext(StateContext);
  return (
    <article className={`flex flex-col`}>
      <button
        onClick={handleStyleBadge}
        name={badgeKeyToHide}
        disabled={!badgesShowing ? true : false}
        className={`btn-sm btn-gray items-start group ${
          !badgesShowing
            ? "hover:cursor-not-allowed opacity-30 pointer-events-none"
            : ""
        } ${
          state.badges.cardStyle[badgeKeyToHide]
            ? "bg-light-200 dark:bg-dark-700"
            : "bg-light-200/50 dark:bg-dark-700"
        }`}
      >
        <div className="flex items-center w-full group">
          <div
            className={`rounded-sm mr-2 w-5 h-5 bg-[#${state.badges.cardStyle[badgeKeyToStyle]}]`}
          >
            &nbsp;
          </div>
          <span
            className={`flex justify-start text-xs transition-all duration-150 ease-in-out ${
              state.badges.cardStyle[badgeKeyToHide]
                ? "text-dark-700 dark:text-white"
                : "text-dark-500 group-hover:text-dark-700 dark:text-dark-300 dark:group-hover:text-white"
            }`}
          >
            {badgeText}
          </span>
          <div
            className={`flex ml-auto text-xs font-semibold text-white transition-all duration-150 ease-in-out ${
              state.badges.cardStyle[badgeKeyToHide]
                ? "text-dark-700 dark:text-white opacity-100"
                : "text-dark-500 group-hover:text-dark-700 dark:text-dark-300 dark:group-hover:text-white opacity-50"
            } ${badgesShowing ? "group-hover:opacity-100" : ""}`}
          >
            <svg
              className={`w-4 h-4 mr-2 text-white ${
                state.badges.cardStyle[badgeKeyToHide]
                  ? "text-dark-700 dark:text-white opacity-100"
                  : "text-dark-500 group-hover:text-dark-700 dark:text-dark-300 dark:group-hover:text-white opacity-50"
              } ${badgesShowing ? "group-hover:opacity-100" : ""}`}
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
        className={`gap-x-1.5 gap-y-1.5 border-b border-l border-r dark:border-dark-700 border-light-200 w-full p-4 transition-all duration-150 ease-in-out rounded-bl-md rounded-br-md ${
          state.badges.cardStyle[badgeKeyToHide] ? "flex flex-wrap" : "hidden"
        }`}
      >
        {colorList.map((color) => {
          return (
            <button
              key={color.hex}
              className={`w-5 h-5 border border-light-200 dark:border-dark-700 rounded-sm overflow-hidden ${color.bgColor}`}
              name={badgeKeyToStyle}
              onClick={(e) => {
                handleChangeBadgeColor(e, badgeKeyToHide, color);
              }}
            ></button>
          );
        })}
      </div>
    </article>
  );
};

export default StyleBadgeButton;
