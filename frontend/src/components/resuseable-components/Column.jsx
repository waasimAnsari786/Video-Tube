import React from "react";

const Column = ({ children, customColClass = "" }) => {
  return <div className={customColClass}>{children}</div>;
};

export default Column;
