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
  InputContainer,
  DragDropUploadFile,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import { uploadVideoThunk, updateVideoThunk } from "../../features/videoSlice";
import { IMAGE_EXTENTIONS } from "../../constant";

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
    <Container childElemClass="py-10 flex justify-center">
      <form
        onSubmit={handleSubmit(handleVideoSubmit, showFormErrors)}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl"
      >
        <FormHeading title={isEditing ? "Update Video" : "Add New Video"} />
        <FormText text="Fill in the video details below" />

        <div className="space-y-5 mb-5">
          <InputContainer
            type="text"
            placeholder="Video Title"
            {...register("title", { required: "Title is required" })}
          />

          <InputContainer
            type="text"
            placeholder="Description"
            {...register("description", {
              required: "Description is required",
            })}
          />

          <DragDropUploadFile allowedExtensions={IMAGE_EXTENTIONS} />

          <FileInputContainer
            accept=".mp4,.mov.avi.mkv"
            {...register("video", {
              required: !isEditing && "Video file is required",
            })}
          />

          <FileInputContainer {...register("thumbnail")} />

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

export default AddUpdateVideoForm;
