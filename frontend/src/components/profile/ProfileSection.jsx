import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Container,
  UpdateMedia,
  getProfileAvatarContent,
  useFileUpload,
} from "../../index";

const ProfileSection = () => {
  const { register, handleSubmit } = useForm();
  const avatar = useSelector((state) => state.auth.avatar);

  const { fileInputRef, handleUpload } = useFileUpload();

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  const content = getProfileAvatarContent({
    onUpload: handleUpload,
    onDelete: () => {},
  });

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
          <UpdateMedia
            title="Avatar"
            previewSrc={
              avatar?.secureURL || "/src/assets/man vector avatar.jpg"
            }
            previewClass="rounded-xl h-30 w-40 "
            registerName={register("avatar")}
            popupContent={content}
            inputRef={fileInputRef}
          />
        </form>
      </Container>
    </>
  );
};

export default ProfileSection;
