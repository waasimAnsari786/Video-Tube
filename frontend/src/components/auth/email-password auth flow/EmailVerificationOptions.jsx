import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSendEmailVerificationMail, Button, Loading } from "../../../index";

const EmailVerificationOptions = () => {
  const loading = useSelector((state) => state.auth.loading); // reading from auth slice

  //   const controller = new AbortController();
  //   abortControllerRef.current = controller;

  //   try {
  //     const resultAction = await dispatch(
  //       sendEmailVerificationMailThunk({
  //         url: "/users/verify-email",
  //         payload: { email, verificationType },
  //         config: { signal: controller.signal },
  //       })
  //     );

  //     if (!sendEmailVerificationMailThunk.fulfilled.match(resultAction)) {
  //       throw new Error(resultAction.payload);
  //     }

  //     if (verificationType === "otp") {
  //       setIS_OTP_Selected(true);
  //     }

  //     toast.success(resultAction.payload.message);
  //   } catch (error) {
  //     if (
  //       error.message !==
  //       "send email verification mail request hss been cancelled"
  //     ) {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  const { sendEmailVerificationMail, abortControllerRef } =
    useSendEmailVerificationMail();

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
