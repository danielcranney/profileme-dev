import React, { useContext } from "react";
import { StateContext } from "../pages/_app";

export const BadgeShowSelector = ({
  badgeText,
  handleBadgeShowClick,
  badgeKeyToHide,
}) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <label
      className={`border select-none btn-sm bg-dark-800 hover:bg-dark-700`}
    >
      <input
        type="checkbox"
        name={badgeKeyToHide}
        value={state.badges.githubStatsCard[badgeKeyToHide]}
        onChange={handleBadgeShowClick}
        className="checkbox-input"
        checked={state.badges.githubStatsCard[badgeKeyToHide]}
      />
      <span className="text-xs text-white">{badgeText}</span>
    </label>
  );
};
