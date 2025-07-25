import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormButton } from "../../index";
import {
  deleteAvatarThunk,
  deleteCoverImageThunk,
} from "../../store/slices/authSlice";

const DeleteMedia = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatar = useSelector((state) => state.auth.avatar);
  const coverImage = useSelector((state) => state.auth.coverImage);

  const avatarConfig = {
    url: "/users/me/avatar",
    config: {
      data: {
        fieldName: "avatar",
        filePublicId: avatar?.publicId,
      },
    },
  };
  const coverConfig = {
    url: "/users/me/cover",
    config: {
      data: {
        fieldName: "coverImage",
        filePublicId: coverImage?.publicId,
      },
    },
  };

  const handleDeleteAvatar = async () => {
    if (avatar?.publicId) {
      const result = await dispatch(deleteAvatarThunk(avatarConfig));

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
      const result = await dispatch(deleteCoverImageThunk(coverConfig));

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
