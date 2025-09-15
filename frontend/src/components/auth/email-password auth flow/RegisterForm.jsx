import React from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  Logo,
  FormHeading,
  FormText,
  InputContainer,
  FormButton,
  PasswordInputContainer,
  useAbortController,
} from "../../../index";
import showFormErrors from "../../../utils/showFormError";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUserThunk } from "../../../store/slices/authSlice";
import { ERROR_CODES } from "../../../constant";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      fullName: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const abortController = useAbortController();

  const handleRegister = async (formData) => {
    const result = await dispatch(
      registerUserThunk({
        url: "/users",
        payload: formData,
        config: { signal: abortController.current.signal },
      })
    );

    // Handle success / errors directly
    if (registerUserThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/verify-email");
    } else {
      const errorCode = result.payload?.errorCode;
      if (errorCode === ERROR_CODES.REQUEST_CANCELLED_ERROR_CODE) {
        console.log("Register user request cancelled");
      } else {
        toast.error(result.payload?.message || "Registration failed");
      }
    }
  };

  return (
    <>
      <Logo logoClass={"my-5"} />

      <form
        onSubmit={handleSubmit(handleRegister, (formErrors) =>
          showFormErrors(formErrors)
        )}
        className="bg-white shadow-2xl rounded-xl p-5 md:p-10 text-center w-full md:w-1/2"
      >
        <FormHeading title="Register" />

        {/* fullname Field */}
        <InputContainer
          type="text"
          placeholder="Full Name"
          icon={<FaUser />}
          {...register("fullName", {
            required: "Full name is required",
          })}
        />

        {/* Email Field */}
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

        {/* Username Field */}
        <InputContainer
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
        {/* Password Field */}
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

        <FormButton label="Register" loadingLabel="Signing Up..." />
        <FormText
          text="Already have an account?"
          linkText="Login"
          linkTo="/login"
        />
      </form>
    </>
  );
};

export default RegisterForm;
