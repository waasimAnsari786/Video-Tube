import React from "react";

const FormInput = ({ type, placeholder, customInpClass, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full pl-14 pr-7 text-gray-700 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 ${customInpClass}`}
      {...props}
    />
  );
};

export default FormInput;
