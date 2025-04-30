import React from "react";

const FormInput = ({ type, placeholder, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full pl-14 pr-7 py-4 text-gray-700 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
      {...props}
    />
  );
};

export default FormInput;
