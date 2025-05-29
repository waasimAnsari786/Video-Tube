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
  CustomModal,
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
    onDelete: () => {
      console.log(document.getElementById("custom_modal"));

      document.getElementById("custom_modal")?.showModal();
    },
  });

  return (
    // <>
    //   <Row customRowClass="border-b-[1px] border-(--my-border-dark) pb-5">
    //     {/* Image preview and hidden input */}
    //     <Column customColClass={previewColClass}>
    //       <MediaInput
    //         registerName={registerName}
    //         ref={fileInputRef}
    //         onChange={handleImagePreview}
    //       />
    //       <ImagePreview
    //         preview={imgPreview || finalPreview}
    //         customClass={previewClass}
    //       />
    //     </Column>

    //     {/* Edit popup beside the preview */}
    //     <Column customColClass="col-span-1 flex items-end">
    //       <PopUp
    //         button={
    //           <Button
    //             btnText={
    //               <>
    //                 <FaEdit /> Edit
    //               </>
    //             }
    //           />
    //         }
    //         content={content}
    //       />
    //     </Column>
    //   </Row>
    // </>

    <>
      {/* Your existing layout */}
      <Row customRowClass="border-b-[1px] border-(--my-border-dark) pb-5">
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
            content={getProfileAvatarContent({
              onUpload: handleUpload,
              onDelete: () => {
                document.getElementById("custom_modal")?.showModal();
              },
            })}
          />
        </Column>
      </Row>

      {/* Include modal once at bottom */}
      <CustomModal id="custom_modal" modalTitle="Delete Avatar?">
        <p className="text-sm">Are you sure you want to delete your avatar?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => document.getElementById("custom_modal")?.close()}
          >
            Cancel
          </button>
          <button
            className="btn btn-error btn-sm"
            onClick={() => {
              // Perform delete here
              console.log("Avatar deleted");
              document.getElementById("custom_modal")?.close();
            }}
          >
            Delete
          </button>
        </div>
      </CustomModal>
    </>
  );
}
