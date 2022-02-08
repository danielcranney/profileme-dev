import React from "react";

export const FormLabel = ({ text, icon }) => {
  return (
    <label className="form-label">
      {icon}
      {text}
    </label>
  );
};
