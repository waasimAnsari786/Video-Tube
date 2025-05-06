/**
 * This form component has written for updating user "Avatar" and "CoverImage". It expects
 * a prop "media" for choosing that which file it is suppose to update. It selects an
 * action(defined asyncThunk in the "authSlice.js") for making update request by checking
 * "media" prop.
 */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  InputContainer,
  FormButton,
  useImagePreview,
  ImagePreview,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import { toast } from "react-toastify";
import {
  updateAvatarThunk,
  updateCoverImageThunk,
} from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaFile } from "react-icons/fa";

const UpdateUserMediaForm = ({ media }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { setImagePreview } = useImagePreview();

  const handleUpdateMedia = async (data) => {
    const file = data[media]?.[0];

    const formData = new FormData();
    formData.append(media, file);

    const action =
      media === "avatar" ? updateAvatarThunk : updateCoverImageThunk;

    const result = await dispatch(action(formData));

    if (action.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/profile");
    } else {
      toast.error(result.payload || "Update failed");
    }

    reset();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImagePreview(file);
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateMedia, (formErrors) =>
        showFormErrors(formErrors)
      )}
      className="bg-white shadow-2xl rounded-xl p-5 sm:p-10"
    >
      <InputContainer
        type="file"
        icon={<FaFile />}
        {...register(media, { required: `${media} is required` })}
        onChange={handleImageChange}
        accept=".jpg,.jpeg,.png,.webp,.avif"
      />

      <FormButton label={"Update File"} loadingLabel="Updating File..." />
    </form>
  );
};

export default UpdateUserMediaForm;
