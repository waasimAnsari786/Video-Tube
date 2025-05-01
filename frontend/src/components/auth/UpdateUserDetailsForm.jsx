import React from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Logo from "./reuseable-components/Logo";
import FormHeading from "./reuseable-components/FormHeading";
import FormText from "./reuseable-components/FormText";
import InputContainer from "./reuseable-components/InputContainer";
import FormButton from "./reuseable-components/FormButton";
import showFormErrors from "../../utils/showFormError";
import { toast } from "react-toastify";
import { updateUserDetailsThunk } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UpdateUserDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleUpdateDetails = async (data) => {
    const result = await dispatch(updateUserDetailsThunk(data));
    if (updateUserDetailsThunk.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
    reset();
  };

  return (
    <section className="h-screen flex items-center flex-col justify-center">
      <Logo src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" />
      <div className="w-full max-w-md mx-auto mt-5">
        <div className="bg-white shadow-2xl rounded-xl p-10 text-center">
          <FormHeading title="Update Profile" />
          <FormText text="Edit your details below" />

          <form
            onSubmit={handleSubmit(handleUpdateDetails, (formErrors) =>
              showFormErrors(formErrors)
            )}
          >
            <div className="space-y-5 mb-5">
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

            <div className="text-center">
              <FormButton label={isSubmitting ? "Updating..." : "Update"} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateUserDetailsForm;
