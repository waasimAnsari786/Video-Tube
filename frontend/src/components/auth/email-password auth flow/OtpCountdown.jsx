import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
// import { sendOtpThunk } from "../../store/thunks"; // ⬅️ example, adjust path

export default function OtpCountdown() {
  const dispatch = useDispatch();
  const token_Otp_Expires =
    useSelector((state) => state.auth.token_Otp_Expires) ||
    new Date(Date.now() + 60 * 1000).toISOString(); // fallback for testing
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

  const handleResendOtp = () => {
    if (!email) {
      toast.error("Email not found!");
      return;
    }
    setExpired(false);

    // Example dispatch — replace with your actual thunk
    // dispatch(sendOtpThunk({ email }));

    toast.info("Requesting a new OTP...");
  };

  return (
    <div className="mt-3 text-center">
      {!expired ? (
        <p className="text-red-500 font-semibold">
          Expires in: {minutes}:{seconds}
        </p>
      ) : // <button
      //   onClick={handleResendOtp}
      //   className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      // >
      //   Resend OTP
      // </button>
      null}
    </div>
  );
}
