import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import { FormLabel } from "./FormLabel";

export const BadgeStyleSelector = ({
  badgeType,
  badgeText,
  handleCardStylingClick,
  badgeKeyToHide,
}) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <label className={`border select-none btn-sm bg-dark-800`}>
      <input
        type="checkbox"
        name={badgeKeyToHide}
        value={state.badges.githubStatsCard[badgeKeyToHide]}
        onChange={handleCardStylingClick}
        className="checkbox-input"
        checked={state.badges.githubStatsCard[badgeKeyToHide]}
      />
      <span className="text-xs text-white">{badgeText}</span>
    </label>
  );
};
