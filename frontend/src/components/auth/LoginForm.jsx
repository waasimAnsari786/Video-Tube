import React from "react";
import Logo from "./reuseable-components/Logo";
import FormHeading from "./reuseable-components/FormHeading";
import FormInput from "./reuseable-components/FormInput";
import FormButton from "./reuseable-components/FormButton";
import FormText from "./reuseable-components/FormText";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const handleLogin = (data) => {
    console.log(data);
    console.log(errors);

    reset();
  };
  return (
    <section className="h-screen flex items-center flex-col justify-center">
      <Logo
        src={
          "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
        }
      />
      <div className="w-full max-w-md mx-auto mt-5">
        <div className="bg-white shadow-2xl rounded-xl p-10 text-center">
          <FormHeading title="Login" />
          <FormText text="Enter your details below" />

          <form className="mt-5" onSubmit={handleSubmit(handleLogin)}>
            <div className="space-y-5 mb-5">
              <FormInput
                type="email"
                placeholder="Email Address"
                icon={<FaEnvelope />}
                {...register("email", {
                  required: "Email is required",
                  pattern:
                    /^[da-zA-Z]+(?:[+%._-][da-zA-Z]+)*@(?:[-.])*[a-zA-Zd]+(?:[-])*.[A-Za-z]{2,}$/,
                })}
              />
              {errors.email && <p>{errors.email.message}</p>}
              <FormInput
                type="password"
                placeholder="Password"
                icon={<FaLock />}
                {...register("password", {
                  required: "Password is required",
                  pattern:
                    /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
                })}
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div className="text-center">
              <FormButton label="Sign In" />
              <FormText
                text="Don't have an account?"
                linkText="Register"
                linkTo="/register"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
