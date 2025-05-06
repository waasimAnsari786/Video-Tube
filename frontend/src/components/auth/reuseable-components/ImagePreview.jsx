import React from "react";

export default function ImagePreview({ preview }) {
  return (
    <img src={preview} className="rounded-2xl my-2 w-25 h-25 object-cover" />
  );
}
