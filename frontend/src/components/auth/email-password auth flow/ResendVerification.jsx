// ResendVerification.jsx
import React from "react";
import { Loading, useSendEmailVerificationMail } from "../../../index";
import { useSelector } from "react-redux";

export default function ResendVerification({ verificationType }) {
  const { sendLinkVerificationMail, sendOtpVerificationMail } =
    useSendEmailVerificationMail();

  const loading = useSelector((state) => state.auth.loading);

  const resendButtonData = {
    otp: { text: "Resend OTP", func: sendOtpVerificationMail },
    link: { text: "Resend Link", func: sendLinkVerificationMail },
  };

  return (
    <>
      <button
        onClick={resendButtonData[verificationType]?.func}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {resendButtonData[verificationType]?.text}
      </button>

      {loading && <Loading />}
    </>
  );
}
