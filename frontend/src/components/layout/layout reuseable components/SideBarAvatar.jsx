import React from "react";
import {
  PopUp,
  SidebarAvatarButton,
  getSidebarAvatarContent,
  useRoute,
} from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../../features/authSlice";
import { toast } from "react-toastify";

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

  const content = getSidebarAvatarContent({
    profileRoute: "/profile",
    channelRoute: `/${userName || "waasim"}`,
    onLogout: handleLogout,
    handleRoute,
  });

  return (
    <PopUp button={<SidebarAvatarButton />} content={content} position="top" />
  );
}
