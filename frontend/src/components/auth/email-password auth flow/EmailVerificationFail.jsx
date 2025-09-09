import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { ResendVerification } from "../../../index";
import { Link } from "react-router-dom";

export default function EmailVerificationFail({ error }) {
  return (
    <>
      <FaTimesCircle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold mb-2">Email Verification Failed</h2>

      {error?.errorCode === "INVALID_OR_EXPIRED_TOKEN" && (
        <ResendVerification verificationType={"link"} />
      )}

      {error?.errorCode === "AUTH_INVALID_OR_EXPIRED_OTP" && (
        <ResendVerification verificationType={"otp"} />
      )}

      {error?.errorCode !== "INVALID_OR_EXPIRED_TOKEN" &&
        error?.errorCode !== "AUTH_INVALID_OR_EXPIRED_OTP" && (
          <Link
            to="/"
            className="px-4 py-2 mt-4 inline-block bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go To Home
          </Link>
        )}
    </>
  );
}
