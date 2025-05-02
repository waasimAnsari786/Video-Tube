import React from "react";
import { useSelector } from "react-redux";

export default function Avatar({ width = "w-10", textSize = "text-xl" }) {
  const avatar = useSelector((state) => state.auth.avatar);
  const fullName = useSelector((state) => state.auth.fullName);

  if (avatar && avatar.secureURL) {
    return (
      <div className={`${width} rounded-full`}>
        <img alt="User Avatar" src={avatar.secureURL} />
      </div>
    );
  }

  return (
    <div className="avatar avatar-placeholder">
      <div className={`bg-neutral text-neutral-content ${width} rounded-full`}>
        <span className={textSize}>{fullName?.[0]?.toUpperCase()}</span>
      </div>
    </div>
  );
}
