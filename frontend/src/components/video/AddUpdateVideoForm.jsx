import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FormButton,
  InputContainer,
  DragDropUploadFile,
  Row,
  Column,
  ProfileTitle,
  RadioInputContainer,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import {
  uploadVideoThunk,
  updateVideoThunk,
} from "../../store/slices/videoSlice";
import { IMAGE_EXTENTIONS, VIDEO_EXTENTIONS } from "../../constant";
import { MdOutlineSubtitles, MdOutlineDescription } from "react-icons/md";

const AddUpdateVideoForm = ({ isEditing = false, initialData = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.video.loading);

  const { register, reset, handleSubmit, setValue } = useForm({
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
      <Row>
        <Column customColClass="flex justify-between items-center col-span-12">
          <ProfileTitle title={isEditing ? "Update Video" : "Add New Video"} />

          <FormButton
            label={isEditing ? "Update Video" : "Upload Video"}
            loadingLabel={loading ? "Uploading..." : null}
            customClasss="sm:p-2 p-1.5 rounded-sm"
          />
        </Column>

        <Column customColClass="md:col-span-6 col-span-12">
          <InputContainer
            type="text"
            placeholder="Video Title"
            icon={<MdOutlineSubtitles />}
            {...register("title", { required: "Title is required" })}
            inpMargin="m-0"
          />
        </Column>

        <Column customColClass="md:col-span-6 col-span-12">
          <InputContainer
            type="text"
            placeholder="Description"
            inpMargin="m-0"
            {...register("description", {
              required: "Description is required",
            })}
            icon={<MdOutlineDescription />}
          />
        </Column>
        <Column customColClass="md:col-span-6 col-span-12">
          <DragDropUploadFile
            allowedExtensions={IMAGE_EXTENTIONS}
            acceptedMimeType="image/*"
            maxFiles={9}
          />
        </Column>
        <Column customColClass="md:col-span-6 col-span-12">
          <DragDropUploadFile
            allowedExtensions={VIDEO_EXTENTIONS}
            acceptedMimeType="video/*"
          />
        </Column>
        <Column customColClass="md:col-span-6 col-span-12">
          <RadioInputContainer
            label="Video Status"
            defaultChecked={initialData.videoStatus !== "Private"} // true = checked
            onStatusChange={(value) => setValue("videoStatus", value)}
          />
        </Column>
      </Row>
    </form>
  );
};

export default AddUpdateVideoForm;
