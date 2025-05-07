import React from "react";

const FullName = ({ fullName }) => {
  if (!fullName) null;
  return <h1 className="text-2xl font-semibold">{fullName}</h1>;
};

export default FullName;
