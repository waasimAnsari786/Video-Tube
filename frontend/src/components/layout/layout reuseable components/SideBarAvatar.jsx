import React from "react";
import {
  Loading,
  PopUp,
  PopupContent,
  SidebarAvatarButton,
  useAbortController,
  useLoading,
  useRoute,
} from "../../../index";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../../../store/slices/authSlice";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaUser, FaYoutube } from "react-icons/fa";

export default function SideBarAvatar() {
  const userName = useSelector((state) => state.auth.userName);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const abortController = useAbortController();
  const { loading, setLoading } = useLoading();

  const { handleRoute } = useRoute();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    setLoading(true); // show loader
    const result = await dispatch(
      logoutThunk({
        url: "/users/me/logout",
        payload: {},
        config: { signal: abortController.current.signal },
      })
    );

    setLoading(false);
    if (!logoutThunk.fulfilled.match(result)) {
      toast.error(result.payload?.message);
      return;
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

  return (
    authStatus && (
      <>
        <PopUp
          button={<SidebarAvatarButton />}
          content={sidebarAvatarPopupContent}
          position="dropdown-top"
        />
        {loading && <Loading />} {/* Overlay spinner */}
      </>
    )
  );
}
