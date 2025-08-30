/**
 * OtpCountdown Component
 *
 * Purpose:
 * - Displays a live countdown timer for OTP expiration based on the `token_Otp_Expires`
 *   value stored in the Redux `auth` slice.
 *
 * Features:
 * - Continuously updates the countdown every second until expiration.
 * - Resets the countdown whenever a new `token_Otp_Expires` is received from Redux.
 * - Shows time in MM:SS format.
 * - When expired:
 *   - Displays "00:00" in gray color.
 *   - Shows an error toast notification prompting the user to request a new OTP.
 *
 * Usage:
 * - This component is intended to be used wherever OTP validation is required
 *   (e.g., email/phone verification flows).
 */

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ResendVerification } from "../../../index";

export default function OtpCountdown() {
  const token_Otp_Expires = useSelector(
    (state) => state.auth.token_Otp_Expires
  );

  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token_Otp_Expires) return;

    const expiryTime = new Date(token_Otp_Expires).getTime();
    setExpired(false);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setExpired(true);
        toast.error("OTP expired! Please request a new one.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token_Otp_Expires]);

  if (!token_Otp_Expires) return null;

  // Format minutes and seconds
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return !expired ? (
    <p className="font-semibold text-red-500">
      Expires in: {minutes}:{seconds}
    </p>
  ) : (
    <ResendVerification verificationType={"otp"} />
  );
}
