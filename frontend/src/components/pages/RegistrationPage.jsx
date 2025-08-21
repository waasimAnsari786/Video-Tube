// 📄 RegistrationPage Component:
// Renders the registration screen with two authentication options:
// 1. RegisterForm → handles email/password authentication.
// 2. GoogleSignup → handles Google OAuth signup/login.
// Both are wrapped inside a Container for consistent layout and styling.

import React from "react";
import { Container, GoogleSignup, RegisterForm } from "../index";

const RegistrationPage = () => {
  return (
    <Container childElemClass="h-screen flex items-center flex-col justify-center">
      <RegisterForm />
      <GoogleSignup />
    </Container>
  );
};

export default RegistrationPage;
