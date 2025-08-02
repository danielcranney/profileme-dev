import React, { useContext, useState } from "react";
import { StateContext } from "../pages/_app";
import { ACTIONS } from "../lib/constants/actions";

const SectionOrderManager = () => {
  const { state, dispatch } = useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const sectionLabels = {
    introduction: "Introduction",
    skills: "Skills",
    socials: "Socials",
    badges: "Badges",
    support: "Support",
  };

  const sectionIcons = {
    introduction: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
        ></path>
      </svg>
    ),
    skills: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        ></path>
      </svg>
    ),
    socials: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        ></path>
      </svg>
    ),
    badges: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        ></path>
      </svg>
    ),
    support: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        ></path>
      </svg>
    ),
  };

  const moveSectionUp = (section) => {
    dispatch({
      type: ACTIONS.MOVE_SECTION_UP,
      payload: { sectionToMove: section },
    });
  };

  const moveSectionDown = (section) => {
    dispatch({
      type: ACTIONS.MOVE_SECTION_DOWN,
      payload: { sectionToMove: section },
    });
  };

  const resetOrder = () => {
    dispatch({
      type: ACTIONS.RESET_SECTION_ORDER,
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e, section) => {
    setDraggedItem(section);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, targetSection) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedItem && draggedItem !== targetSection) {
      setDropTarget(targetSection);
    }
  };

  const handleDrop = (e, targetSection, isDropZone = false) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetSection) {
      const draggedIndex = state.sectionOrder.indexOf(draggedItem);
      const targetIndex = state.sectionOrder.indexOf(targetSection);

      const newOrder = [...state.sectionOrder];
      newOrder.splice(draggedIndex, 1);

      // If dropping on the drop zone (above the section), insert at target index
      // If dropping on the section itself, insert after the target index
      let insertIndex = targetIndex;
      if (!isDropZone) {
        // If dropping on the section itself, insert after it
        insertIndex = targetIndex + 1;
      }

      // Adjust insert index if we're moving the item to a position after itself
      if (draggedIndex < insertIndex) {
        insertIndex -= 1;
      }

      newOrder.splice(insertIndex, 0, draggedItem);

      dispatch({
        type: ACTIONS.REORDER_SECTIONS,
        payload: { newOrder },
      });
    }
    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`btn-sm flex items-center gap-x-2 ${
          isOpen ? "btn-brand" : "btn-gray"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          ></path>
        </svg>
        Reorder Sections
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-700 dark:text-white">
                Reorder Sections
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dark-400 hover:text-dark-700 dark:text-light-300 dark:hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <p className="text-sm text-dark-500 dark:text-light-400 mb-4">
              Drag and drop sections to reorder them, or use the arrow buttons
              below.
            </p>

            <div className="space-y-2 mb-4">
              {state.sectionOrder.map((section, index) => (
                <React.Fragment key={section}>
                  {/* Drop zone indicator */}
                  {dropTarget === section &&
                    draggedItem &&
                    draggedItem !== section && (
                      <div
                        className="h-16 border-2 border-dashed border-brand-400 dark:border-brand-300 bg-brand-50 dark:bg-brand-900/20 rounded-md flex items-center justify-center animate-pulse transition-all duration-300 ease-in-out cursor-pointer"
                        onDragOver={(e) => handleDragOver(e, section)}
                        onDrop={(e) => handleDrop(e, section, true)}
                      >
                        <div className="flex items-center gap-x-2 text-brand-600 dark:text-brand-300">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          <span className="text-sm font-medium">Drop here</span>
                        </div>
                      </div>
                    )}
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, section)}
                    onDragOver={(e) => handleDragOver(e, section)}
                    onDrop={(e) => handleDrop(e, section, false)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between p-3 rounded-md cursor-move transition-all duration-200 ${
                      draggedItem === section
                        ? "bg-brand-100 dark:bg-brand-900 border-2 border-brand-500 opacity-50"
                        : "bg-light-100 dark:bg-dark-600 hover:bg-light-200 dark:hover:bg-dark-500"
                    }`}
                  >
                    <div className="flex items-center gap-x-3">
                      <span className="text-sm font-medium text-dark-500 dark:text-light-400">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-x-2">
                        {sectionIcons[section]}
                        <span className="text-dark-700 dark:text-white">
                          {sectionLabels[section]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-1">
                      <div className="text-dark-400 dark:text-light-500 mr-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 8h16M4 16h16"
                          ></path>
                        </svg>
                      </div>
                      <button
                        onClick={() => moveSectionUp(section)}
                        disabled={index === 0}
                        className={`p-1 rounded ${
                          index === 0
                            ? "text-dark-300 dark:text-dark-500 cursor-not-allowed"
                            : "text-dark-500 hover:text-dark-700 dark:text-light-300 dark:hover:text-white hover:bg-light-200 dark:hover:bg-dark-500"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 15l7-7 7 7"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => moveSectionDown(section)}
                        disabled={index === state.sectionOrder.length - 1}
                        className={`p-1 rounded ${
                          index === state.sectionOrder.length - 1
                            ? "text-dark-300 dark:text-dark-500 cursor-not-allowed"
                            : "text-dark-500 hover:text-dark-700 dark:text-light-300 dark:hover:text-white hover:bg-light-200 dark:hover:bg-dark-500"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="flex gap-x-2">
              <button onClick={resetOrder} className="btn-gray btn-sm flex-1">
                Reset to Default
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-brand btn-sm flex-1"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SectionOrderManager;
