import React from "react";
import { Avatar } from "../../index";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default React.memo(function NavbarEnd({ handleLogout }) {
  const avatar = useSelector((state) => state.auth.avatar);
  const userName = useSelector((state) => state.auth.userName);

  return (
    <div className="navbar-end">
      <div className="dropdown dropdown-end">
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
          <li>
            <NavLink to={"/profile"} className="justify-between">
              Profile <span className="badge">New</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/${userName}`} className="justify-between">
              Channel
            </NavLink>
          </li>
          <li>
            <NavLink to={"/update-profile"}>Settings</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
});
