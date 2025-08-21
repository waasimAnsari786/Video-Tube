import React, { useEffect, useRef } from "react";
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
  const authStatus = useSelector((state) => state.auth.authStatus);
  const controllerRef = useRef(new AbortController());

  const { handleRoute } = useRoute();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await dispatch(
      logoutThunk({
        url: "/users/me/logout",
        payload: {},
        config: { signal: controllerRef.current.signal },
      })
    );
    if (!logoutThunk.fulfilled.match(result)) {
      toast.error(result.payload || "Logout failed");
    }

    toast.success(result.payload.message);
  };

  const sidebarAvatarPopupContent = [
    new PopupContent(<FaUser />, "Profile", () => handleRoute("/profile")),
    new PopupContent(<FaYoutube />, "Channel", () =>
      handleRoute(`/${userName || "waasim"}`)
    ),
    new PopupContent(<FaSignOutAlt />, "Logout", handleLogout),
  ];

  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  return (
    authStatus && (
      <PopUp
        button={<SidebarAvatarButton />}
        content={sidebarAvatarPopupContent}
        position="dropdown-top"
      />
    )
  );
}
