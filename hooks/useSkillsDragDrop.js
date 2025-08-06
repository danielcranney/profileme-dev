import { useState, useContext } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../lib/constants/actions";

export const useSkillsDragDrop = () => {
  const { state, dispatch } = useContext(StateContext);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const getOrderedSkills = () => {
    // Get all skills from all categories
    const allSkills = Object.values(state.skills).flat();

    // If we have a custom order, use it to reorder the skills
    if (state.skillsOrder && state.skillsOrder.length > 0) {
      // Create a map of skill IDs to their positions in the custom order
      const orderMap = new Map();
      state.skillsOrder.forEach((skillId, index) => {
        orderMap.set(skillId, index);
      });

      // Sort skills based on the custom order
      return allSkills.sort((a, b) => {
        const aOrder = orderMap.has(a.path) ? orderMap.get(a.path) : Infinity;
        const bOrder = orderMap.has(b.path) ? orderMap.get(b.path) : Infinity;
        return aOrder - bOrder;
      });
    }

    // If no custom order, return skills in their natural order
    return allSkills;
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

    // Get the current ordered skills
    const orderedSkills = getOrderedSkills();

    // Create new order by reordering the skills
    const newOrder = [...orderedSkills];
    const draggedSkill = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1); // Remove from original position
    newOrder.splice(dropIndex, 0, draggedSkill); // Insert at new position

    // Extract skill IDs for the state (using path as unique identifier)
    const newSkillsOrder = newOrder.map((skill) => skill.path);

    // Update state
    dispatch({
      type: ACTIONS.REORDER_SKILLS,
      payload: {
        skillsOrder: newSkillsOrder,
      },
    });

    setIsDragging(false);
    setDraggedIndex(null);
  };

  const resetSkillsOrder = () => {
    dispatch({
      type: ACTIONS.RESET_SKILLS_ORDER,
    });
  };

  return {
    draggedIndex,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getOrderedSkills,
    resetSkillsOrder,
  };
};
