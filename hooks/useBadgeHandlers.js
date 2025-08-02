import { useContext } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../lib/constants/actions";

export const useBadgeHandlers = () => {
  const { dispatch } = useContext(StateContext);

  const handleBadgeToggle = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_BADGE,
      payload: {
        title: e.target.name,
      },
    });
  };

  const handleBadgeElementToggle = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_GITHUB_STATS,
      payload: {
        keyToHide: e.currentTarget.name,
      },
    });
  };

  const handleStyleBadge = (e) => {
    dispatch({
      type: ACTIONS.TOGGLE_STYLE_COLOR,
      payload: {
        keyToToggle: e.currentTarget.name,
      },
    });
  };

  const handleChangeBadgeColor = (e, badgeKeyToHide, color) => {
    dispatch({
      type: ACTIONS.STYLE_BADGES,
      payload: {
        keyToStyle: e.target.name,
        keyToToggle: badgeKeyToHide,
        color: color.hex,
      },
    });
  };

  return {
    handleBadgeToggle,
    handleBadgeElementToggle,
    handleStyleBadge,
    handleChangeBadgeColor,
  };
};
