import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Container } from "../../index";
import { FaEdit, FaUpload, FaTrash } from "react-icons/fa";

const ProfileSection = () => {
  const { register, handleSubmit } = useForm();
  const avatar = useSelector((state) => state.auth.avatar);
  const fileInputRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
    setIsDropdownOpen(false); // close dropdown after choosing file
  };

  const handleDeleteAvatar = () => {
    // Your logic to delete avatar (e.g., dispatch an action)
    console.log("Delete avatar triggered");
    setIsDropdownOpen(false);
  };

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <h2 className="text-xl font-bold mb-4">Avatar</h2>

        <div className="inline-block relative">
          <img
            className="w-30 h-30 object-cover rounded-full"
            src={avatar?.secureURL || "/src/assets/man vector avatar.jpg"}
            alt="User Avatar"
          />

          <input
            type="file"
            accept="image/*"
            {...register("avatar")}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <div className="dropdown dropdown-end text-gray-400">
            <div tabIndex={0} role="button" className="btn">
              Edit
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li
                className="rounded hover:bg-blue-900 p-2 hover:text-white cursor-pointer"
                onClick={handleAvatarClick}
              >
                Upload new
              </li>
              <li
                className="rounded hover:bg-blue-900 p-2 hover:text-white cursor-pointer"
                onClick={handleDeleteAvatar}
              >
                Delete avatar
              </li>
            </ul>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default ProfileSection;
