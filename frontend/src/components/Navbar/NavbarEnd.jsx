import React from "react";
import { Avatar } from "../../index";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaCog, FaSignOutAlt, FaYoutube } from "react-icons/fa";
import { logoutThunk } from "../../features/authSlice";
import { toast } from "react-toastify";

export default function NavbarEnd() {
  const avatar = useSelector((state) => state.auth.avatar);
  const userName = useSelector((state) => state.auth.userName);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <div className="dropdown dropdown-end text-gray-400">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <Avatar
          avatar={avatar?.secureURL || "./src/assets/man vector avatar.jpg"}
        />
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
      >
        <li className="rounded hover:bg-blue-900 hover:text-white">
          <NavLink to={"/profile"} className="justify-between ">
            <span className="flex items-center gap-2">
              <FaUser /> Profile
            </span>
          </NavLink>
        </li>
        {/* <li className="rounded hover:bg-blue-900 hover:text-white">
          <NavLink to={`/${userName}`} className="justify-between">
            <span className="flex items-center gap-2">
              <FaYoutube /> Channel
            </span>
          </NavLink>
        </li> */}
        <li className="rounded hover:bg-blue-900 hover:text-white">
          <NavLink to={"/update-profile"}>
            <span className="flex items-center gap-2">
              <FaCog /> Settings
            </span>
          </NavLink>
        </li>
        {/* <li className="rounded hover:bg-blue-900 hover:text-white">
          <button onClick={handleLogout}>
            <span className="flex items-center gap-2">
              <FaSignOutAlt /> Logout
            </span>
          </button>
        </li> */}
      </ul>
    </div>
  );
}
