import { Outlet } from "react-router-dom";
import React from "react";
import {
  Container,
  Header,
  SideBarAvatar,
  useAbortController,
  useAuthInitializer,
} from "../../index";

export default function MyWebLayout() {
  const abortController = useAbortController();
  useAuthInitializer(abortController);

  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        <Container parentElemClass={"bg-base-100 shadow-md"}>
          <Header />
        </Container>

        {/* Page Content */}
        <Container childElemClass="pt-8">
          <Outlet />
        </Container>
      </div>

      {/* Sidebar content */}
      <div className="drawer-side">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-50 sm:w-66 p-4 text-base-content flex flex-col justify-between">
          <div>
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </div>
          <div>
            <SideBarAvatar />
          </div>
        </ul>
      </div>
    </div>
  );
}
