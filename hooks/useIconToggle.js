import { useContext } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../lib/constants/actions";

export const useIconToggle = () => {
  const { state, dispatch } = useContext(StateContext);

  const handleIconToggle = (iconCategory, iconObj) => {
    const currentIndex = Object.keys(state.skills).reduce(
      (length, iconCategory) => length + state.skills[iconCategory].length,
      0
    );
    const isIconAlreadySelectedIndex = state.skills[iconCategory].findIndex(
      (item) => item.name === iconObj.name
    );

    if (isIconAlreadySelectedIndex >= 0) {
      dispatch({
        type: ACTIONS.REMOVE_SKILL,
        payload: {
          type: iconCategory,
          icon: iconObj,
        },
      });
    } else {
      dispatch({
        type: ACTIONS.ADD_SKILL,
        payload: {
          type: iconCategory,
          icon: iconObj,
          position: currentIndex,
        },
      });
    }
  };

  const clearAllSkills = () => {
    dispatch({
      type: ACTIONS.CLEAR_ALL_SKILLS,
    });
  };

  return { handleIconToggle, clearAllSkills };
};
