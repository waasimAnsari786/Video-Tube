import React from "react";
import { Avatar, CoverImage, FullName, Email, Username } from "../../index"; // Already implemented

const ProfileSection = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Banner image */}
      <div className="relative">
        <CoverImage />

        {/* Avatar */}
        <div className="absolute bottom-[-40px] left-6">
          <Avatar width="w-24" textSize="text-6xl" />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-16 px-6 text-white">
        <FullName />
        <Email />
        <Username />
      </div>
    </div>
  );
};

export default ProfileSection;
