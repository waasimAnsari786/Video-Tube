import React from "react";

const Icon = ({ icon, className, onClick }) => {
  return (
    <span onClick={onClick} className={className}>
      {icon}
    </span>
  );
};

export default Icon;
