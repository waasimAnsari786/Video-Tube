import React from "react";
import { useSelector } from "react-redux";

const Username = () => {
  const userName = useSelector((state) => state.auth.userName);
  return <p className="text-sm text-gray-600">@{userName}</p>;
};

export default Username;
