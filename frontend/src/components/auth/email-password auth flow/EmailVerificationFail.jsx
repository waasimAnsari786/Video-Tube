import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { ResendVerification } from "../../../index";

export default function EmailVerificationFail({ error }) {
  return (
    <>
      <FaTimesCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Email Verification Failed</h2>
      {error === "Verification token expired" && (
        <ResendVerification verificationType={"link"} />
      )}

      {error === "Invalid or expired OTP" && (
        <ResendVerification verificationType={"otp"} />
      )}
    </>
  );
}
