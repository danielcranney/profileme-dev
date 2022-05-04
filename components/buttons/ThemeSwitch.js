import React from "react";

const ThemeSwitch = ({ currentTheme, sidebarOpen, renderThemeChanger, setTheme }) => {
  return (
    <button
      onClick={() => {
        setTheme(currentTheme == "dark" ? "light" : "dark");
      }}
      className={`ml-auto w-16 h-9 btn-sm relative ${
        sidebarOpen
          ? "bg-dark-900/20 md:bg-light-200/50 dark:bg-dark-700"
          : "bg-light-200/50 dark:bg-dark-700"
      }`}
    >
      <div
        className={`w-7 h-7 bg-brand text-white rounded-md absolute flex items-center justify-center transition-all duration-300 ease-in-out dark:left-[calc(100%-2rem)] left-1`}
      >
        {renderThemeChanger()}
      </div>
    </button>
  );
};

export default ThemeSwitch;
