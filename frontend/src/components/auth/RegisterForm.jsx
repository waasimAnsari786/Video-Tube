import React from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Logo from "./reuseable-components/Logo";
import FormHeading from "./reuseable-components/FormHeading";
import FormText from "./reuseable-components/FormText";
import FormInput from "./reuseable-components/FormInput";
import FormButton from "./reuseable-components/FormButton";
import showFormErrors from "../utils/ShowFormError";

const RegisterForm = () => {
  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      fullName: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleRegister = (data) => {
    console.log("Handle register executed");
    console.log("form data", data);
    reset();
  };

  return (
    <section className="h-screen flex items-center flex-col justify-center">
      <Logo src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" />
      <div className="w-full max-w-md mx-auto mt-5">
        <div className="bg-white shadow-2xl rounded-xl p-10 text-center">
          <FormHeading title="Register" />
          <FormText text="Create your account" />

          <form
            onSubmit={handleSubmit(handleRegister, (formErrors) =>
              showFormErrors(formErrors)
            )}
          >
            <div className="space-y-5 mb-5">
              {/* Username Field */}
              <FormInput
                type="text"
                placeholder="Username"
                icon={<FaUser />}
                {...register("userName", {
                  required: "Username is required",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*_.*_)[a-zA-Z0-9_]{3,20}$/,
                    message:
                      "User name must be 3-20 characters long and must contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 underscore(_)",
                  },
                })}
              />

              {/* Email Field */}
              <FormInput
                type="email"
                placeholder="Email Address"
                icon={<FaEnvelope />}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[\da-zA-Z]+(?:[+%._-][\da-zA-Z]+)*@(?:[-.])*[a-zA-Z\d]+(?:[-])*\.[A-Za-z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />

              {/* fullname Field */}
              <FormInput
                type="text"
                placeholder="Full Name"
                icon={<FaUser />}
                {...register("fullName", {
                  required: "Full name is required",
                })}
              />

              {/* Password Field */}
              <FormInput
                type="password"
                placeholder="Password"
                icon={<FaLock />}
                isPassword
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
                    message:
                      "Password must be at least 8 characters, contain uppercase, lowercase, digit, special character, and no repeating chars.",
                  },
                })}
              />
            </div>

            <div className="text-center">
              <FormButton label="Register" />
              <FormText
                text="Already have an account?"
                linkText="Login"
                linkTo="/login"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
