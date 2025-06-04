import React from "react";
import {
  ImagePreview,
  MediaInput,
  PopUp,
  Row,
  Column,
  Button,
  useFileUpload,
  useImagePreview,
  CustomModal,
  PopupContent,
  openCloseModal,
  ModalContent,
} from "../../../index";
import { FaEdit, FaTrash, FaUpload } from "react-icons/fa";

export default function UpdateMedia({
  title,
  previewClass = "",
  previewColClass = "",
  registerName,
}) {
  const { fileInputRef, handleUpload } = useFileUpload();

  const { handleImagePreview, imgPreview, getPreview } = useImagePreview();

  let finalPreview = getPreview(title);

  const modalIds = { avatar: "avatar-modal", cover: "cover-modal" };

  const editMediaPopupCotent = {
    avatar: [
      new PopupContent(<FaUpload />, "Upload new", handleUpload),
      new PopupContent(<FaTrash />, "Delete Avatar", () => {
        openCloseModal(modalIds[title], "open");
      }),
    ],
    cover: [
      new PopupContent(<FaUpload />, "Upload new", handleUpload),
      new PopupContent(<FaTrash />, "Delete Cover Image", () => {
        openCloseModal(modalIds[title], "open");
      }),
    ],
  };

  const deleteMediaModalContent = {
    avatar: new ModalContent({
      id: modalIds[title],
      body: "Are you sure to delete avatar?",
      confirmText: "Delete",
      onCancel: () => openCloseModal(modalIds[title], "close"),
      onConfirm: () => openCloseModal(modalIds[title], "close"),
      title: "Delete Avatar!",
    }),
    cover: new ModalContent({
      id: modalIds[title],
      body: "Are you sure to delete cover image?",
      confirmText: "Delete",
      onCancel: () => openCloseModal(modalIds[title], "close"),
      onConfirm: () => openCloseModal(modalIds[title], "close"),
      title: "Delete Cover Image!",
    }),
  };

  return (
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
            content={editMediaPopupCotent[title]}
            position="top"
          />
        </Column>
      </Row>

      {/* Include modal once at bottom */}
      <CustomModal
        id={modalIds[title]}
        modalContent={deleteMediaModalContent[title]}
      />
    </>
  );
}
