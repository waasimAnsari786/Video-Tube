import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updatePasswordThunk } from "../../features/authSlice";
import showFormErrors from "../../utils/showFormError";
import {
  PasswordInputContainer,
  Row,
  Column,
  FormButton,
  ProfileTitle,
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
    >
      <Row customRowClass="border-b-[1px] border-(--my-border-dark) pb-5">
        <Column customColClass="flex justify-between items-center col-span-12">
          <ProfileTitle title="Password" />
          <FormButton
            label="Update Password"
            customClasss="sm:p-2 p-1.5 rounded-sm"
          />
        </Column>
        <Column customColClass={"md:col-span-4 col-span-12"}>
          <PasswordInputContainer
            placeholder="Old Password"
            inpMargin="my-0"
            {...register("oldPassword", {
              required: "Old password is required",
            })}
          />
        </Column>
        <Column customColClass={"md:col-span-4 col-span-12"}>
          <PasswordInputContainer
            placeholder="New Password"
            inpMargin="my-0"
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
        </Column>
        <Column customColClass={"md:col-span-4 col-span-12"}>
          <PasswordInputContainer
            placeholder="Confirm Password"
            inpMargin="my-0"
            {...register("confirmPassword", {
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
          />
        </Column>
      </Row>
    </form>
  );
};

export default UpdatePasswordForm;
