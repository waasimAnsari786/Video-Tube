import React from "react";

const Row = ({ children, customRowClass = "" }) => {
  return (
    <div className={`grid grid-cols-12 gap-3 ${customRowClass}`}>
      {children}
    </div>
  );
};

export default Row;
