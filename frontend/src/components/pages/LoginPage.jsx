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
