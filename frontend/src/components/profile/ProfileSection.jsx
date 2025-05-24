import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Container, UpdateMedia } from "../../index";
import { getProfileAvatarContent } from "../../data/PopUpData";
import useFileUpload from "../../hooks/useFileUpload";

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
            previewClass="w-30 h-30 rounded-full"
            registerName={register("avatar")}
            popupContent={getProfileAvatarContent({
              onUpload: () => inputRef.current?.click(),
              onDelete: () => console.log("Delete triggered"),
            })}
          />
        </form>
      </Container>
    </>
  );
};

export default ProfileSection;
