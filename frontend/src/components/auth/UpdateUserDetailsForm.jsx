import React from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { InputContainer, FormButton } from "../../index";
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
      className="bg-white shadow-2xl rounded-xl p-5 sm:p-10"
    >
      <div className="grid md:grid-cols-2 mb-2 gap-2">
        <InputContainer
          type="text"
          placeholder="Full Name"
          icon={<FaUser />}
          {...register("fullName")}
        />

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
      </div>

      <div className="text-center mx-auto w-1/2 mt-5">
        <FormButton
          label={"Update Details"}
          loadingLabel="Updaitng Details..."
        />
      </div>
    </form>
  );
};

export default UpdateUserDetailsForm;
