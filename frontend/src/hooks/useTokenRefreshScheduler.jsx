import { useRef } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessTokenThunk } from "../store/slices/authSlice";
import { REFRESH_INTERVAL } from "../constant";

const useTokenRefreshScheduler = (abortController) => {
  const dispatch = useDispatch();
  const refreshTimeoutId = useRef(null);

  const scheduleRefresh = async () => {
    const refreshed = await dispatch(
      refreshAccessTokenThunk({
        url: "/users/refresh-token",
        payload: {},
        config: { signal: abortController.current.signal },
      })
    );

    if (!refreshAccessTokenThunk.fulfilled.match(refreshed)) {
      const errorCode = refreshed.payload?.errorCode;
      if (errorCode === "POST_REQUEST_CANCELLED") {
        console.log("Refresh access token request cancelled");
      }

      return;
    }

    refreshTimeoutId.current = setTimeout(scheduleRefresh, REFRESH_INTERVAL);
  };

  const stopRefresh = () => {
    clearTimeout(refreshTimeoutId.current);
    abortController.current.abort();
  };

  return { scheduleRefresh, stopRefresh };
};

export default useTokenRefreshScheduler;
