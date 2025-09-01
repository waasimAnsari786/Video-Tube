import React from "react";
import { useNavigate } from "react-router-dom";

const GoogleSignup = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        type="submit"
        className="w-full md:w-1/2 py-3 rounded-lg mt-10 btn-liquid liquid flex items-center justify-center gap-2 text-sm cursor-pointer "
        onClick={() => navigate("/auth")}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Sign in with Google
      </button>
    </>
  );
};

export default GoogleSignup;
