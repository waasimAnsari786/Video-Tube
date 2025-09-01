import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { OTP_LENGTH } from "../../../constant";
import {
  EmailVerificationFail,
  OtpCountdown,
  useEmailVerification,
} from "../../../index";

export default function EmailVerificationViaOtp() {
  const [otp, setOtp] = useState("");
  const email = useSelector((state) => state.auth.email);

  const emailVerificationError = useSelector(
    (state) => state.auth.emailVerificationError
  );

  const { verifyEmail, abortControllerRef } = useEmailVerification();

  useEffect(() => {
    if (otp.length !== OTP_LENGTH) return;

    verifyEmail({
      verificationType: "otp",
      payload: { email, otp },
    });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [otp]);

  if (emailVerificationError)
    return <EmailVerificationFail error={emailVerificationError} />;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Enter OTP sent to {email}</h2>
      <OtpInput
        value={otp}
        onChange={setOtp}
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
    </>
  );
}
