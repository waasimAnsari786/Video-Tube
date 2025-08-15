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
