import React from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // any icons you like
import Logo from "./reuseable-components/Logo";
import FormHeading from "./reuseable-components/FormHeading";
import FormInput from "./reuseable-components/FormInput";
import FormButton from "./reuseable-components/FormButton";
import FormText from "./reuseable-components/FormText";

const RegisterForm = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-16 flex-col">
      <Logo
        src={
          "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
        }
      />
      <div className="container mx-auto text-center">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-2xl rounded-xl p-10">
              <FormHeading title="Register" />
              <form className="mt-5">
                <div className="space-y-5 mb-5">
                  <FormInput
                    type="text"
                    placeholder="Full Name"
                    icon={<FaUser />}
                  />
                  <FormInput
                    type="email"
                    placeholder="Email Address"
                    icon={<FaEnvelope />}
                  />
                  <FormInput
                    type="text"
                    placeholder="Username"
                    icon={<FaUser />}
                  />
                  <FormInput
                    type="password"
                    placeholder="Password"
                    icon={<FaLock />}
                  />
                </div>
                <div className="text-center">
                  <FormButton label="Get Started" />
                  <FormText text="Already have an account? Sign In" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
