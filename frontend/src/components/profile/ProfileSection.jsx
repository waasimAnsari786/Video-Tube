import React from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  ProfileTitle,
  UpdateMedia,
  UpdatePasswordForm,
  UpdateUserDetailsForm,
  Tabs,
} from "../../index";

const ProfileSection = () => {
  const { register, handleSubmit } = useForm();

  const handleProfileUpdate = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate)}>
      <Tabs tabs={["Media", "Details", "Security"]}>
        <div label="Media">
          <Button btnText="Update" />
          <ProfileTitle title="Avatar" />
          <UpdateMedia
            title="avatar"
            previewClass="rounded-xl h-25 sm:h-30"
            registerName={register("avatar")}
            previewColClass="md:col-span-2 sm:col-span-3 col-span-4"
          />
          <ProfileTitle title="Cover Image" />
          <UpdateMedia
            title="cover"
            previewClass="rounded-xl sm:h-40 h-35"
            registerName={register("coverImage")}
            previewColClass="md:col-span-4 sm:col-span-6 col-span-12"
          />
        </div>

        <div label="Details">
          <Button btnText="Update" />
          <ProfileTitle title="Name & Email" />
          <UpdateUserDetailsForm />
        </div>

        <div label="Security">
          <Button btnText="Update" />
          <ProfileTitle title="Password" />
          <UpdatePasswordForm />
        </div>
      </Tabs>
    </form>
  );
};

export default ProfileSection;
