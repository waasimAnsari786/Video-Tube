import React from "react";

const Logo = ({ src, logoClass }) => {
  return (
    <div className="mb-5">
      <img src={src} alt="Logo" className={logoClass} />
    </div>
  );
};

export default Logo;
