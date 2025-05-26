import React from "react";

const Column = ({ children, customColClass = "", ...props }) => {
  return (
    <div className={customColClass} {...props}>
      {children}
    </div>
  );
};

export default Column;
