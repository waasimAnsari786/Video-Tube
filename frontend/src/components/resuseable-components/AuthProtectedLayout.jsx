/**
 * This component has written for protecting each component which requires both
 * authorization and authentication of user. It takes a prop "authentication"
 * and reads "authStatus"(a state value of "authSlice.js") and then take user
 * to the correct page by checking that is user authnticated and authorized?*/

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthProtectedLayout({
  children,
  authentication = true,
}) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      setLoader(false);
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      setLoader(false);
      navigate("/");
    }
  }, [navigate, authStatus]);

  // return loader ? <h1>Loading...</h1> : <>{children}</>;
  return <>{children}</>;
}
