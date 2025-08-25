import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "../../index";
import { axiosInstance } from "../../../utils";

const EmailVerificationOptions = ({ setIS_OTP_Selected }) => {
  const email = useSelector((state) => state.auth.email); // reading from auth slice
  const abortControllerRef = useRef(null);

  const sendEmailVerificationMail = async (verificationType) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await axiosInstance.post(
        "/users/verify-email",
        {
          email,
          verificationType,
        },
        { signal: controller.signal }
      );

      // ✅ Update parent state if OTP selected
      if (verificationType === "otp") {
        setIS_OTP_Selected(true);
      }

      toast.success(response.data.message);
    } catch (err) {
      if (controller.signal.aborted) {
        console.log("send email verification mail request has been deleted");
        return;
      }
      toast.error(err.response?.data?.message);
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
    </>
  );
};

export default EmailVerificationOptions;
