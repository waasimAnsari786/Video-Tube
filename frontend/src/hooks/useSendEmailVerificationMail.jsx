/**
 * Custom hook to handle sending email verification mails (OTP or Link).
 *
 * - Uses Redux `dispatch` with async thunk.
 * - Handles request cancellation with `AbortController`.
 * - Automatically updates `auth` slice state (e.g., sets `isOtpSelected`)
 *   instead of relying on component-local state.
 */

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendEmailVerificationMailThunk } from "../store/slices/authSlice";
import { updateAuthSliceStateReducer } from "../store/slices/authSlice";

export default function useSendEmailVerificationMail() {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const email = useSelector((state) => state.auth.email);
  const token_Otp_Expires = useSelector(
    (state) => state.auth.token_Otp_Expires
  );

  const sendEmailVerificationMail = async (verificationType) => {
    const now = Date.now();
    if (token_Otp_Expires && now < new Date(token_Otp_Expires).getTime()) {
      toast.info(
        "You already have a pending verification request. Please check your email and use the previously received link/OTP."
      );
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resultAction = await dispatch(
        sendEmailVerificationMailThunk({
          url: "/users/verify-email",
          payload: { email, verificationType },
          config: { signal: controller.signal },
        })
      );

      if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
        throw new Error(resultAction.payload);
      }

      if (verificationType === "otp") {
        dispatch(
          updateAuthSliceStateReducer({ key: "isOtpSelected", value: true })
        );
        dispatch(
          updateAuthSliceStateReducer({
            key: "emailVerificationError",
            value: null,
          })
        );
      }

      toast.success(resultAction.payload.message);
    } catch (error) {
      if (error.message === "post request cancelled") {
        console.log("send email verification mail request has been cancelled");
      } else {
        toast.error(error.message);
      }
    }
  };

  return { sendEmailVerificationMail, abortControllerRef };
}
