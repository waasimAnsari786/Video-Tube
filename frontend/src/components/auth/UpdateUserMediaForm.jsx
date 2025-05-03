/**
 * This form component has written for updating user "Avatar" and "CoverImage". It expects
 * a prop "media" for choosing that which file it is suppose to update. It selects an
 * action(defined asyncThunk in the "authSlice.js") for making update request by checking
 * "media" prop.
 */
import React from "react";
import { useForm } from "react-hook-form";
import { InputContainer, FormButton } from "../../index";
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

  const handleUpdateMedia = async (data) => {
    const file = data[media]?.[0];

    const formData = new FormData();
    formData.append(media, file);

    const action =
      media === "avatar" ? updateAvatarThunk : updateCoverImageThunk;

    const result = await dispatch(action(formData));

    if (action.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("profile");
    } else {
      toast.error(result.payload || "Update failed");
    }

    reset();
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
        placeholder="Full Name"
        icon={<FaFile />}
        {...register(media, { required: `${media} is required` })}
      />

      <div className="text-center">
        <FormButton label={"Update File"} loadingLabel="Updating File..." />
      </div>
    </form>
  );
};

export default UpdateUserMediaForm;
