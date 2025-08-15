import React, { useEffect, useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { googleSignUpThunk } from "../../store/slices/authSlice";
import { FormButton } from "../index";

const GoogleSignup = () => {
  console.log("GoogleSignup Render ");

  const dispatch = useDispatch();
  const controllerRef = useRef(new AbortController());

  const signUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await dispatch(
          googleSignUpThunk({
            url: "/users/google",
            payload: {
              token: tokenResponse.access_token,
            },
            config: { signal: controllerRef.current.signal },
          })
        );
        console.log("googleSignup response", response);
      } catch (err) {
        console.error(err.response?.data);
        toast.error("Google sign-in failed");
      }
    },
    onError: (error) => {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed");
    },
  });

  useEffect(() => {
    return () => {
      // Cancel any in-progress request on unmount
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return (
    <>
      <FormButton
        label={
          <>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </>
        }
        customClass="w-full md:w-1/2 py-3 w-full rounded-lg mt-10"
        onClick={() => signUp()}
      />
    </>
  );
};

export default GoogleSignup;
