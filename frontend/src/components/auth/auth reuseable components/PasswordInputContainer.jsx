import React from "react";
import { FormInput, useToggle } from "../../../index";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInputContainer({
  placeholder,
  customClass = "",
  customInpClass = "",
  iconOnClick = undefined,
  ...props
}) {
  const { toggle, handleToggle } = useToggle();
  return (
    <FormInput
      type={!toggle ? "password" : "text"}
      placeholder={placeholder}
      icon={!toggle ? <FaEye /> : <FaEyeSlash />}
      iconOnClick={handleToggle}
      {...props}
    />
  );
}
