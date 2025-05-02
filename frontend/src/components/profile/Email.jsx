import React from "react";
import { useSelector } from "react-redux";

const Email = () => {
  const email = useSelector((state) => state.auth.email);
  return <p className="text-sm text-gray-600">{email}</p>;
};

export default Email;
