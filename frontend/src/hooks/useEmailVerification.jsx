// hooks/useEmailVerification.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { emailVerificationThunk } from "../store/slices/authSlice";
import { useAbortController } from "../index";

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
  const abortController = useAbortController();

  const verifyEmail = async ({ verificationType, payload }) => {
    if (!verificationType || !payload) return;

    const resultAction = await dispatch(
      emailVerificationThunk({
        url: `/users/verify-email/${verificationType}`,
        payload,
        config: { signal: abortController.current.signal },
      })
    );

    if (!emailVerificationThunk.fulfilled.match(resultAction)) {
      const errorCode = resultAction.payload?.errorCode;
      if (errorCode === "POST_REQUEST_CANCELLED") {
        console.log(
          `${verificationType} verification request has been cancelled`
        );
      } else {
        toast.error(resultAction.payload?.message || "Verification failed");
      }

      return;
    }

    toast.success(resultAction.payload.message);

    navigate("/");
  };

  return { verifyEmail };
}
