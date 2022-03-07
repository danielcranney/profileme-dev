import React from "react";

export const CopyrightLabel = () => {
  return (
    <div className={`z-40 flex flex-col`}>
      <p className="mt-auto mb-1 text-xs">&copy; 2022 Dan Cranney</p>
      <a
        href="https://www.buymeacoffee.com/danielcranney"
        rel="noreferrer"
        target="_blank"
        className="flex mb-0 text-xs"
      >
        Buy Me a Coffee
      </a>
    </div>
  );
};
