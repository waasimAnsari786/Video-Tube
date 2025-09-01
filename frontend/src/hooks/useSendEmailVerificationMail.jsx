/**
 * Custom hook for sending email verification requests.
 *
 * Provides two separate functions:
 * - sendOtpVerificationMail: Sends OTP-based verification email with extra state handling.
 * - sendLinkVerificationMail: Sends link-based verification email with simpler flow.
 *
 * Both functions share a common expiry check to prevent multiple pending OTP requests.
 * Handles request cancellation with AbortController and updates Redux auth state accordingly.
 */

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  sendEmailVerificationMailThunk,
  updateAuthSliceStateReducer,
} from "../store/slices/authSlice";

export default function useSendEmailVerificationMail() {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const email = useSelector((state) => state.auth.email);
  const token_Otp_Expires = useSelector(
    (state) => state.auth.token_Otp_Expires
  );

  // 🔹 Common expiry check (reusable by both functions)
  const hasPendingOtp = () => {
    const now = Date.now();
    if (token_Otp_Expires && now < new Date(token_Otp_Expires).getTime()) {
      toast.info(
        "You already have a pending verification request. Please check your email and use the previously received link/OTP."
      );
      return true; // ✅ means "stop, OTP still valid"
    }
    return false;
  };

  const sendOtpVerificationMail = async () => {
    if (hasPendingOtp()) {
      dispatch(
        updateAuthSliceStateReducer({
          key: "emailVerificationError",
          value: null,
        })
      );
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resultAction = await dispatch(
        sendEmailVerificationMailThunk({
          url: "/users/verify-email",
          payload: { email, verificationType: "otp" },
          config: { signal: controller.signal },
        })
      );

      if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
        throw new Error(resultAction.payload);
      }

      // OTP-specific state updates
      dispatch(
        updateAuthSliceStateReducer({ key: "isOtpSelected", value: true })
      );
      dispatch(
        updateAuthSliceStateReducer({
          key: "emailVerificationError",
          value: null,
        })
      );
      dispatch(
        updateAuthSliceStateReducer({ key: "isOtpExpired", value: false })
      );

      toast.success(resultAction.payload.message);
    } catch (error) {
      if (error.message === "post request cancelled") {
        console.log("OTP request cancelled");
      } else {
        toast.error(error.message);
      }
    }
  };

  const sendLinkVerificationMail = async () => {
    if (hasPendingOtp()) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resultAction = await dispatch(
        sendEmailVerificationMailThunk({
          url: "/users/verify-email",
          payload: { email, verificationType: "link" },
          config: { signal: controller.signal },
        })
      );

      if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
        throw new Error(resultAction.payload);
      }

      toast.success(resultAction.payload.message);
    } catch (error) {
      if (error.message === "post request cancelled") {
        console.log("Link request cancelled");
      } else {
        toast.error(error.message);
      }
    }
  };

  return {
    sendOtpVerificationMail,
    sendLinkVerificationMail,
    abortControllerRef,
  };
}
