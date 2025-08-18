import React from "react";
import { FormButton } from "../index";

const GoogleSignup = () => {
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
        onClick={() =>
          (window.location.href = "http://localhost:3000/api/v1/users/google")
        }
      />
    </>
  );
};

export default GoogleSignup;
