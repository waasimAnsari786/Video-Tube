import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

export default function OtpCountdown() {
  const dispatch = useDispatch();
  const token_Otp_Expires = useSelector(
    (state) => state.auth.token_Otp_Expires
  );
  const email = useSelector((state) => state.auth.email);

  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token_Otp_Expires) return;

    const expiryTime = new Date(token_Otp_Expires).getTime();

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

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="mt-3 text-center">
      {!expired && (
        <p className="text-red-500 font-semibold">
          Expires in: {minutes}:{seconds}
        </p>
      )}
    </div>
  );
}
