import React from "react";

export default function ImagePreview({ preview, className = "" }) {
  return (
    <img
      src={preview}
      className={`my-2 object-cover ${className}`}
      alt="Preview"
    />
  );
}
