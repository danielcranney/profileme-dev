import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const ToggleBadgeElementCheckbox = ({
  badgeType,
  badgeText,
  handleBadgeElementToggle,
  badgeKeyToHide,
}) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <label
      className={`btn-xs btn-gray group rounded-md ${
        !state.socials.github.linkSuffix.length > 0
          ? "opacity-30 hover:cursor-not-allowed pointer-events-none"
          : "opacity-100 hover:cursor-pointer"
      } ${
        state.badges.githubStatsCard[badgeKeyToHide]
          ? "bg-light-200 hover:bg-light-200 text-dark-500 dark:hover:bg-dark-600 dark:bg-dark-600"
          : ""
      }`}
    >
      <input
        type="checkbox"
        name={badgeKeyToHide}
        value={state.badges.githubStatsCard[badgeKeyToHide]}
        onChange={handleBadgeElementToggle}
        className="checkbox-input"
        checked={state.badges.githubStatsCard[badgeKeyToHide]}
      />
      <span
        className={`text-xs transition-all duration-150 ease-in-out ${
          state.badges.githubStatsCard[badgeKeyToHide]
            ? "text-dark-700 group-hover:text-dark-700 dark:group-hover:text-white dark:text-white"
            : "text-dark-500 dark:text-dark-300 group-hover:text-dark-700 dark:group-hover:text-white"
        }`}
      >
        {badgeText}
      </span>
    </label>
  );
};

export default ToggleBadgeElementCheckbox;
