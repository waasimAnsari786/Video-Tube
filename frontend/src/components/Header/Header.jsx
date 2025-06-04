import React from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Logo,
  Row,
  Column,
  SearchForm,
  useToggle,
  SidebarToggle,
  useRoute,
} from "../../index";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const { toggle, handleToggle } = useToggle();
  const { handleRoute } = useRoute();

  return (
    <>
      {!toggle ? (
        //First Row (default)
        <Row customRowClass="py-3">
          <Column customColClass="col-span-12 flex justify-between items-center">
            <div className="flex lg:w-[15%] md:w-[30%] sm:w-[40%] w-[50%] items-center gap-3">
              <SidebarToggle />
              <Logo src={"/images/logo.png"} />
            </div>
            <SearchForm icon={<FaSearch />} customClass={"hidden lg:block"} />
            <div className="flex gap-2">
              <Button
                btnText={<FaSearch />}
                onClick={handleToggle}
                customClass="py-2 lg:hidden block"
              />
              {!authStatus && (
                <Button btnText="Login" onClick={() => handleRoute("/login")} />
              )}
            </div>
          </Column>
        </Row>
      ) : (
        // Second Row (Search visible on small screens)
        <Row customRowClass="py-3">
          <Column customColClass="sm:col-span-1 col-span-2 flex items-center">
            <SidebarToggle />
          </Column>
          <Column customColClass="sm:col-span-11 col-span-10">
            <SearchForm icon={<FaArrowLeft />} iconOnClick={handleToggle} />
          </Column>
        </Row>
      )}
    </>
  );
}
