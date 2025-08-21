import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Container, Header, SideBarAvatar } from "../../index";
import { REFRESH_INTERVAL } from "../../constant";
import { useDispatch } from "react-redux";
import {
  getCurrentUserThunk,
  refreshAccessTokenThunk,
} from "../../store/slices/authSlice";
import { toast } from "react-toastify";

export default function MyWebLayout() {
  const dispatch = useDispatch();
  const refreshTimeoutId = useRef(null);
  const abortController = useRef(new AbortController());

  // 🔄 Handles user session persistence:
  // 1. On mount, fetches the current user (`/users/me`).
  // 2. If access token is expired/invalid, tries to refresh it (`/users/refresh-token`).
  // 3. If refresh succeeds, schedules the next refresh using REFRESH_INTERVAL.
  // 4. On unmount, clears the scheduled refresh and aborts any pending requests.
  useEffect(() => {
    const scheduleRefresh = async () => {
      try {
        const refreshed = await dispatch(
          refreshAccessTokenThunk({
            url: "/users/refresh-token",
            payload: {},
            config: { signal: abortController.current.signal },
          })
        );

        if (!refreshAccessTokenThunk.fulfilled.match(refreshed)) {
          throw new Error("Refresh token request failed");
        }

        refreshTimeoutId.current = setTimeout(
          scheduleRefresh,
          REFRESH_INTERVAL
        );
      } catch (err) {
        if (abortController.current.signal.aborted) return;
      }
    };

    (async () => {
      try {
        const userRes = await dispatch(
          getCurrentUserThunk({
            url: "/users/me",
            config: { signal: abortController.current.signal },
          })
        );

        if (!getCurrentUserThunk.fulfilled.match(userRes)) {
          const refreshRes = await dispatch(
            refreshAccessTokenThunk({
              url: "/users/refresh-token",
              payload: {},
              config: { signal: abortController.current.signal },
            })
          );

          // updating "userRes" variable with value of "refreshRes" variable for using this variable's response easily in the
          // rest of useEffect()
          userRes = refreshRes;

          if (!refreshAccessTokenThunk.fulfilled.match(refreshRes)) return;
        }

        toast.success(userRes.payload?.message);
        refreshTimeoutId.current = setTimeout(
          scheduleRefresh,
          REFRESH_INTERVAL
        );
      } catch (err) {
        if (abortController.current.aborted) return;
      }
    })();

    return () => {
      clearTimeout(refreshTimeoutId.current);
      abortController.current.abort();
    };
  }, []);

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
