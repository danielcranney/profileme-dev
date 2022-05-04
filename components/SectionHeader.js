import React from "react";

const SectionHeader = ({ header, subhead }) => {
  return (
    <>
      <h3 className="section-header">{header}</h3>
      <p className="section-subhead">{subhead}</p>
    </>
  );
};

export default SectionHeader;
