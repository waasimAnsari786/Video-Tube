import React from "react";
import {
  ImagePreview,
  MediaInput,
  PopUp,
  Row,
  Column,
  Button,
} from "../../../index";
import { FaEdit } from "react-icons/fa";

export default function UpdateMedia({
  title,
  previewSrc,
  previewClass = "",
  registerName,
  popupContent,
  inputRef,
}) {
  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <Row>
        {/* Image preview and hidden input */}
        <Column customColClass="col-span-2">
          <ImagePreview preview={previewSrc} className={previewClass} />
          <MediaInput registerName={registerName} inputRef={inputRef} />
        </Column>

        {/* Edit popup beside the preview */}
        <Column customColClass="col-span-2 flex items-end">
          <PopUp
            button={
              <Button
                btnText={
                  <>
                    <FaEdit /> Edit
                  </>
                }
              />
            }
            content={popupContent}
          />
        </Column>
      </Row>
    </div>
  );
}
