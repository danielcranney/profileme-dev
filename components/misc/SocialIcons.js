import React from "react";
import XIcon from "./XIcon";
import GitHubIcon from "./GitHubIcon";

export const SocialIcons = () => {
  return (
    <div className="flex items-center gap-x-1.5">
      <GitHubIcon />
      <XIcon />
    </div>
  );
};
