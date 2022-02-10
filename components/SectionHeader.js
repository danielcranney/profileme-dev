import React from "react";

export default function SectionHeader({ header, subhead }) {
  return (
    <>
      <h3 className="section-header">{header}</h3>
      <p className="section-subhead">{subhead}</p>
    </>
  );
}
