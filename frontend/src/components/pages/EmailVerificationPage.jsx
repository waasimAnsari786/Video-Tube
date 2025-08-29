import React, { useEffect, useState } from "react";
import {
  EmailVerificationOptions,
  EmailVerificationViaLink,
  EmailVerificationViaOtp,
} from "../index";
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

  if (token && email) {
    return (
      // If component mounts after the user click on the received link in the email, the component which handles email verification, renders
      <EmailVerificationViaLink token={token} email={email} />
    );
  }

  if (isOtpSelected) {
    return (
      //  If user selects "Via Otp" option for email verification along with he successfully receives the OTP in his email inbox, the
      // state is updated to "true" inside "EmailVerificationOptions" component and the below conponent renders
      <EmailVerificationViaOtp />
    );
  }

  if (isEmailVerified) {
    return (
      //  If user selects "Via Otp" option for email verification along with he successfully receives the OTP in his email inbox, the
      // state is updated to "true" inside "EmailVerificationOptions" component and the below conponent renders
      <h1>email is verified</h1>
    );
  }

  return (
    //  Default UI (when user first lands on page to pick option)
    <EmailVerificationOptions />
  );
};

export default EmailVerificationPage;
