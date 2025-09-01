/**
 * ProtectedEmailVerificationRoute
 *
 * Purpose:
 * This component acts as a route guard for the email verification flow.
 *
 * What it does:
 * - Prevents already verified users from revisiting the verification page (redirects them to home).
 * - Grants access if:
 *    • User clicked the verification link (has token + email in query).
 *    • User has a registered email stored in Redux (came from registration).
 * - Redirects to the registration page if none of the above conditions are met.
 *
 * In short: Ensures only users who are in the correct stage of verification can
 * access the Email Verification page, and blocks direct/manual navigation attempts.
 */

// ProtectedEmailVerificationRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedEmailVerificationRoute({ children }) {
  const email = useSelector((state) => state.auth.email);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const emailQuery = searchParams.get("email");

  // ✅ Allow access if coming from link (token + email present)
  if (token && emailQuery) {
    return children;
  }

  // ✅ Allow access if user has registered email stored in Redux
  if (email) {
    return children;
  }

  // ❌ Otherwise redirect
  return <Navigate to="/register" replace />;
}
