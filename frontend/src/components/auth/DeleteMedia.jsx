import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormButton } from "../../index";
import {
  deleteAvatarThunk,
  deleteCoverImageThunk,
} from "../../features/authSlice";

const DeleteMedia = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatar = useSelector((state) => state.auth.avatar);
  const coverImage = useSelector((state) => state.auth.coverImage);

  const handleDeleteAvatar = async () => {
    if (avatar?.publicId) {
      const result = await dispatch(
        deleteAvatarThunk({
          fieldName: "avatar",
          filePublicId: avatar?.publicId,
        })
      );

      if (deleteAvatarThunk.fulfilled.match(result)) {
        toast.success(result.payload.message);
        navigate("/profile");
      } else {
        toast.error(result.payload || "Failed to delete avatar");
      }
    }
  };

  const handleDeleteCoverImage = async () => {
    if (coverImage?.publicId) {
      const result = await dispatch(
        deleteCoverImageThunk({
          fieldName: "coverImage",
          filePublicId: coverImage?.publicId,
        })
      );

      if (deleteCoverImageThunk.fulfilled.match(result)) {
        toast.success(result.payload.message);
        navigate("/profile");
      } else {
        toast.error(result.payload || "Failed to delete cover image");
      }
    }
  };

  return (
    <div className="space-y-4 flex flex-col">
      <FormButton
        label="Delete Avatar"
        loadingLabel="Deleting Avatar..."
        onClick={handleDeleteAvatar}
      />
      <FormButton
        label="Delete Cover Image"
        loadingLabel="Deleting Cover..."
        onClick={handleDeleteCoverImage}
      />
    </div>
  );
};

export default DeleteMedia;
