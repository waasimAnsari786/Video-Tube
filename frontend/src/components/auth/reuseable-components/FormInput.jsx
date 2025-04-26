import React from "react";
import Icon from "../../resuseable-components/Icon";

const FormInput = ({ type, placeholder, icon, ...props }) => (
  <div className="relative">
    <Icon
      icon={icon}
      className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      type={type}
      placeholder={placeholder}
      className="w-full pl-14 pr-7 py-4 text-gray-700 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
      {...props}
    />
  </div>
);

export default FormInput;
