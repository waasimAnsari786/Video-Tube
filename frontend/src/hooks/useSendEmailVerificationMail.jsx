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

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  sendEmailVerificationMailThunk,
  updateAuthSliceStateReducer,
} from "../store/slices/authSlice";
import { useAbortController } from "../index";

export default function useSendEmailVerificationMail() {
  const dispatch = useDispatch();
  const abortController = useAbortController();

  const email = useSelector((state) => state.auth.email);
  const token_Otp_Expires = useSelector(
    (state) => state.auth.token_Otp_Expires
  );

  // 🔹 Common expiry check (reusable by both functions)
  const hasPendingOtpOrLink = () => {
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
    if (hasPendingOtpOrLink()) {
      dispatch(
        updateAuthSliceStateReducer({
          key: "emailVerificationError",
          value: null,
        })
      );
      return;
    }

    const resultAction = await dispatch(
      sendEmailVerificationMailThunk({
        url: "/users/verify-email",
        payload: { email, verificationType: "otp" },
        config: { signal: abortController.current.signal },
      })
    );

    if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
      const errorCode = resultAction.payload?.errorCode;
      if (errorCode === "POST_REQUEST_CANCELLED") {
        console.log("send OTP request cancelled");
      } else {
        toast.error(resultAction.payload?.message || "OTP request failed");
      }

      return;
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
  };

  const sendLinkVerificationMail = async () => {
    if (hasPendingOtpOrLink()) return;

    const resultAction = await dispatch(
      sendEmailVerificationMailThunk({
        url: "/users/verify-email",
        payload: { email, verificationType: "link" },
        config: { signal: abortController.current.signal },
      })
    );

    if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
      const errorCode = resultAction.payload?.errorCode;
      if (errorCode === "POST_REQUEST_CANCELLED") {
        console.log("send link request cancelled");
      } else {
        toast.error(resultAction.payload?.message || "Link request failed");
      }

      return;
    }

    toast.success(resultAction.payload.message);
  };

  return {
    sendOtpVerificationMail,
    sendLinkVerificationMail,
  };
}
