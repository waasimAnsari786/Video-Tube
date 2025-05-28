import React from "react";
import {
  ImagePreview,
  MediaInput,
  PopUp,
  Row,
  Column,
  Button,
  useFileUpload,
  getProfileAvatarContent,
  useImagePreview,
} from "../../../index";
import { FaEdit } from "react-icons/fa";

export default function UpdateMedia({
  title,
  previewClass = "",
  previewColClass = "",
  registerName,
}) {
  const { fileInputRef, handleUpload } = useFileUpload();

  const { handleImagePreview, imgPreview, getPreview } = useImagePreview();

  let finalPreview = getPreview(title);

  const content = getProfileAvatarContent({
    onUpload: handleUpload,
    onDelete: () => {},
  });

  return (
    <>
      <Row customRowClass="border-b-[1px] border-(--my-border-dark) pb-5">
        {/* Image preview and hidden input */}
        <Column customColClass={previewColClass}>
          <MediaInput
            registerName={registerName}
            ref={fileInputRef}
            onChange={handleImagePreview}
          />
          <ImagePreview
            preview={imgPreview || finalPreview}
            customClass={previewClass}
          />
        </Column>

        {/* Edit popup beside the preview */}
        <Column customColClass="col-span-1 flex items-end">
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
            content={content}
          />
        </Column>
      </Row>
    </>
  );
}
