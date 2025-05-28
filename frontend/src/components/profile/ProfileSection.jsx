import React from "react";
import { useForm } from "react-hook-form";
import { Button, ProfileTitle, UpdateMedia } from "../../index";

const ProfileSection = () => {
  const { register, handleSubmit } = useForm();

  const handleProfileUpdate = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate)}>
      <Button btnText="Update" />
      <ProfileTitle title={"Avatar"} />
      <UpdateMedia
        title="avatar"
        previewClass="rounded-xl h-30"
        registerName={register("avatar")}
        previewColClass="col-span-2"
      />
      <ProfileTitle title={"Cover Image"} />
      <UpdateMedia
        title="cover"
        previewClass="rounded-xl h-40"
        registerName={register("coverImage")}
        previewColClass="col-span-4"
      />
    </form>
  );
};

export default ProfileSection;
