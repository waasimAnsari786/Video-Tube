import React from "react";
import Icon from "../../resuseable-components/Icon";
import FormInput from "./FormInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormContextCustom } from "../../../context/FormContext";

const InputContainer = ({ type, placeholder, icon, isPassword, ...props }) => {
  const { showPassword, togglePasswordVisibility } = useFormContextCustom();

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
    <div className="relative">
      <Icon
        icon={displayIcon}
        className={finalIconClasses}
        onClick={isPassword ? togglePasswordVisibility : undefined}
      />
      <FormInput type={inputType} placeholder={placeholder} {...props} />
    </div>
  );
};

export default InputContainer;
