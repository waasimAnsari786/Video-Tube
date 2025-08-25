import React, { useState } from "react";
import {
  EmailVerificationOptions,
  EmailVerificationViaLink,
  EmailVerificationViaOtp,
} from "../index";

const EmailVerificationPage = () => {
  const [IS_OTP_Selected, setIS_OTP_Selected] = useState(false); // ✅ state for OTP selection

  return (
    <>
      {/* If component mounts after the user click on the received link in the email, the component which handles email verification, renders */}
      <EmailVerificationViaLink />;
      {/* If user selects "Via Otp" option for email verification along with he successfully receives the OTP in his email inbox, the 
      state is updated to "true" inside "EmailVerificationOptions" component and the below conponent renders */}
      {IS_OTP_Selected && <EmailVerificationViaOtp />}
      {/* Default UI (when user first lands on page to pick option) */}
      <EmailVerificationOptions setIS_OTP_Selected={setIS_OTP_Selected} />;
    </>
  );
};

export default EmailVerificationPage;
