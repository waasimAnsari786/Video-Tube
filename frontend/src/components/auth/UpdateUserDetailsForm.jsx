import React from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { InputContainer, Row, Column } from "../../index";
import showFormErrors from "../../utils/showFormError";
import { toast } from "react-toastify";
import { updateUserDetailsThunk } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UpdateUserDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleUpdateDetails = async (data) => {
    const result = await dispatch(
      updateUserDetailsThunk({
        url: "/users/me",
        payload: data,
        config: {},
      })
    );
    if (updateUserDetailsThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpdateDetails, (formErrors) =>
        showFormErrors(formErrors)
      )}
    >
      <Row customRowClass="border-b-[1px] border-(--my-border-dark) pb-5">
        <Column customColClass={"md:col-span-6 col-span-12"}>
          <InputContainer
            type="text"
            placeholder="Full Name"
            icon={<FaUser />}
            {...register("fullName")}
          />
        </Column>
        <Column customColClass={"md:col-span-6 col-span-12"}>
          <InputContainer
            type="email"
            placeholder="Email Address"
            icon={<FaEnvelope />}
            {...register("email", {
              pattern: {
                value:
                  /^[\da-zA-Z]+(?:[+%._-][\da-zA-Z]+)*@(?:[-.])*[a-zA-Z\d]+(?:[-])*\.[A-Za-z]{2,}$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </Column>
      </Row>
    </form>
  );
};

export default UpdateUserDetailsForm;
