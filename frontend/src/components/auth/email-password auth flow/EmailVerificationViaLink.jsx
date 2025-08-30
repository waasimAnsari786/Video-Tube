import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils";
import { toast } from "react-toastify";

export default function EmailVerificationViaLink({ token, email }) {
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Verifying Your Email <span className="text-blue-700">{email}</span>
      </h1>
      <p className="text-gray-600">
        Please wait while we verify your email. This may take a few seconds...
      </p>
    </>
  );
}
