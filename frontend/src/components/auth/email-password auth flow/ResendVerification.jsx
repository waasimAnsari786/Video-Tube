// ResendVerification.jsx
import React from "react";
import { Loading, useSendEmailVerificationMail } from "../../../index";
import { useSelector } from "react-redux";

export default function ResendVerification({ verificationType }) {
  const { sendEmailVerificationMail, abortControllerRef } =
    useSendEmailVerificationMail();

  const loading = useSelector((state) => state.auth.loading);

  const handleResend = () => {
    sendEmailVerificationMail(verificationType);
  };

  const resendButtonText = {
    otp: "Resend OTP",
    link: "Resend Link",
  };

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <>
      <button
        onClick={handleResend}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {resendButtonText[verificationType]}
      </button>

      {loading && <Loading />}
    </>
  );
}
