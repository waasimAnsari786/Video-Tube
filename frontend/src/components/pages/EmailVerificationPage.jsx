import React, { useEffect } from "react";
import {
  Container,
  EmailVerificationOptions,
  EmailVerificationViaLink,
  EmailVerificationViaOtp,
} from "../../index";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAuthSliceStateReducer } from "../../store/slices/authSlice";

const EmailVerificationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const dispatch = useDispatch();

  const isOtpSelected = useSelector((state) => state.auth.isOtpSelected);
  const isEmailVerified = useSelector((state) => state.auth.isEmailVerified);

  useEffect(() => {
    if (email) {
      dispatch(updateAuthSliceStateReducer({ key: "email", value: email }));
    }
  }, []);

  if (isEmailVerified) return <h1>email is verified</h1>;

  if (token && email) {
    return (
      //  If component mounts after the user click on the received link in the
      // email, the component which handles email verification, renders

      <Container childElemClass="flex flex-col items-center justify-center min-h-screen">
        <EmailVerificationViaLink token={token} email={email} />
      </Container>
    );
  }

  if (isOtpSelected) {
    return (
      //  If user selects "Via Otp" option for email verification along with he successfully receives the OTP in his email inbox, the
      // state is updated to "true" inside "EmailVerificationOptions" component and the below conponent renders
      <Container childElemClass="flex flex-col items-center justify-center min-h-screen">
        <EmailVerificationViaOtp />
      </Container>
    );
  }

  return (
    //  Default UI (when user first lands on page to pick option)

    <Container childElemClass="flex flex-col items-center justify-center min-h-screen">
      <EmailVerificationOptions />
    </Container>
  );
};

export default EmailVerificationPage;
