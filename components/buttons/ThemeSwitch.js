import React, { useState, useContext, useEffect } from "react";
import { StateContext } from "../../pages/_app";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { state, dispatch } = useContext(StateContext);
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const renderThemeChanger = () => {
    if (!mounted) return null;

    if (currentTheme === "dark") {
      return (
        <svg
          className="w-5 h-5 transition-all duration-150 ease-in-out text-white dark:flex hidden"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-5 h-5 transition-all duration-150 ease-in-out text-white flex dark:hidden"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => {
        setTheme(currentTheme == "dark" ? "light" : "dark");
      }}
      className={`ml-auto w-16 h-9 btn-sm relative ${
        state.sidebarOpen
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
