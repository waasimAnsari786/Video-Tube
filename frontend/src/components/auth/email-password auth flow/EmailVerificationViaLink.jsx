import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils";
import { toast } from "react-toastify";
import { FaTimesCircle } from "react-icons/fa";

export default function EmailVerificationViaLink({ token, email }) {
  const [isEmailVerificationCancelled, setIsEmailVerificationCancelled] =
    useState(null);

  const navigate = useNavigate();
  const abortControllerRef = useRef(new AbortController());

  const handleEmailVerificationViaEmail = async () => {
    if (!token || !email) return;

    try {
      const response = await axiosInstance.post(
        "/users/verify-email/link",
        {
          email,
          verificationToken: token,
        },
        { signal: abortControllerRef.current.signal }
      );

      toast.success(response.data.message);
      navigate("/");
    } catch (err) {
      if (abortControllerRef.current.signal.aborted) {
        console.log("email verification request has been cancelled");
        return;
      }
      setIsEmailVerificationCancelled(err.response?.data?.message);
      toast.error(err.response?.data?.message);
    }
  };

  useEffect(() => {
    handleEmailVerificationViaEmail();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (isEmailVerificationCancelled) {
    return (
      <div className="flex items-center justify-center h-screen flex-col text-center">
        <FaTimesCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Email Verification Failed
        </h2>
        {isEmailVerificationCancelled === "Verification token expired" && (
          <ResendVerification verificationType="link" />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">
        Verifying Your Email <span className="text-blue-700">{email}</span>
      </h1>
      <p className="text-gray-600">
        Please wait while we verify your email. This may take a few seconds...
      </p>
    </div>
  );
}
