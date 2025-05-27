import React from "react";

export default function ImagePreview({ preview, className = "" }) {
  return (
    <img src={preview} className={`object-cover ${className}`} alt="Preview" />
  );
}
