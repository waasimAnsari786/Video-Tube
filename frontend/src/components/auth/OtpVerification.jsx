import React, { useState, useEffect, useRef } from "react";
import OtpInput from "react-otp-input";
import axiosInstance from "../utils/axiosInstance"; // adjust path
import { toast } from "react-toastify";

const OtpVerification = ({ email }) => {
  const [otp, setOtp] = useState("");
  const abortControllerRef = useRef(null);

  // 👇 triggered every time OTP changes
  const handleChange = (newOtp) => {
    setOtp(newOtp);
  };

  // 👇 send API request when OTP is fully entered (e.g., 4 digits)
  useEffect(() => {
    if (otp.length === 4) {
      // create controller for cancellation
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const verifyOtp = async () => {
        try {
          const response = await axiosInstance.post(
            "/users/verify-email/otp",
            {
              email,
              otp,
            },
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

  // cleanup to cancel request if user leaves
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
        numInputs={4}
        renderSeparator={<span>-</span>}
        renderInput={(props) => (
          <input
            {...props}
            className="border p-2 w-12 text-center text-lg rounded-md"
          />
        )}
      />
    </div>
  );
};

export default OtpVerification;
