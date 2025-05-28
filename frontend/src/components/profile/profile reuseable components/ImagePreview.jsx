import React from "react";

export default function ImagePreview({ preview, customClass = "" }) {
  return (
    <img
      src={preview}
      className={`object-cover w-full ${customClass}`}
      alt="Preview"
    />
  );
}
