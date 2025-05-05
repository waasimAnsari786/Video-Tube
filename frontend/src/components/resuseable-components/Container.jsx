import React from "react";

export default function Container({
  parentElemClass = "",
  childElemClass = "",
  children,
}) {
  return (
    <div className={parentElemClass}>
      <div className={`container mx-auto max-w-5xl ${childElemClass}`}>
        {children}
      </div>
    </div>
  );
}
