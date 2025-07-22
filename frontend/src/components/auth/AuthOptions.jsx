// AuthOptions.jsx
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../../utils";

const AuthOptions = () => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post("/users/google", {
        token: credentialResponse.credential,
      });
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google sign-in failed:", error);
  };

  return (
    <div className="flex flex-col gap-4 items-center mt-10">
      <NavLink to={"/signup"}>Sign in with Email</NavLink>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
      />
    </div>
  );
};

export default AuthOptions;
