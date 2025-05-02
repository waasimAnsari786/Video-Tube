import React from "react";
import { useSelector } from "react-redux";

const FullName = () => {
  const fullName = useSelector((state) => state.auth.fullName);
  return <h1 className="text-2xl font-semibold">{fullName}</h1>;
};

export default FullName;
