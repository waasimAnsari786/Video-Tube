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
import { sendEmailVerificationMailThunk } from "../store/slices/authSlice"; // ⬅️ adjust path
import { setIsOtpSelected } from "../store/slices/authSlice";

export default function useSendEmailVerificationMail() {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  // read from redux slice (if you want it in component too)
  const email = useSelector((state) => state.auth.email);

  const sendEmailVerificationMail = async (verificationType) => {
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
        // update redux state instead of setState
        dispatch(setIsOtpSelected(true));
      }

      toast.success(resultAction.payload.message);
    } catch (error) {
      if (
        error.message !==
        "send email verification mail request has been cancelled"
      ) {
        toast.error(error.message);
      }
    }
  };

  return { sendEmailVerificationMail, abortControllerRef };
}
