import React from "react";

export default function MediaInput({ registerName, inputRef }) {
  return (
    <input
      type="file"
      accept="image/*"
      {...registerName}
      ref={inputRef}
      style={{ display: "none" }}
    />
  );
}
