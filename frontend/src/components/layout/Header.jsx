import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useId } from "react";
import { logoutThunk } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavbarEnd } from "../../index";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);

  const handleLogout = async () => {
    const result = await dispatch(logoutThunk());
    if (logoutThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/login");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  const navItems = [
    { name: "Home", slug: "", active: true, id: useId() },
    { name: "Login", slug: "login", active: !authStatus, id: useId() },
    { name: "Signup", slug: "register", active: !authStatus, id: useId() },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navItems
              .filter((item) => item.active)
              .map((item) => (
                <li key={item.id}>
                  <NavLink to={item.slug}>{item.name}</NavLink>
                </li>
              ))}
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems
            .filter((item) => item.active)
            .map((item) => (
              <li key={item.id}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "bg-white text-gray-700" : ""
                  }
                  to={item.slug}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2 bg-base-100 rounded-box">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      {authStatus && <NavbarEnd handleLogout={handleLogout} />}
    </div>
  );
}
