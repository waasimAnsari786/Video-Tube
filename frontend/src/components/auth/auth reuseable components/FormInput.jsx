import React from "react";

const FormInput = ({ type, placeholder, customInpClass, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full text-sm focus:outline-none ${customInpClass}`}
      {...props}
    />
  );
};

export default FormInput;
