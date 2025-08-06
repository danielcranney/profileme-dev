import { useState, useContext } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../lib/constants/actions";

export const useSocialDragDrop = () => {
  const { state, dispatch } = useContext(StateContext);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Get ordered socials (either from state.socialOrder or default order)
  const getOrderedSocials = () => {
    const socialOrder = state.socialOrder || Object.keys(state.socials);
    const ordered = socialOrder
      .map((key) => ({ key, data: state.socials[key] }))
      .filter(({ data }) => data.linkSuffix); // Only include socials with links
    return ordered;
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleDragOver = (index) => {
  };

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setIsDragging(false);
      setDraggedIndex(null);
      return;
    }

    // Get the current ordered socials (only those with links)
    const orderedSocials = getOrderedSocials();

    // Find the actual indices in the full social order
    const socialOrder = state.socialOrder || Object.keys(state.socials);
    const allSocials = socialOrder.map((key) => ({
      key,
      data: state.socials[key],
    }));

    // Find the actual indices of the dragged and drop items in the full order
    const draggedSocialKey = orderedSocials[draggedIndex].key;
    const dropSocialKey = orderedSocials[dropIndex].key;

    const draggedFullIndex = allSocials.findIndex(
      ({ key }) => key === draggedSocialKey
    );
    const dropFullIndex = allSocials.findIndex(
      ({ key }) => key === dropSocialKey
    );

    // Create new order
    const newOrder = [...allSocials];
    const draggedSocial = newOrder[draggedFullIndex];
    newOrder.splice(draggedFullIndex, 1); // Remove from original position
    newOrder.splice(dropFullIndex, 0, draggedSocial); // Insert at new position

    // Extract just the keys for the state
    const newSocialOrder = newOrder.map(({ key }) => key);

    // Update state
    dispatch({
      type: ACTIONS.REORDER_SOCIALS,
      payload: {
        socialOrder: newSocialOrder,
      },
    });

    setIsDragging(false);
    setDraggedIndex(null);
  };

  const resetSocialOrder = () => {
    dispatch({
      type: ACTIONS.RESET_SOCIAL_ORDER,
    });
  };

  return {
    draggedIndex,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getOrderedSocials,
    resetSocialOrder,
  };
};
