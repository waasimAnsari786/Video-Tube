// AuthHandler component:
// Handles the final step of the Google OAuth flow. It runs after the backend redirects
// back to the frontend with either success or error query params. On mount, it checks
// the URL for ?error, shows an error UI with retry button if present, or shows a loading UI otherwise.

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa"; // cancel icon
import { Logo, Button } from "../index";

const AuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect to backend OAuth once on mount (only if no query params)
  useEffect(() => {
    if (!location.search) {
      window.location.href = "http://localhost:3000/api/v1/users/google";
    }
  }, []);

  // Check for errors after backend redirects back
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error) {
      setErrorMsg(error);
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center h-screen flex-col text-center">
      {errorMsg ? (
        <>
          <FaTimesCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Google Sign-in Failed</h2>
          <p className="text-gray-700 mb-6 font-medium">{errorMsg}</p>
          <Button
            btnText="Go Back Home"
            customClass="px-4 py-2"
            onClick={() => navigate("/")}
          />
        </>
      ) : (
        <>
          <Logo src="/images/logo.png" logoClass={"mb-5"} />
          <p className="text-lg font-medium">Signing into VSteam...</p>
        </>
      )}
    </div>
  );
};

export default AuthHandler;
