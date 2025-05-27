/**
 * This component is a container of input and icon for all form. It is a reusable component
 * for creating a field with icon and input in all forms of this app. specifically, It
 * checks for password fields for implementing the show/hide password functionality on
 * icon of those fieds. It expects a prop "isPassword". If this prope is passed in this
 * component it assigns "togglePasswordVisibility()" method to that field's icon's "onClick"
 * event listener. This method toggles the state "showPassword" for changing the field's
 * type and selecting an icon to display.
 */
import React, { useState } from "react";
import { Icon, FormInput, Row, Column } from "../../../index";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputContainer = ({
  type,
  placeholder,
  icon,
  isPassword,
  customClass = "",
  customInpClass = "py-4",
  iconOnClick = undefined,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const displayIcon = isPassword ? (
    showPassword ? (
      <FaEyeSlash />
    ) : (
      <FaEye />
    )
  ) : (
    icon
  );

  return (
    <Row
      customRowClass={`relative px-2 rounded-lg ${customClass} my-border-light focus-within:ring-2 focus-within:ring-(--my-border-dark)`}
    >
      <Column
        customColClass="col-span-1 flex justify-center items-center cursor-pointer"
        onClick={iconOnClick}
      >
        <Icon icon={displayIcon} className={"text-gray-400"} />
      </Column>
      <Column customColClass="col-span-11">
        <FormInput
          type={inputType}
          placeholder={placeholder}
          customInpClass={customInpClass}
          {...props}
        />
      </Column>
    </Row>
  );
};

export default InputContainer;
