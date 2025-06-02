import React from "react";
import { useForm } from "react-hook-form";
import {
  Column,
  FormButton,
  ProfileTitle,
  Row,
  UpdateMedia,
} from "../../index";

export default function UpdateMediaForm() {
  const { register, handleSubmit } = useForm();

  const handleProfileUpdate = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <form onSubmit={handleSubmit(handleProfileUpdate)}>
      <Row>
        <Column customColClass="flex justify-between items-center col-span-12">
          <ProfileTitle title="Avatar" />
          <FormButton
            label="Update Media"
            customClasss="sm:p-2 p-1.5 rounded-sm"
          />
        </Column>
      </Row>

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
    </form>
  );
}
