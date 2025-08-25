import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../utils";
import { toast } from "react-toastify";

export default function EmailVerificationViaLink() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const abortControllerRef = useRef(new AbortController());

  const handleEmailVerificationViaEmail = async () => {
    if (!token || !email) return;

    try {
      const response = await axiosInstance.post(
        "/users/verify-email/link",
        {
          email,
          token,
        },
        { signal: abortControllerRef.current.signal }
      );

      toast.success(response.data.message);
      navigate("/");
    } catch (err) {
      if (abortControllerRef.current.signal.aborted) {
        console.log("email verification request has been deleted");
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

  if (token && email) {
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

  return null;
}
