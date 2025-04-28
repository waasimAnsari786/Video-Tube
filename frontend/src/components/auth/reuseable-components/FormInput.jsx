import React from "react";
import { useFormContextCustom } from "../../../context/FormContext";
import Icon from "../../resuseable-components/Icon";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormInput = ({ type, placeholder, icon, isPassword, ...props }) => {
  const { showPassword, togglePasswordVisibility } = useFormContextCustom();

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputIcon = isPassword ? (
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
        icon={inputIcon}
        className={finalIconClasses}
        onClick={isPassword ? togglePasswordVisibility : undefined}
      />
      <input
        type={inputType}
        placeholder={placeholder}
        className="w-full pl-14 pr-7 py-4 text-gray-700 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        {...props}
      />
    </div>
  );
};

export default FormInput;
