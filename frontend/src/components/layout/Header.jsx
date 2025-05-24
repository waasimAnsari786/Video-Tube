import { useNavigate } from "react-router-dom";
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

export default function Header() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);

  return (
    <Container parentElemClass={"bg-base-100 shadow-sm"}>
      <div className="navbar ">
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
            ></ul>
          </div>
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
            />
          </form>
        </div>

        <div className="navbar-end">
          <NavbarEnd />

          <Button btnText="Login" onClick={() => navigate("/login")} />

          {/* {authStatus ? (
            <NavbarEnd />
          ) : (
            <Button btnText="Login" onClick={() => navigate("/login")} />
          )} */}
        </div>
      </div>
    </Container>
  );
}
