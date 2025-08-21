// 📄 LoginPage Component:
// Renders the login screen with two authentication options:
// 1. LoginForm → handles email/password authentication.
// 2. GoogleSignup → handles Google OAuth signup/login.
// Both are wrapped inside a Container for consistent layout and styling.

import React from "react";
import { Container, GoogleSignup, LoginForm } from "../index";

export default function LoginPage() {
  return (
    <Container childElemClass="h-screen flex items-center flex-col justify-center">
      <LoginForm />
      <GoogleSignup />
    </Container>
  );
}
