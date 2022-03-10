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
      className={`py-3 w-full flex uppercase font-semibold group select-none border border-dark-600 px-2 ${
        !state.socials[profileLink].linkSuffix.length > 0
          ? "opacity-30 hover:cursor-not-allowed"
          : "opacity-100 hover:cursor-pointer"
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
      <span className="text-xs text-white">{badgeText}</span>
    </label>
  );
};

export default ToggleBadgeButton;
