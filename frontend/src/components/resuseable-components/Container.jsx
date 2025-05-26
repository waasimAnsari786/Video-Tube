import React from "react";

export default function Container({
  parentElemClass = "",
  childElemClass = "",
  children,
}) {
  return (
    <div className={parentElemClass}>
      <div className={`container mx-auto px-2 max-w-5xl ${childElemClass}`}>
        {children}
      </div>
    </div>
  );
}
