import React from "react";
import { NavLink } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <nav>
        <ul className="text-white">
          <li>
            <NavLink to={"/"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/login"}>Login</NavLink>
          </li>
          <li>
            <NavLink to={"/register"}>Signup</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
