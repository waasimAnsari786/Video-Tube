import React from "react";

const Username = ({ userName }) => {
  if (!userName) null;
  return <p className="text-sm text-gray-600">@{userName}</p>;
};

export default Username;
