import React from "react";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updatePasswordThunk } from "../../features/authSlice";
import showFormErrors from "../../utils/showFormError";
import FormHeading from "./reuseable-components/FormHeading";
import FormText from "./reuseable-components/FormText";
import InputContainer from "./reuseable-components/InputContainer";
import FormButton from "./reuseable-components/FormButton";
import { useNavigate } from "react-router-dom";

const UpdatePasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch } = useForm();

  const handleUpdatePassword = async (data) => {
    const result = await dispatch(updatePasswordThunk(data));
    if (updatePasswordThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
    reset();
  };

  return (
    <section className="h-screen flex items-center flex-col justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-2xl rounded-xl p-10 text-center">
          <FormHeading title="Update Password" />
          <FormText text="Update your account password" />

          <form
            onSubmit={handleSubmit(handleUpdatePassword, (formErrors) =>
              showFormErrors(formErrors)
            )}
          >
            <div className="space-y-5 mb-5">
              <InputContainer
                type="password"
                placeholder="Old Password"
                icon={<FaLock />}
                isPassword
                {...register("oldPassword", {
                  required: "Old password is required",
                })}
              />
              <InputContainer
                type="password"
                placeholder="New Password"
                icon={<FaLock />}
                isPassword
                {...register("newPassword", {
                  required: "New password is required",
                  pattern: {
                    value:
                      /^(?!.*(.)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
                    message:
                      "Password must have uppercase, lowercase, number, special character, no repeats, 8+ chars.",
                  },
                })}
              />
              <InputContainer
                type="password"
                placeholder="Confirm Password"
                icon={<FaLock />}
                isPassword
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
              />
            </div>

            <FormButton label="Update Password" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdatePasswordForm;
