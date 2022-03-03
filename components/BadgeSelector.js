import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import { FormLabel } from "./FormLabel";

export const BadgeSelector = ({
  badgeType,
  badgeText,
  profileLink,
  handleBadgeClick,
}) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <label
      className={`py-3 w-full flex uppercase font-semibold border-0 group select-none border-b border-dark-600 ${
        !state.socials[profileLink].linkSuffix.length > 0
          ? "opacity-30 hover:cursor-not-allowed"
          : "opacity-100 hover:cursor-pointer "
      }`}
    >
      <input
        type="checkbox"
        name={badgeType}
        value={state.badges[badgeType].selected}
        onChange={handleBadgeClick}
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
