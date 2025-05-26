import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Logo, Row, Column, SearchForm, useToggle } from "../../index";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

export default React.memo(function Header() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const { toggle, handleToggle } = useToggle();

  return (
    <>
      {/* First Row (default) */}
      {!toggle && (
        <Row customRowClass="py-3">
          <Column customColClass="flex items-center lg:col-span-2 col-span-6 md:col-span-2">
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
          </Column>

          <Column customColClass="col-span-8">
            <SearchForm icon={<FaSearch />} customClass={"lg:block hidden"} />
          </Column>

          <Column customColClass="flex gap-4 col-span-2 items-center justify-end">
            <Button
              btnText={<FaSearch />}
              onClick={handleToggle}
              customClass="lg:hidden block"
            ></Button>
            {!authStatus && (
              <Button btnText="Login" onClick={() => navigate("/login")} />
            )}
          </Column>
        </Row>
      )}

      {/* Second Row (Search visible on small screens) */}
      {toggle && (
        <Row customRowClass="py-3">
          <Column customColClass="col-span-12">
            <SearchForm icon={<FaArrowLeft />} iconOnClick={handleToggle} />
          </Column>
        </Row>
      )}
    </>
  );
});
