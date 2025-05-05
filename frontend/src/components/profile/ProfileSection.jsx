import React from "react";
import {
  Avatar,
  CoverImage,
  FullName,
  Email,
  Username,
  Container,
} from "../../index";

const ProfileSection = () => {
  return (
    <Container>
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
    </Container>
  );
};

export default ProfileSection;
