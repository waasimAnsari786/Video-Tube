import React, { useRef } from "react";
import {
  ImagePreview,
  MediaInput,
  EditMediaButton,
  PopUp,
} from "../../../index";

export default function UpdateMedia({
  title,
  previewSrc,
  previewClass = "",
  registerName,
  popupContent,
}) {
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="inline-block relative">
        <ImagePreview preview={previewSrc} className={previewClass} />
        <MediaInput registerName={registerName} inputRef={inputRef} />
        <PopUp button={<EditMediaButton />} content={popupContent} />
      </div>
    </div>
  );
}
