import React from "react";
import {
  PopUp,
  PopupContent,
  SidebarAvatarButton,
  useRoute,
} from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaUser, FaYoutube } from "react-icons/fa";

export default function SideBarAvatar() {
  const userName = useSelector((state) => state.auth.userName);

  const { handleRoute } = useRoute();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await dispatch(
      logoutThunk({
        url: "/users/me/logout",
        payload: {},
        config: {},
      })
    );
    if (logoutThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
    } else {
      toast.error(result.payload || "Logout failed");
    }
  };

  const sidebarAvatarPopupContent = [
    new PopupContent(<FaUser />, "Profile", () => handleRoute("/profile")),
    new PopupContent(<FaYoutube />, "Channel", () =>
      handleRoute(`/${userName || "waasim"}`)
    ),
    new PopupContent(<FaSignOutAlt />, "Logout", () => handleLogout),
  ];

  return (
    <PopUp
      button={<SidebarAvatarButton />}
      content={sidebarAvatarPopupContent}
      position="dropdown-top"
    />
  );
}
