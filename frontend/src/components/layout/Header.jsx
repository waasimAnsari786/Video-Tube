import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import React from "react";
import { logoutThunk } from "../../features/authSlice";
import { useDispatch } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const result = await dispatch(logoutThunk());
    if (logoutThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to={"/"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/login"}>Login</NavLink>
          </li>
          <li>
            <NavLink to={"/register"}>Signup</NavLink>
          </li>
          <li>
            <NavLink to={"/details"}>Update Details</NavLink>
          </li>
          <li>
            <NavLink to={"/password"}>Update Password</NavLink>
          </li>
          <button onClick={handleLogout}>Logout</button>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
