import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useId } from "react";
import { logoutThunk } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

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
    { name: "Profile", slug: "profile", active: authStatus, id: useId() },
  ];

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {navItems
            .filter((item) => item.active)
            .map((item) => (
              <li key={item.id} className="bg-transparent text-white">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "bg-white text-amber-700" : ""
                  }
                  to={item.slug}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}{" "}
          {authStatus && <button onClick={handleLogout}>Logout</button>}
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
