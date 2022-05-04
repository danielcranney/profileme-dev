import React from "react";

const Logo = ({ sidebarOpen }) => {
  return (
    <h1
      className={`mb-0 text-lg sm:text-xl transition-all duration-150 ease-in-out ${
        sidebarOpen ? "text-white" : "text-dark-900 dark:text-white"
      }`}
    >
      ProfileMe
      <span
        className={`transition-all duration-150 ease-in-out ${
          sidebarOpen ? "text-dark-700" : "text-brand-alt"
        }`}
      >
        .dev
      </span>
    </h1>
  );
};

export default Logo;
