import React, { useEffect } from "react";
import { EmailVerificationFail, useEmailVerification } from "../../../index";
import { useSelector } from "react-redux";

export default function EmailVerificationViaLink({ token, email }) {
  const { verifyEmail } = useEmailVerification();

  const emailVerificationError = useSelector(
    (state) => state.auth.emailVerificationError
  );

  useEffect(() => {
    verifyEmail({
      verificationType: "link",
      payload: { email, verificationToken: token },
    });
  }, []);

  if (emailVerificationError)
    return <EmailVerificationFail error={emailVerificationError} />;

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
