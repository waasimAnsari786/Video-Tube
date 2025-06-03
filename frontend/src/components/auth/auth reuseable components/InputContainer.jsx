/**
 * This component is a container of input and icon for all form. It is a reusable component
 * for creating a field with icon and input in all forms of this app. specifically, It
 * checks for password fields for implementing the show/hide password functionality on
 * icon of those fieds. It expects a prop "isPassword". If this prope is passed in this
 * component it assigns "togglePasswordVisibility()" method to that field's icon's "onClick"
 * event listener. This method toggles the state "showPassword" for changing the field's
 * type and selecting an icon to display.
 */
import React from "react";
import { FormInput } from "../../../index";

const InputContainer = ({
  type,
  placeholder,
  icon,
  customClass = "",
  customInpClass = "",
  inpPadding = "py-3 sm:py-4",
  inpMargin = "my-3",
  iconOnClick = undefined,
  ...props
}) => {
  return (
    <FormInput
      type={type}
      placeholder={placeholder}
      iconOnClick={iconOnClick}
      icon={icon}
      customClass={customClass}
      customInpClass={customInpClass}
      padding={inpPadding}
      margin={inpMargin}
      {...props}
    />
  );
};

export default InputContainer;
