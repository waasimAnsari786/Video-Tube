import React from "react";
import { NavLink } from "react-router-dom";

const Logo = ({ logoClass }) => {
  return (
    <NavLink to={"/"}>
      <img src="/images/logo.png" alt="Logo" className={logoClass} />
    </NavLink>
  );
};

export default Logo;
