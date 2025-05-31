import React from "react";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updatePasswordThunk } from "../../features/authSlice";
import showFormErrors from "../../utils/showFormError";
import {
  InputContainer,
  FormButton,
  PasswordInputContainer,
} from "../../index";
import { useNavigate } from "react-router-dom";

const UpdatePasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch } = useForm();

  const handleUpdatePassword = async (data) => {
    const result = await dispatch(
      updatePasswordThunk({
        url: "/users/me/password",
        payload: data,
        config: {},
      })
    );
    if (updatePasswordThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdatePassword, (formErrors) =>
        showFormErrors(formErrors)
      )}
      className="bg-white shadow-2xl rounded-xl p-10 text-center"
    >
      <div className="grid grid-cols-3 mb-2 gap-2">
        <PasswordInputContainer
          placeholder="Old Password"
          {...register("oldPassword", {
            required: "Old password is required",
          })}
        />
        <PasswordInputContainer
          placeholder="New Password"
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
        <PasswordInputContainer
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            validate: (value) =>
              value === watch("newPassword") || "Passwords do not match",
          })}
        />
      </div>

      <div className="text-center mx-auto w-1/2 mt-5">
        <FormButton
          label={"Update Password"}
          loadingLabel="Updating Password..."
        />
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
