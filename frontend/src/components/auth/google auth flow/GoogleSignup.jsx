import React from "react";
import { FormButton } from "../../index";
import { useNavigate } from "react-router-dom";

const GoogleSignup = () => {
  const navigate = useNavigate();
  return (
    <>
      {/*
      i've used this component for just keeping the button style same as other button styles used in various component
      The only need of this part of the component is just a functionality of redirecting the user to the defined URL in 
      "window.location.href"
      */}
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
        onClick={() => navigate("/auth")}
      />
    </>
  );
};

export default GoogleSignup;
