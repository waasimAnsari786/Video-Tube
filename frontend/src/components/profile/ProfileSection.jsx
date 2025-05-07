import React from "react";
import {
  Avatar,
  CoverImage,
  FullName,
  Email,
  Username,
  Container,
} from "../../index";
import { useSelector } from "react-redux";

const ProfileSection = () => {
  const fullName = useSelector((state) => state.auth.fullName);
  const email = useSelector((state) => state.auth.email);
  const userName = useSelector((state) => state.auth.userName);
  const coverImage = useSelector((state) => state.auth.coverImage);
  const avatar = useSelector((state) => state.auth.avatar);

  return (
    <Container>
      {/* Banner image */}
      <div className="relative">
        <CoverImage coverImage={coverImage?.secureURL} />

        {/* Avatar */}
        <div className="absolute bottom-[-40px] left-6">
          <Avatar
            width="w-24"
            avatar={avatar?.secureURL || "./src/assets/man vector avatar.jpg"}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-16 px-6 text-white">
        <FullName fullName={fullName} />
        <Email email={email} />
        <Username userName={userName} />
      </div>
    </Container>
  );
};

export default ProfileSection;
