import React from "react";

const Email = ({ email }) => {
  if (!email) null;
  return <p className="text-sm text-gray-600">{email}</p>;
};

export default Email;
