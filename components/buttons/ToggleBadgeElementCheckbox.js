import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const ToggleBadgeElementCheckbox = ({
  badgeText,
  handleBadgeElementToggle,
  badgeKeyToHide,
}) => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <label
      className={`border select-none flex items-center px-2 py-2 text-xs font-semibold border-dark-600 transition-all duration-150 ease-in-out bg-dark-800 hover:bg-dark-700`}
    >
      <input
        type="checkbox"
        name={badgeKeyToHide}
        value={state.badges.githubStatsCard[badgeKeyToHide]}
        onChange={handleBadgeElementToggle}
        className="checkbox-input"
        checked={state.badges.githubStatsCard[badgeKeyToHide]}
      />
      <span className="text-xs text-white">{badgeText}</span>
    </label>
  );
};

export default ToggleBadgeElementCheckbox;
