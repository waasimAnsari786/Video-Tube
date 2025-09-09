import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { OTP_LENGTH } from "../../../constant";
import {
  EmailVerificationFail,
  OtpCountdown,
  ResendVerification,
  useEmailVerification,
} from "../../../index";

export default function EmailVerificationViaOtp() {
  const [otp, setOtp] = useState("");
  const email = useSelector((state) => state.auth.email);

  const emailVerificationError = useSelector(
    (state) => state.auth.emailVerificationError
  );

  const isOtpExpired = useSelector((state) => state.auth.isOtpExpired);

  const { verifyEmail } = useEmailVerification();

  useEffect(() => {
    if (!emailVerificationError) {
      setOtp(""); // reset OTP when error resolves
    }
  }, [emailVerificationError]);

  useEffect(() => {
    if (otp.length !== OTP_LENGTH) return;

    verifyEmail({
      verificationType: "otp",
      payload: { email, otp },
    });
  }, [otp]);

  if (emailVerificationError)
    return <EmailVerificationFail error={emailVerificationError} />;

  return !isOtpExpired ? (
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
  ) : (
    <ResendVerification verificationType={"otp"} />
  );
}
