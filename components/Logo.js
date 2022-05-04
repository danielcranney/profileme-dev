import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import Link from "next/link";

const Logo = () => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <Link href={"/"}>
      <a
        className={`mb-0 text-lg sm:text-xl transition-all duration-150 ease-in-out no-underline ${
          state.sidebarOpen
            ? "text-white hover:text-white"
            : "text-dark-900 dark:text-white"
        }`}
      >
        ProfileMe
        <span
          className={`transition-all duration-150 ease-in-out ${
            state.sidebarOpen
              ? "text-dark-700 hover:text-dark-700"
              : "text-brand-alt"
          }`}
        >
          .dev
        </span>
      </a>
    </Link>
  );
};

export default Logo;
