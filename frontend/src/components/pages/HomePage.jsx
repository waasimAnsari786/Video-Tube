import React from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
  const fullName = useSelector((state) => state.auth.fullName);

  return (
    <>
      <h1>This is Home page</h1>
      {fullName && <h2>Hello {fullName}</h2>}
    </>
  );
}
