import React from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  Logo,
  FormHeading,
  FormText,
  InputContainer,
  FormButton,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserThunk } from "../../features/authSlice";

const LoginForm = () => {
  const { register, reset, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data) => {
    const result = await dispatch(loginUserThunk(data));
    if (loginUserThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload || "Login failed");
    }
    reset();
  };

  return (
    <section className="h-screen flex items-center flex-col justify-center">
      <Logo src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" />
      <div className="w-full max-w-md mx-auto mt-5">
        <div className="bg-white shadow-2xl rounded-xl p-10 text-center">
          <FormHeading title="Login" />
          <FormText text="Enter your details below" />

          <form
            onSubmit={handleSubmit(handleLogin, (formErrors) =>
              showFormErrors(formErrors)
            )}
          >
            <div className="space-y-5 mb-5">
              <InputContainer
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

              <InputContainer
                type="password"
                placeholder="Password"
                isPassword
                icon={<FaLock />}
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
