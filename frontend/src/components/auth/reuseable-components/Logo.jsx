import React from "react";

const Logo = ({ src }) => {
  return (
    <div className="mb-5">
      <img src={src} alt="Logo" className="w-24 h-24 mx-auto" />
    </div>
  );
};

export default Logo;
