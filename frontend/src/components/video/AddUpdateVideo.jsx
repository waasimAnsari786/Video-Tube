import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  FormHeading,
  FormText,
  FormButton,
  FileInputContainer,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import { uploadVideoThunk, updateVideoThunk } from "../../features/videoSlice";

const VideoForm = ({ isEditing = false, initialData = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.video.loading);

  const { register, reset, handleSubmit } = useForm({
    defaultValues: initialData,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleVideoSubmit = async (data) => {
    try {
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

      const result = await dispatch(
        uploadVideoThunk({
          url: isEditing ? `/videos/${initialData._id}` : "/videos",
          payload: formData,
          config: { headers: { "Content-Type": "multipart/form-data" } },
          method: isEditing ? "patch" : "post",
        })
      );

      if (uploadVideoThunk.fulfilled.match(result)) {
        toast.success(
          result.payload.message ||
            `Video ${isEditing ? "updated" : "uploaded"} successfully`
        );
        navigate("/videos");
      } else {
        toast.error(
          result.payload || `Video ${isEditing ? "update" : "upload"} failed`
        );
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }

    reset();
  };

  return (
    <Container childElemClass="py-10 flex justify-center">
      <form
        onSubmit={handleSubmit(handleVideoSubmit, showFormErrors)}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl"
      >
        <FormHeading title={isEditing ? "Update Video" : "Add New Video"} />
        <FormText text="Fill in the video details below" />

        <div className="space-y-5 mb-5">
          <input
            type="text"
            placeholder="Video Title"
            className="input w-full"
            {...register("title", { required: "Title is required" })}
          />

          <input
            type="text"
            placeholder="Description"
            className="input w-full"
            {...register("description", {
              required: "Description is required",
            })}
          />

          <FileInputContainer
            accept="video/*"
            customClass="w-full"
            {...register("video", {
              required: !isEditing && "Video file is required",
            })}
          />

          <FileInputContainer
            accept="image/*"
            customClass="w-full"
            {...register("thumbnail")}
          />

          <select {...register("videoStatus")} className="input w-full">
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <FormButton
          label={isEditing ? "Update Video" : "Upload Video"}
          loadingLabel={loading ? "Uploading..." : null}
        />
      </form>
    </Container>
  );
};

export default VideoForm;
