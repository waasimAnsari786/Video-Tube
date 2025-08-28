import React, { useState, useEffect, useRef } from "react";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../utils";
import { useSelector } from "react-redux";
import { OTP_LENGTH } from "../../../constant";
import { ResendVerification, OtpCountdown } from "../../../index";

export default function EmailVerificationViaOtp() {
  const [otp, setOtp] = useState("");
  const abortControllerRef = useRef(null);

  const email = useSelector((state) => state.auth.email);

  const handleChange = (newOtp) => setOtp(newOtp);

  useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const verifyOtp = async () => {
        try {
          const response = await axiosInstance.post(
            "/users/verify-email/otp",
            { email, otp },
            { signal: controller.signal }
          );
          toast.success(response.data.message || "OTP verified successfully!");
        } catch (err) {
          if (controller.signal.aborted) {
            console.log("OTP verification request cancelled");
            return;
          }
          toast.error(
            err.response?.data?.message || "OTP verification failed!"
          );
        }
      };

      verifyOtp();
    }
  }, [otp, email]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Enter OTP sent to {email}</h2>
      <OtpInput
        value={otp}
        onChange={handleChange}
        numInputs={OTP_LENGTH}
        renderSeparator={<span className="mx-1 text-2xl">&nbsp;</span>}
        renderInput={(props) => (
          <input
            {...props}
            className="border min-w-12 p-2 text-center text-lg rounded-md focus:bg-amber-500"
          />
        )}
      />

      <OtpCountdown />

      {/* ✅ Reusable resend button */}
      <div className="mt-4">
        <ResendVerification verificationType="otp" />
      </div>
    </div>
  );
}
