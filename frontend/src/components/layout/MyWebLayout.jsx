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
  const navigate = useNavigate();
  const refreshTimeoutId = useRef(null);
  const abortController = useRef(new AbortController());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scheduleRefresh = async () => {
      try {
        const refreshed = await dispatch(
          refreshAccessTokenThunk({
            url: "/test",
            payload: {},
            config: { signal: abortController.current.signal },
          })
          // refreshAccessTokenThunk({
          //   url: "/users/refresh-token",
          //   payload: {},
          //   config: { signal: abortController.current.signal },
          // })
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

    const init = async () => {
      try {
        const userRes = await dispatch(
          getCurrentUserThunk({
            url: "/test",
            config: { signal: abortController.current.signal },
          })
          // getCurrentUserThunk({
          //   url: "/users/me",
          //   config: { signal: abortController.current.signal },
          // })
        );

        if (!getCurrentUserThunk.fulfilled.match(userRes)) {
          const refreshRes = await dispatch(
            refreshAccessTokenThunk({
              url: "/test",
              payload: {},
              config: { signal: abortController.current.signal },
            })
            // refreshAccessTokenThunk({
            //   url: "/users/refresh-token",
            //   payload: {},
            //   config: { signal: abortController.current.signal },
            // })
          );

          if (!refreshAccessTokenThunk.fulfilled.match(refreshRes)) {
            navigate("/login");
            return;
          }
        }

        refreshTimeoutId.current = setTimeout(
          scheduleRefresh,
          REFRESH_INTERVAL
        );
      } catch (err) {
        if (abortController.current.signal.aborted) return;
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      clearTimeout(refreshTimeoutId.current);
      abortController.current.abort();
    };
  }, []);

  if (loading) return null;

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
