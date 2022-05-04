import React from "react";

export const MicroButton = ({ buttonStyle, text }) => {
  return <button className={`${buttonStyle}`}>{text}</button>;
};
