// hooks/useEmailVerification.js
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { emailVerificationThunk } from "../store/slices/authSlice";

/**
 * Custom hook to handle email verification (via link or OTP).
 *
 * - Dispatches `emailVerificationThunk` with email + token/otp.
 * - Uses `AbortController` for cancelling request on unmount.
 * - Shows success/error toasts.
 * - Handles navigation internally for link verification.
 */
export default function useEmailVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const verifyEmail = async ({ verificationType, payload }) => {
    if (!verificationType || !payload) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resultAction = await dispatch(
        emailVerificationThunk({
          url: `/users/verify-email/${verificationType}`,
          payload,
          config: { signal: controller.signal },
        })
      );

      if (!emailVerificationThunk.fulfilled.match(resultAction)) {
        throw new Error(resultAction.payload);
      }

      toast.success(resultAction.payload.message);

      navigate("/");
    } catch (error) {
      if (error.message === "post request cancelled") {
        console.log(
          `${verificationType} verification request has been cancelled`
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  return { verifyEmail, abortControllerRef };
}
