import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  Logo,
  FormHeading,
  FormText,
  InputContainer,
  FormButton,
  Container,
  PasswordInputContainer,
} from "../../index";
import showFormErrors from "../../utils/showFormError";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserThunk } from "../../store/slices/authSlice";

const LoginForm = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (data) => {
    const result = await dispatch(
      loginUserThunk({
        url: "/users/login",
        payload: data,
      })
    );
    if (loginUserThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <Container childElemClass="h-screen flex items-center flex-col justify-center">
      <Logo src="/images/logo.png" logoClass={"mb-5"} />

      <form
        onSubmit={handleSubmit(handleLogin, (formErrors) =>
          showFormErrors(formErrors)
        )}
        className="bg-white shadow-2xl rounded-xl p-5 md:p-10 text-center w-full md:w-1/2"
      >
        <FormHeading title="Login" />

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

        <PasswordInputContainer
          placeholder="Password"
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

        <FormButton label="Sign In" loadingLabel="Signing in..." />
        <FormText
          text="Don't have an account?"
          linkText="Register"
          linkTo="/register"
        />
      </form>
    </Container>
  );
};

export default LoginForm;
