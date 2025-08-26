import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Loading } from "../../index";
import { sendEmailVerificationMailThunk } from "../../../store/slices/authSlice";

const EmailVerificationOptions = ({ setIS_OTP_Selected }) => {
  const email = useSelector((state) => state.auth.email); // reading from auth slice
  const loading = useSelector((state) => state.auth.loading); // reading from auth slice
  const token_Otp_Expires = useSelector(
    (state) => state.auth.token_Otp_Expires
  ); // reading from auth slice
  const abortControllerRef = useRef(null);

  const dispatch = useDispatch();

  const sendEmailVerificationMail = async (verificationType) => {
    // ✅ Check expiration before making request
    if (token_Otp_Expires) {
      const expiresAt = new Date(token_Otp_Expires).getTime();
      const now = Date.now();

      if (now < expiresAt) {
        // still valid → don’t send request
        toast.info(
          "You already have a pending verification request. Please check your email and use the previously received token/OTP."
        );
        return;
      }
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const resultAction = await dispatch(
        sendEmailVerificationMailThunk({
          url: "/users/verify-email",
          payload: { email, verificationType },
          config: { signal: controller.signal },
        })
      );

      if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
        throw new Error(resultAction.payload);
      }

      if (verificationType === "otp") {
        setIS_OTP_Selected(true);
      }

      toast.success(resultAction.payload.message);
    } catch (error) {
      // Don't show error toast if request was cancelled
      if (error.message !== "post request cancelled") {
        toast.error(error.message);
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-gray-600 max-w-md mb-8">
          To complete your registration, please verify your email address. You
          can choose one of the following options:
          <br />
          <br />- <strong>Via Link:</strong> We’ll send you an email containing
          a verification link. Click the link in your inbox to verify your
          account.
          <br />- <strong>Via OTP:</strong> We’ll send you a One-Time Password
          (OTP) to your email. Enter that code in the next step to complete
          verification.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button
          btnText="Via Link"
          padding="px-6 py-3"
          onClick={() => sendEmailVerificationMail("link")}
          borderRadius="rounded-full"
        />
        <Button
          btnText="Via OTP"
          borderRadius="rounded-full"
          padding="px-6 py-3"
          onClick={() => sendEmailVerificationMail("otp")}
        />
      </div>

      {loading && <Loading />}
    </>
  );
};

export default EmailVerificationOptions;
