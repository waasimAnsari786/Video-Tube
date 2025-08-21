import React from "react";
import { Avatar, useImagePreview } from "../../../index"; // Adjust the path as needed
import { useSelector } from "react-redux";

export default function SidebarAvatarButton() {
  const fullName = useSelector((state) => state.auth.fullName);
  const email = useSelector((state) => state.auth.email);
  const google = useSelector((state) => state.auth.google);
  const { getPreview } = useImagePreview();
  const avatar = getPreview("avatar");

  return (
    <div className="flex items-center gap-2 p-2">
      <Avatar avatar={avatar} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {fullName || google.gooName}
        </span>
        <span className="text-xs text-gray-500">
          {email || google.gooEmail}
        </span>
      </div>
    </div>
  );
}
