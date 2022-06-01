import React, { useContext } from "react";
import { StateContext } from "../../pages/_app";

const LeaveFeedback = () => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <a
      href="mailto:danielcranney@gmail.com"
      className={`btn-sm md:hover:bg-light-200 ${
        state.sidebarOpen
          ? "bg-dark-900/20 md:bg-light-200/50 hover:bg-dark-900/30 dark:hover:bg-dark-600 dark:bg-dark-700 text-white hover:text-white dark:bg-dark-700-20 md:dark:bg-dark-700"
          : "btn-gray"
      } group`}
    >
      {/* <span
        className={`hidden md:block dark:md:text-dark-300 dark:text-white text-dark-500 md:group-hover:text-dark-700 dark:group-hover:text-white transition-all duration-150 ease-in-out ${
          state.sidebarOpen ? "" : ""
        }`}
      >
        Leave&nbsp;
      </span>{" "}
      <span
        className={`dark:text-dark-300 dark:group-hover:text-white md:text-dark-500 md:group-hover:text-dark-700 transition-all duration-150 ease-in-out ${
          state.sidebarOpen
            ? "text-white dark:group-hover:text-white"
            : "text-dark-500"
        }`}
      >
        Feedback
      </span> */}

      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        ></path>
      </svg>
    </a>
  );
};
export default LeaveFeedback;
