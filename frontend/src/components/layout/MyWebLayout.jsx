import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Container,
  InputContainer,
  Logo,
  NavbarEnd,
} from "../../index";
import { FaSearch } from "react-icons/fa";

export default function MyWebLayout() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);

  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Header section (your provided Header component content) */}
        <Container parentElemClass={"bg-base-100 shadow-sm"}>
          <div className="navbar p-0">
            <div className="navbar-start">
              {/* Toggle button only for md and smaller */}
              <label
                htmlFor="main-drawer"
                className="btn btn-ghost drawer-button lg:hidden"
              >
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
              </label>
              <Logo src={"/images/logo.png"} />
            </div>

            <div className="navbar-center hidden lg:flex">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = e.target.elements.search.value.trim();
                  if (query) {
                    console.log("Searching for:", query);
                  }
                }}
                className="flex items-center gap-2"
              >
                <InputContainer
                  name="search"
                  type="text"
                  placeholder="Search..."
                  icon={<FaSearch />}
                  customInpClass="py-2"
                  customClass="w-120"
                />
              </form>
            </div>

            <div className="navbar-end">
              <Button btnText="Login" onClick={() => navigate("/login")} />
            </div>
          </div>
        </Container>

        {/* Page Content */}
        <Container>
          <Outlet />
        </Container>
      </div>

      {/* Sidebar content */}
      <div className="drawer-side">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 text-base-content flex flex-col justify-between">
          {/* Sidebar items */}
          <div>
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </div>
          <div>
            <NavbarEnd />
          </div>
        </ul>
      </div>
    </div>
  );
}
