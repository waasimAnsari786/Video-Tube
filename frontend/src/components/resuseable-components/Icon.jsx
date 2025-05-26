import React from "react";

const Icon = ({ icon, className, onClick }) => {
  console.log(onclick);

  return (
    <span
      onClick={onClick}
      className={`${onclick ? "cursor-pointer" : ""} ${className}`}
    >
      {icon}
    </span>
  );
};

export default Icon;
