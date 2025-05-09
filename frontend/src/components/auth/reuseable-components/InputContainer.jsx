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
import { Icon, FormInput } from "../../../index";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputContainer = ({
  type,
  placeholder,
  icon,
  isPassword,
  customClass = "",
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

  const iconClasses =
    "absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400";
  const finalIconClasses = isPassword
    ? `${iconClasses} cursor-pointer`
    : iconClasses;

  return (
    <div className={`relative ${customClass}`}>
      {icon && (
        <Icon
          icon={displayIcon}
          className={finalIconClasses}
          onClick={isPassword ? togglePasswordVisibility : undefined}
        />
      )}
      <FormInput type={inputType} placeholder={placeholder} {...props} />
    </div>
  );
};

export default InputContainer;
