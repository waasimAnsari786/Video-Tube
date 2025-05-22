import { Outlet, useNavigate } from "react-router-dom";
import { Header, Footer, LoginForm } from "../../index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserThunk,
  refreshAccessTokenThunk,
} from "../../features/authSlice";
import { REFRESH_INTERVAL } from "../../constant";
import { toast } from "react-toastify";
import apiRequestService from "../../services/apiRequestService";

const MyWebLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const authStatus = useSelector((state) => state.auth.authStatus);

  /**
   * this useEffect call an asyncThunk of "authSlice.js" which gets current user.
   * If this thunks falis, then useEffect calls another thunk which requests
   * to the server for refreshing access token of the user. However, if
   * "getCurrentUSerThunk" gets response successfully, this useEffect schedules
   * a "setTimeout()" for refreshing the access token on every 14 minutes,
   * before meeting the expiration time of the accesstoken.
   */
  useEffect(() => {
    let timeoutId;
    console.log("my web layout use effect executed");

    const scheduleRefresh = async () => {
      try {
        await apiRequestService.post_req("/users/refresh-token", {}, {});
        timeoutId = setTimeout(scheduleRefresh, REFRESH_INTERVAL);
      } catch (err) {
        toast.error(err.response?.data?.message || "Refresh failed");
      }
    };

    (async () => {
      const currentUser = await dispatch(
        getCurrentUserThunk({
          url: "/users/me",
          config: {},
        })
      );
      if (!getCurrentUserThunk.fulfilled.match(currentUser)) {
        const refreshedToken = await dispatch(
          refreshAccessTokenThunk({
            url: "/users/refresh-token",
            payload: {},
            config: {},
          })
        );
        if (!refreshAccessTokenThunk.fulfilled.match(refreshedToken)) {
          navigate("/login");
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      timeoutId = setTimeout(scheduleRefresh, REFRESH_INTERVAL);
    })();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return !loading ? (
    <LoginForm />
  ) : (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MyWebLayout;
