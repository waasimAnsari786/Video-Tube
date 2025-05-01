import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function HomePage() {
  const userData = useSelector((state) => state.auth.user);

  return (
    <>
      <h1>This is Home page</h1>
      {userData?.fullName && <h2>Hello {userData?.fullName}</h2>}
    </>
  );
}
