import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";

export default function DraggableSkillIcon({
  skill,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  draggedIndex,
}) {
  const { theme } = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);
  const dragRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.dataTransfer.setData("application/json", JSON.stringify({ index }));
    onDragStart(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
    onDragOver(index);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(index);
  };

  const isBeingDragged = isDragging && draggedIndex === index;

  const handleClick = (e) => {
    if (isBeingDragged) {
      e.preventDefault();
      return;
    }
    // Navigate to the skill link if available
    if (skill?.link) {
      window.open(skill.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        transition-all duration-200 ease-in-out
        ${isBeingDragged ? "opacity-100" : ""}
        ${isDragging && !isBeingDragged ? "opacity-50" : ""}
        ${
          isDragOver
            ? "scale-110 border-2 border-neutral-400 border-dashed"
            : ""
        }
        cursor-move
      `}
      style={{
        transform: isBeingDragged ? "scale(1.1)" : "none",
      }}
    >
      <img
        src={
          skill.darkPath
            ? theme == "dark"
              ? `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored-dark.svg`
              : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg`
            : `https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/${skill.iTag}-colored.svg`
        }
        alt={`${skill.name}`}
        title={`${skill.name} (drag to reorder)`}
        width="36"
        height="36"
        className="select-none pointer-events-none"
      />
    </div>
  );
}
