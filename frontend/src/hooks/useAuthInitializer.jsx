import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getCurrentUserThunk,
  refreshAccessTokenThunk,
} from "../store/slices/authSlice";
import { useTokenRefreshScheduler } from "../index";

export const useAuthInitializer = (abortController) => {
  const dispatch = useDispatch();
  const { scheduleRefresh, stopRefresh } =
    useTokenRefreshScheduler(abortController);

  useEffect(() => {
    (async () => {
      const userRes = await dispatch(
        getCurrentUserThunk({
          url: "/users/me",
          config: { signal: abortController.current.signal },
        })
      );

      if (!getCurrentUserThunk.fulfilled.match(userRes)) {
        const errorCode = userRes.payload?.errorCode;

        if (errorCode === "GET_REQUEST_CANCELLED") {
          console.log("Get current user request cancelled");
          return;
        }

        if (
          errorCode === "INVALID_OR_EXPIRED_TOKEN" ||
          errorCode === "AUTH_TOKEN_MISSING"
        ) {
          const refreshRes = await dispatch(
            refreshAccessTokenThunk({
              url: "/users/refresh-token",
              payload: {},
              config: { signal: abortController.current.signal },
            })
          );

          if (!refreshAccessTokenThunk.fulfilled.match(refreshRes)) return;
        } else {
          return; // early exit
        }
      }

      toast.success(userRes.payload?.message || "User fetched successfully");
      scheduleRefresh();
    })();

    return () => stopRefresh();
  }, []);
};
