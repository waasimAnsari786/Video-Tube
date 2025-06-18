import React, { useState } from "react";
import { useSelector } from "react-redux";
import avatarPlaceholder from "../assets/man vector avatar.jpg";
import bannerPlaceholder from "../assets/banner-placeholder.jpg";

export default function useImagePreview() {
  const [imgPreview, setImgPreview] = useState([]);

  const avatar = useSelector((state) => state.auth.avatar);
  const coverImage = useSelector((state) => state.auth.coverImage);

  const handleImagePreview = (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setImgPreview(previews);
  };

  const previews = {
    avatar: avatar?.secureURL || avatarPlaceholder,
    cover: coverImage?.secureURL || bannerPlaceholder,
  };

  const getPreview = (key) => previews[key];

  return { imgPreview, handleImagePreview, getPreview };
}
