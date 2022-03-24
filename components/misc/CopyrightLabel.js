import React from "react";

const CopyrightLabel = () => {
  return (
    <div className={`z-40 flex flex-col px-6`}>
      <p className="mt-auto mb-1 text-xs text-white dark:text-white">
        &copy; 2022 Dan Cranney
      </p>
      <div className="flex mt-1 text-xs text-white dark:text-white">
        <a
          href="https://www.twitter.com/danielcranney"
          rel="noreferrer"
          target="_blank"
          className="flex mr-1.5 text-dark-900 hover:text-white"
        >
          Follow me
        </a>{" "}
        |{" "}
        <a
          href="https://www.buymeacoffee.com/danielcranney"
          rel="noreferrer"
          target="_blank"
          className="flex ml-1.5 text-dark-900 hover:text-white"
        >
          Buy Me a Coffee
        </a>
      </div>
    </div>
  );
};

export default CopyrightLabel;
