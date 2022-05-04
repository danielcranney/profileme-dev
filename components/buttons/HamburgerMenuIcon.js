import React from "react";
const HamburgerMenuIcon = ({ sidebarOpen, handleSidebarToggle }) => {
  return (
    <button
      className={`btn-square ${
        sidebarOpen ? "bg-dark-900/0 text-white hover:text-white" : "btn-trans"
      }`}
      onClick={handleSidebarToggle}
    >
      <svg
        className={`w-6 h-6`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        ></path>
      </svg>
    </button>
  );
};
export default HamburgerMenuIcon;
