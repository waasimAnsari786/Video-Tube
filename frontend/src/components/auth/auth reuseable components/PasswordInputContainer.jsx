import React from "react";
import { FormInput, useToggle } from "../../../index";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInputContainer({
  placeholder,
  customClass = "",
  customInpClass = "py-3 sm:py-4",
  iconOnClick = undefined,
  ...props
}) {
  const { toggle, handleToggle } = useToggle();

  return (
    <FormInput
      customClass={customClass}
      customInpClass={customInpClass}
      type={!toggle ? "password" : "text"}
      placeholder={placeholder}
      icon={!toggle ? <FaEye /> : <FaEyeSlash />}
      iconOnClick={handleToggle}
      {...props}
    />
  );
}
