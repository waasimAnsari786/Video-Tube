import React from "react";
import { NavLink } from "react-router-dom";

const Logo = ({ src, logoClass }) => {
  return (
    <NavLink to={"/"}>
      <img src={src} alt="Logo" className={logoClass} />
    </NavLink>
  );
};

export default Logo;
