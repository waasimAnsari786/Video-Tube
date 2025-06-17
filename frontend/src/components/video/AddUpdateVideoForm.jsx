import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FormHeading,
  FormText,
  FormButton,
  InputContainer,
  DragDropUploadFile,
  Row,
  Column,
  ProfileTitle,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import { uploadVideoThunk, updateVideoThunk } from "../../features/videoSlice";
import { IMAGE_EXTENTIONS, VIDEO_EXTENTIONS } from "../../constant";
import { MdOutlineSubtitles, MdOutlineDescription } from "react-icons/md";

const AddUpdateVideoForm = ({ isEditing = false, initialData = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.video.loading);

  const { register, reset, handleSubmit } = useForm({
    defaultValues: initialData,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleVideoSubmit = async (data) => {
    const formData = new FormData();

    for (let key in data) {
      if (key === "video" && data.video?.[0]) {
        formData.append("video", data.video[0]);
      } else if (key === "thumbnail" && data.thumbnail?.[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    const action = isEditing ? updateVideoThunk : uploadVideoThunk;
    const url = isEditing ? `/videos/${initialData._id}` : "/videos";

    const result = await dispatch(
      action({
        url,
        payload: formData,
        config: { headers: { "Content-Type": "multipart/form-data" } },
      })
    );

    if (action.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload);
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleVideoSubmit, showFormErrors)}>
      <Row customRowClass="mb-5">
        <Column customColClass="flex justify-between items-center col-span-12">
          <ProfileTitle title={isEditing ? "Update Video" : "Add New Video"} />

          <FormButton
            label={isEditing ? "Update Video" : "Upload Video"}
            loadingLabel={loading ? "Uploading..." : null}
            customClasss="sm:p-2 p-1.5 rounded-sm"
          />
        </Column>
        <Column customColClass="col-span-6">
          <InputContainer
            type="text"
            placeholder="Video Title"
            icon={<MdOutlineSubtitles />}
            {...register("title", { required: "Title is required" })}
          />
        </Column>

        <Column customColClass="col-span-6">
          <InputContainer
            type="text"
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
            icon={<MdOutlineDescription />}
          />
        </Column>

        <Column customColClass="col-span-6">
          <DragDropUploadFile
            allowedExtensions={IMAGE_EXTENTIONS}
            acceptedMimeType="image/*"
          />
        </Column>
        <Column customColClass="col-span-6">
          <DragDropUploadFile
            allowedExtensions={VIDEO_EXTENTIONS}
            acceptedMimeType="video/*"
          />
        </Column>
      </Row>
      <Column customColClass="mb-5">
        <select {...register("videoStatus")} className="input w-full">
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
      </Column>
    </form>
  );
};

export default AddUpdateVideoForm;
