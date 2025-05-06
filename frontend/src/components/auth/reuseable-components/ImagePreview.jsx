import React from "react";
import { useImagePreview } from "../../../index";

export default function ImagePreview() {
  const { imgPreview } = useImagePreview();
  return (
    imgPreview && (
      <img
        src={imgPreview}
        className="rounded-2xl my-2 w-25 h-25 object-cover"
      />
    )
  );
}
