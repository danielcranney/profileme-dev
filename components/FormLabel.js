import React from "react";

const FormLabel = ({ text, icon }) => {
  return (
    <label className="form-label">
      <span className="flex items-center mr-2 text-lg">{icon}</span>
      {text}
    </label>
  );
};

export default FormLabel;
