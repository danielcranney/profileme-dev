import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const ToggleBadgeButton = ({
  badgeType,
  badgeText,
  profileLink,
  handleBadgeToggle,
}) => {
  const { state } = useContext(StateContext);
  return (
    <label
      className={`btn-md btn-gray group ${
        !state.socials[profileLink].linkSuffix.length > 0
          ? "opacity-30 hover:cursor-not-allowed pointer-events-none"
          : "opacity-100 hover:cursor-pointer"
      } rounded-md ${
        state.badges[badgeType].selected
          ? "bg-brand hover:bg-brand-alt text-white dark:hover:bg-brand-alt dark:bg-brand"
          : ""
      }`}
    >
      <input
        type="checkbox"
        name={badgeType}
        value={state.badges[badgeType].selected}
        onChange={handleBadgeToggle}
        className="checkbox-input"
        checked={state.badges[badgeType].selected}
        disabled={
          !state.socials[profileLink].linkSuffix.length > 0 ? true : false
        }
      />
      <span
        className={`text-xs ${
          state.badges[badgeType].selected
            ? "dark:group-hover:text-white text-white"
            : "text-dark-500 dark:text-dark-300 group-hover:text-dark-700 dark:group-hover:text-white"
        }`}
      >
        {badgeText}
      </span>
    </label>
  );
};

export default ToggleBadgeButton;
