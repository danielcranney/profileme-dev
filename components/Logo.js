import React, { useContext } from "react";
import { StateContext } from "../pages/_app";
import Link from "next/link";
import { motion } from "framer-motion";

const Logo = () => {
  const { state, dispatch } = useContext(StateContext);
  return (
    <Link
      href={"/"}
      className={`font-bold tracking-tight mb-0 text-lg sm:text-xl transition-all duration-150 ease-in-out no-underline text-dark-900 dark:text-white`}
    >
      ProfileMe
      <span
        className={`transition-all duration-150 ease-in-out ${
          state.sidebarOpen
            ? "text-brand-alt dark:text-brand"
            : "text-brand-alt dark:text-brand"
        }`}
      >
        .dev
      </span>
    </Link>
  );
};

export default Logo;
