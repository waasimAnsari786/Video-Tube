import React from "react";
import { useSelector } from "react-redux";

const CoverImage = () => {
  const coverImage = useSelector((state) => state.auth.coverImage);

  if (!coverImage?.secureURL) return null;

  return (
    <img
      src={coverImage.secureURL}
      alt="Banner"
      className="w-full h-64 object-cover rounded-b-xl shadow-md"
    />
  );
};

export default CoverImage;
